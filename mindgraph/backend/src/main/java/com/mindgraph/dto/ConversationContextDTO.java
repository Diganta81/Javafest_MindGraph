package com.mindgraph.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ConversationContextDTO {
    private String sessionId;
    private String currentIntent;
    private String currentStep;
    private Map<String, Object> collectedData;
    private List<String> conversationHistory;
    private LocalDateTime lastInteraction;
    private boolean isComplete;

    public ConversationContextDTO() {
        this.collectedData = new HashMap<>();
        this.conversationHistory = new ArrayList<>();
        this.lastInteraction = LocalDateTime.now();
        this.isComplete = false;
    }

    public ConversationContextDTO(String sessionId) {
        this();
        this.sessionId = sessionId;
    }

    // Getters and Setters
    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(String sessionId) {
        this.sessionId = sessionId;
    }

    public String getCurrentIntent() {
        return currentIntent;
    }

    public void setCurrentIntent(String currentIntent) {
        this.currentIntent = currentIntent;
    }

    public String getCurrentStep() {
        return currentStep;
    }

    public void setCurrentStep(String currentStep) {
        this.currentStep = currentStep;
    }

    public Map<String, Object> getCollectedData() {
        return collectedData;
    }

    public void setCollectedData(Map<String, Object> collectedData) {
        this.collectedData = collectedData;
    }

    public List<String> getConversationHistory() {
        return conversationHistory;
    }

    public void setConversationHistory(List<String> conversationHistory) {
        this.conversationHistory = conversationHistory;
    }

    public LocalDateTime getLastInteraction() {
        return lastInteraction;
    }

    public void setLastInteraction(LocalDateTime lastInteraction) {
        this.lastInteraction = lastInteraction;
    }

    public boolean isComplete() {
        return isComplete;
    }

    public void setComplete(boolean complete) {
        isComplete = complete;
    }

    // Helper methods
    public void addToHistory(String message) {
        this.conversationHistory.add(message);
        this.lastInteraction = LocalDateTime.now();
    }

    public void addCollectedData(String key, Object value) {
        this.collectedData.put(key, value);
    }

    public Object getCollectedData(String key) {
        return this.collectedData.get(key);
    }

    public String getFullConversationHistory() {
        return String.join("\n", this.conversationHistory);
    }
}