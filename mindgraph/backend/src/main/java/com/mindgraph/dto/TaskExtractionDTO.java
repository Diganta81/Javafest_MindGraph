package com.mindgraph.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

public class TaskExtractionDTO {
    // MANDATORY FIELDS ONLY
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Integer durationMinutes; // Alternative to endTime
    
    // OPTIONAL FIELDS (will use defaults if not provided)
    private String description;
    private String type = "OTHER"; // Default
    private String priority = "MEDIUM"; // Default
    
    // Extraction metadata
    private boolean isComplete;
    private List<String> missingMandatoryFields;
    private String extractedInfo; // What was successfully extracted
    
    public TaskExtractionDTO() {
        this.missingMandatoryFields = new ArrayList<>();
    }

    // Check if we have minimum required info to create a task
    public boolean hasMinimumRequiredInfo() {
        return title != null && !title.trim().isEmpty() && 
               startTime != null && 
               (endTime != null || durationMinutes != null);
    }

    // Getters and Setters for mandatory fields
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public LocalDateTime getStartTime() {
        return startTime;
    }

    public void setStartTime(LocalDateTime startTime) {
        this.startTime = startTime;
    }

    public LocalDateTime getEndTime() {
        return endTime;
    }

    public void setEndTime(LocalDateTime endTime) {
        this.endTime = endTime;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    // Calculate end time if duration is provided
    public LocalDateTime getCalculatedEndTime() {
        if (endTime != null) {
            return endTime;
        } else if (startTime != null && durationMinutes != null) {
            return startTime.plusMinutes(durationMinutes);
        }
        return null;
    }

    // Optional fields
    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type != null ? type : "OTHER";
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority != null ? priority : "MEDIUM";
    }

    // Extraction metadata
    public boolean isComplete() {
        return isComplete;
    }

    public void setComplete(boolean complete) {
        isComplete = complete;
    }

    public List<String> getMissingMandatoryFields() {
        return missingMandatoryFields;
    }

    public void setMissingMandatoryFields(List<String> missingMandatoryFields) {
        this.missingMandatoryFields = missingMandatoryFields;
    }

    public String getExtractedInfo() {
        return extractedInfo;
    }

    public void setExtractedInfo(String extractedInfo) {
        this.extractedInfo = extractedInfo;
    }

    // Helper method to get missing fields as string
    public String getMissingFieldsAsString() {
        return missingMandatoryFields != null ? String.join(", ", missingMandatoryFields) : "";
    }

    // Validation method
    public void validateAndSetMissingFields() {
        missingMandatoryFields.clear();
        
        if (title == null || title.trim().isEmpty()) {
            missingMandatoryFields.add("title");
        }
        if (startTime == null) {
            missingMandatoryFields.add("start time");
        }
        if (endTime == null && durationMinutes == null) {
            missingMandatoryFields.add("end time or duration");
        }
        
        isComplete = missingMandatoryFields.isEmpty();
    }

    @Override
    public String toString() {
        return "TaskExtractionDTO{" +
                "title='" + title + '\'' +
                ", startTime=" + startTime +
                ", endTime=" + endTime +
                ", durationMinutes=" + durationMinutes +
                ", isComplete=" + isComplete +
                ", missingFields=" + missingMandatoryFields +
                '}';
    }
}