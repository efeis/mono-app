package com.example.mono_backend.repository;

import com.example.mono_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// USER REPOSITORY
// database access layer for user-related operations
public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByUsernameIgnoreCase(String username);
    List<User> findByUsernameContainingIgnoreCase(String q);
    Optional<User> findByUsername(String username);
}
