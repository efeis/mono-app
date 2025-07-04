package com.example.mono_backend.model;

import jakarta.persistence.*;

// LIKE ENTITY: representing a user's like on a post
// contains user and post references, ensuring a user can like a post only once

@Entity
@Table(name = "likes", uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "post_id"}))
public class Like {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // the user who liked the post
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // the post that was liked
    @ManyToOne
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    // CONSTRUCTORS 
    public Like() {}

    public Like(User user, Post post) {
        this.user = user;
        this.post = post;
    }

    // getters and setters

    public Long getId() {
        return id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Post getPost() {
        return post;
    }

    public void setPost(Post post) {
        this.post = post;
    }
}
