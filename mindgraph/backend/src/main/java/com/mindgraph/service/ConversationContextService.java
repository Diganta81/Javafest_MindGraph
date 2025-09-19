package com.mindgraph.service;

import com.mindgraph.dto.ConversationContextDTO;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class ConversationContextService {
    
    // In-memory storage for conversation contexts
    // In production, you might want to use Redis or database
    private final Map<String, ConversationContextDTO> conversationContexts = new ConcurrentHashMap<>();
    
    // Context expiry time (30 minutes)
    private static final long CONTEXT_EXPIRY_MINUTES = 30;

    public ConversationContextDTO getOrCreateContext(String sessionId) {
        ConversationContextDTO context = conversationContexts.get(sessionId);
        
        if (context == null) {
            context = new ConversationContextDTO(sessionId);
            conversationContexts.put(sessionId, context);
        } else {
            // Check if context has expired
            if (isContextExpired(context)) {
                context = new ConversationContextDTO(sessionId);
                conversationContexts.put(sessionId, context);
            }
        }
        
        return context;
    }

    public void updateContext(ConversationContextDTO context) {
        context.setLastInteraction(LocalDateTime.now());
        conversationContexts.put(context.getSessionId(), context);
    }

    public void clearContext(String sessionId) {
        conversationContexts.remove(sessionId);
    }

    public void addMessageToHistory(String sessionId, String userMessage, String botResponse) {
        ConversationContextDTO context = getOrCreateContext(sessionId);
        context.addToHistory("User: " + userMessage);
        context.addToHistory("Bot: " + botResponse);
        updateContext(context);
    }

    public boolean hasActiveContext(String sessionId) {
        ConversationContextDTO context = conversationContexts.get(sessionId);
        return context != null && !isContextExpired(context) && !context.isComplete();
    }

    public String getConversationHistory(String sessionId) {
        ConversationContextDTO context = conversationContexts.get(sessionId);
        if (context != null) {
            return context.getFullConversationHistory();
        }
        return "";
    }

    private boolean isContextExpired(ConversationContextDTO context) {
        return context.getLastInteraction()
                .isBefore(LocalDateTime.now().minusMinutes(CONTEXT_EXPIRY_MINUTES));
    }

    public void markContextComplete(String sessionId) {
        ConversationContextDTO context = conversationContexts.get(sessionId);
        if (context != null) {
            context.setComplete(true);
            updateContext(context);
        }
    }

    public void setCurrentIntent(String sessionId, String intent, String step) {
        ConversationContextDTO context = getOrCreateContext(sessionId);
        context.setCurrentIntent(intent);
        context.setCurrentStep(step);
        updateContext(context);
    }

    public void addCollectedData(String sessionId, String key, Object value) {
        ConversationContextDTO context = getOrCreateContext(sessionId);
        context.addCollectedData(key, value);
        updateContext(context);
    }

    // Clean up expired contexts periodically
    public void cleanExpiredContexts() {
        conversationContexts.entrySet().removeIf(entry -> 
            isContextExpired(entry.getValue()));
    }
}