package com.mindgraph.controller;

import com.mindgraph.dto.ChatRequestDTO;
import com.mindgraph.dto.ChatResponseDTO;
import com.mindgraph.entity.User;
import com.mindgraph.repository.UserRepository;
import com.mindgraph.service.IntelligentChatbotService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatbotController {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);
    
    @Autowired
    private IntelligentChatbotService intelligentChatbotService;
    
    @Autowired
    private UserRepository userRepository;
    
    @PostMapping("/message")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ChatResponseDTO> sendMessage(@Valid @RequestBody ChatRequestDTO request, 
                                                      Authentication authentication) {
        try {
            // Enhanced debugging output
            System.out.println("=== CHATBOT REQUEST DEBUG ===");
            System.out.println("Timestamp: " + java.time.LocalDateTime.now());
            System.out.println("Received message: " + request.getMessage());
            System.out.println("Message length: " + request.getMessage().length());
            System.out.println("User: " + authentication.getName());
            System.out.println("===============================");
            
            logger.info("Received chat message: {}", request.getMessage());
            
            // Get current user from authentication
            User currentUser = getCurrentUser(authentication);
            
            // Generate session ID (use provided sessionId or create new one)
            String sessionId = request.getSessionId() != null ? 
                request.getSessionId() : generateSessionId(currentUser, request);
            
            // Use intelligent chatbot service for processing
            ChatResponseDTO response = intelligentChatbotService.processMessage(
                request.getMessage(), sessionId, currentUser);
            
            // Enhanced debugging output for response
            System.out.println("=== CHATBOT RESPONSE DEBUG ===");
            System.out.println("Generated response: " + response.getResponse());
            System.out.println("Response length: " + response.getResponse().length());
            System.out.println("===============================");
            
            logger.info("Sending chat response");
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            logger.error("Error processing chat message", e);
            
            ChatResponseDTO errorResponse = new ChatResponseDTO();
            errorResponse.setResponse("I'm sorry, I encountered an error while processing your message. Please try again.");
            errorResponse.setStatus("error");
            errorResponse.setError(e.getMessage());
            
            return ResponseEntity.internalServerError().body(errorResponse);
        }
    }
    
    private User getCurrentUser(Authentication authentication) {
        try {
            // The authentication principal should be the User entity since it implements UserDetails
            if (authentication.getPrincipal() instanceof User) {
                return (User) authentication.getPrincipal();
            }
            
            // Fallback: fetch user from database by username
            String username = authentication.getName();
            return userRepository.findByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found: " + username));
                    
        } catch (Exception e) {
            logger.error("Error getting current user", e);
            throw new RuntimeException("Unable to get current user", e);
        }
    }
    
    private String generateSessionId(User user, ChatRequestDTO request) {
        // Generate a session ID based on user and timestamp
        // In a real application, you might want to use a more sophisticated approach
        return "session_" + user.getId() + "_" + System.currentTimeMillis();
    }
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Chatbot service is running");
    }
}