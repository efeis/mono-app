package com.example.mono_backend.dto;

// POST REQUEST DTO
// data transfer object for incoming post creation and like requests
public class PostRequest {
    private String content;  // post content
    private String username; // user making the request

    // getters and setters
    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
