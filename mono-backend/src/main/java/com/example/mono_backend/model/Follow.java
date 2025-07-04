package com.example.mono_backend.model;

import jakarta.persistence.*;

// FOLLOW ENTITY
// represents one user following another user

@Entity
@Table(name = "follows", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"follower_username", "following_username"})
    // prevent duplicate follow relationships
})
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // the username of user the follower
    @Column(name = "follower_username", nullable = false)
    private String follower;

    // the username of user being followed
    @Column(name = "following_username", nullable = false)
    private String following;

    // CONSTRUCTORS:
    public Follow() {} // required by JPA

    public Follow(String follower, String following) {
        this.follower = follower;
        this.following = following;
    }

    // getters
    public Long getId() { return id; }

    public String getFollower() { return follower; }

    public String getFollowing() { return following; }
}
