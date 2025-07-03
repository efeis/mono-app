// FOLLOW ENTITY
// represents one user following another user
package com.example.mono_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "follows", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"follower_username", "following_username"})
    // prevent duplicate follow relationships
})
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // username of user who is following
    @Column(name = "follower_username", nullable = false)
    private String follower;

    // username of user being followed
    @Column(name = "following_username", nullable = false)
    private String following;

    // CONSTRUCTORS:
    public Follow() {} // required by JPA

    public Follow(String follower, String following) {
        this.follower = follower;
        this.following = following;
    }

    public Long getId() { return id; }

    public String getFollower() { return follower; }

    public String getFollowing() { return following; }
}
