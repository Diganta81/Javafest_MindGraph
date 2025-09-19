package com.mindgraph.dto;

import java.time.LocalDateTime;

public class ChatResponseDTO {
    
    private String response;
    private LocalDateTime timestamp;
    private String status;
    private String error;
    
    public ChatResponseDTO() {
        this.timestamp = LocalDateTime.now();
    }
    
    public ChatResponseDTO(String response) {
        this.response = response;
        this.timestamp = LocalDateTime.now();
        this.status = "success";
    }
    
    public ChatResponseDTO(String response, String status) {
        this.response = response;
        this.timestamp = LocalDateTime.now();
        this.status = status;
    }
    
    public String getResponse() {
        return response;
    }
    
    public void setResponse(String response) {
        this.response = response;
    }
    
    public LocalDateTime getTimestamp() {
        return timestamp;
    }
    
    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public String getError() {
        return error;
    }
    
    public void setError(String error) {
        this.error = error;
    }
}