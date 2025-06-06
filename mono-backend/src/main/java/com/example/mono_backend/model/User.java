package com.example.mono_backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

      @Id // set id as the primary key
      @GeneratedValue(strategy = GenerationType.IDENTITY)
      private Long id;

      // COLUMNS:
      @Column(nullable = false, unique = true)
      private String username;

      @Column(nullable = false)
      private String password;

      // CONSTRUCTORS:
      public User() {}

      public User(String username, String password) {
        this.username = username;
        this.password = password;
      }

      // GETTERS AND SETTERS:
      public Long getId() {
        return id;
      }

      public String getUsername() {
        return username;
      }

      public void setUsername(String username) {
        this.username = username;
      }

      public String getPassword() {
        return password;
      }
  
      public void setPassword(String password) {
        this.password = password;
      }

}
