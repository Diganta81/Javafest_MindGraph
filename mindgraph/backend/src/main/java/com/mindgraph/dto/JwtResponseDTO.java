package com.mindgraph.dto;

public class JwtResponseDTO {
    private String token;
    private String type = "Bearer";
    private String username;
    private String email;
    private String firstName;
    private String lastName;

    // Constructors
    public JwtResponseDTO() {}

    public JwtResponseDTO(String token, String username, String email, String firstName, String lastName) {
        this.token = token;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getFirstName() { return firstName; }
    public void setFirstName(String firstName) { this.firstName = firstName; }

    public String getLastName() { return lastName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
}
