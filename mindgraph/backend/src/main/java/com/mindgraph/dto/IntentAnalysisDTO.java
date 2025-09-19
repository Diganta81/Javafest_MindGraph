package com.mindgraph.dto;

public class IntentAnalysisDTO {
    private String intent;
    private Double confidence;
    private String action;
    private String entity;
    private String explanation;

    public IntentAnalysisDTO() {}

    public IntentAnalysisDTO(String intent, Double confidence, String action) {
        this.intent = intent;
        this.confidence = confidence;
        this.action = action;
    }

    // Getters and Setters
    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public Double getConfidence() {
        return confidence;
    }

    public void setConfidence(Double confidence) {
        this.confidence = confidence;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }

    public String getEntity() {
        return entity;
    }

    public void setEntity(String entity) {
        this.entity = entity;
    }

    public String getExplanation() {
        return explanation;
    }

    public void setExplanation(String explanation) {
        this.explanation = explanation;
    }
}