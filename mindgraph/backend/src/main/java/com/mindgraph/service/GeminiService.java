package com.mindgraph.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class GeminiService {
    
    private static final Logger logger = LoggerFactory.getLogger(GeminiService.class);
    
    @Value("${gemini.api.key}")
    private String apiKey;
    
    @Value("${gemini.api.url}")
    private String apiUrl;
    
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    public GeminiService() {
        this.webClient = WebClient.builder()
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .build();
        this.objectMapper = new ObjectMapper();
    }
    
    public String generateResponse(String userMessage) {
        try {
            // Enhanced debugging output
            System.out.println("=== GEMINI SERVICE DEBUG ===");
            System.out.println("Processing user message: " + userMessage);
            
            // Construct the request body for Gemini API
            Map<String, Object> requestBody = createGeminiRequestBody(userMessage);
            
            System.out.println("Enhanced prompt: " + enhancePrompt(userMessage));
            System.out.println("API URL: " + apiUrl);
            System.out.println("API Key present: " + (apiKey != null && !apiKey.isEmpty() && !apiKey.equals("YOUR_GEMINI_API_KEY_HERE")));
            System.out.println("============================");
            
            // Make the API call with correct headers
            String response = webClient.post()
                    .uri(apiUrl)
                    .header("X-goog-api-key", apiKey)
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .timeout(Duration.ofSeconds(30))
                    .block();
            
            // Parse and extract the response text
            String extractedResponse = extractResponseText(response);
            
            System.out.println("=== GEMINI RESPONSE DEBUG ===");
            System.out.println("Raw API response: " + response);
            System.out.println("Extracted response: " + extractedResponse);
            System.out.println("=============================");
            
            return extractedResponse;
            
        } catch (WebClientResponseException e) {
            logger.error("Gemini API error: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            return "I'm sorry, I'm having trouble processing your request right now. Please try again later.";
        } catch (Exception e) {
            logger.error("Error calling Gemini API", e);
            return "I'm sorry, something went wrong while processing your request.";
        }
    }
    
    private Map<String, Object> createGeminiRequestBody(String userMessage) {
        Map<String, Object> requestBody = new HashMap<>();
        
        // Create the contents array
        Map<String, Object> content = new HashMap<>();
        Map<String, String> part = new HashMap<>();
        part.put("text", enhancePrompt(userMessage));
        content.put("parts", List.of(part));
        
        requestBody.put("contents", List.of(content));
        
        // Add generation config for better responses
        Map<String, Object> generationConfig = new HashMap<>();
        generationConfig.put("temperature", 0.7);
        generationConfig.put("topK", 40);
        generationConfig.put("topP", 0.95);
        generationConfig.put("maxOutputTokens", 1024);
        requestBody.put("generationConfig", generationConfig);
        
        return requestBody;
    }
    
    private String enhancePrompt(String userMessage) {
        // Add context about the MindGraph application
        String systemContext = "You are an AI assistant for MindGraph, a smart scheduling and task management system. " +
                "You help users with scheduling, task management, time optimization, and productivity advice. " +
                "Be helpful, concise, and focus on productivity and time management topics. " +
                "User's message: ";
        
        return systemContext + userMessage;
    }
    
    private String extractResponseText(String response) {
        try {
            JsonNode jsonNode = objectMapper.readTree(response);
            JsonNode candidates = jsonNode.get("candidates");
            
            if (candidates != null && candidates.isArray() && candidates.size() > 0) {
                JsonNode firstCandidate = candidates.get(0);
                JsonNode content = firstCandidate.get("content");
                
                if (content != null) {
                    JsonNode parts = content.get("parts");
                    if (parts != null && parts.isArray() && parts.size() > 0) {
                        JsonNode firstPart = parts.get(0);
                        JsonNode text = firstPart.get("text");
                        if (text != null) {
                            return text.asText();
                        }
                    }
                }
            }
            
            logger.warn("Unexpected response format from Gemini API: {}", response);
            return "I received a response but couldn't understand the format. Please try again.";
            
        } catch (Exception e) {
            logger.error("Error parsing Gemini API response", e);
            return "I'm sorry, I couldn't parse the response properly.";
        }
    }
}