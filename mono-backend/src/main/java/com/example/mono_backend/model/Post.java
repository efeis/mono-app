package com.example.mono_backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

// POST ENTITY
// represents a microblog post in the database

@Entity
@Table(name = "posts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment ID
    private Long id;

    @Column(nullable = false, length = 300) // max 300 char limit like twitter :p
    private String content;

    @Column(nullable = false) // like counter
    private int likes = 0;

    @Column(nullable = false) // when post was created
    private LocalDateTime timestamp;

    // relationship to user who created the post
    @ManyToOne(fetch = FetchType.LAZY) // many posts can belong to one user
    @JoinColumn(name = "user_id", nullable = false) // foreign key
    @JsonIgnoreProperties({"posts"}) // prevent circular reference in JSON
    private User author;

    // CONSTRUCTORS:
    public Post() {}

    public Post(String content, LocalDateTime timestamp, User author) {
        this.content = content;
        this.timestamp = timestamp;
        this.author = author;
    }

    // convenience method to get author username for JSON responses
    public String getUsername() {
        return author != null ? author.getUsername() : null;
    }

    // getters and setters
    public Long getId() { return id; }

    public String getContent() { return content; }

    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }

    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public User getAuthor() { return author; }

    public void setAuthor(User author) { this.author = author; }

    public int getLikes() { return likes; }

    public void setLikes(int likes) { this.likes = likes; }
    
}
