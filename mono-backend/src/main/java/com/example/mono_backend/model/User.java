// USER ENTITY
// represents a user account in the database
package com.example.mono_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id // primary key
    @GeneratedValue(strategy = GenerationType.IDENTITY) // auto-increment
    private Long id;

    // COLUMNS:
    @Column(nullable = false, unique = true) // required and unique
    private String username;

    @Column(nullable = false) // required field
    private String password;

    @Column // optional field
    private String fullName;

    @Column(unique = true) // optional but unique if provided
    private String email;

    @Column(length = 500) // longer text field for bio
    private String bio;

    // CONSTRUCTORS:
    public User() {} // required by JPA

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    // GETTERS AND SETTERS:
    public Long getId() { return id; }

    public String getUsername() { return username; }

    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }

    public void setPassword(String password) { this.password = password; }

    public String getFullName() { return fullName; }

    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }

    public void setEmail(String email) { this.email = email; }

    public String getBio() { return bio; }

    public void setBio(String bio) { this.bio = bio; }
}
