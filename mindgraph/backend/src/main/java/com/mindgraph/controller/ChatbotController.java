package com.mindgraph.controller;

import com.mindgraph.dto.ChatRequestDTO;
import com.mindgraph.dto.ChatResponseDTO;
import com.mindgraph.service.GeminiService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chatbot")
@CrossOrigin(origins = "http://localhost:3000")
public class ChatbotController {
    
    private static final Logger logger = LoggerFactory.getLogger(ChatbotController.class);
    
    @Autowired
    private GeminiService geminiService;
    
    @PostMapping("/message")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ChatResponseDTO> sendMessage(@Valid @RequestBody ChatRequestDTO request) {
        try {
            // Enhanced debugging output
            System.out.println("=== CHATBOT REQUEST DEBUG ===");
            System.out.println("Timestamp: " + java.time.LocalDateTime.now());
            System.out.println("Received message: " + request.getMessage());
            System.out.println("Message length: " + request.getMessage().length());
            System.out.println("===============================");
            
            logger.info("Received chat message: {}", request.getMessage());
            
            // Get response from Gemini API
            String geminiResponse = geminiService.generateResponse(request.getMessage());
            
            // Create and return response
            ChatResponseDTO response = new ChatResponseDTO(geminiResponse);
            
            // Enhanced debugging output for response
            System.out.println("=== CHATBOT RESPONSE DEBUG ===");
            System.out.println("Generated response: " + geminiResponse);
            System.out.println("Response length: " + geminiResponse.length());
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
    
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Chatbot service is running");
    }
}