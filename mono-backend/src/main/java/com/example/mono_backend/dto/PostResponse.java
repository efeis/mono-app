// POST RESPONSE DTO
// data transfer object for outgoing post data with computed fields
package com.example.mono_backend.dto;

import java.time.LocalDateTime;

public class PostResponse {
    private Long id;
    private String username;
    private String content;
    private int likes;
    private LocalDateTime timestamp;
    private boolean likedByUser;

    public PostResponse(Long id, String username, String content,
                        int likes, LocalDateTime timestamp,
                        boolean likedByUser) {
        this.id = id;
        this.username = username;
        this.content = content;
        this.likes = likes;
        this.timestamp = timestamp;
        this.likedByUser = likedByUser;
    }

    // getters
    public Long getId() { return id; }
    public String getUsername() { return username; }
    public String getContent() { return content; }
    public int getLikes() { return likes; }
    public LocalDateTime getTimestamp() { return timestamp; }
    public boolean isLikedByUser() { return likedByUser; }
}
