package com.example.mono_backend.repository;

import com.example.mono_backend.model.Follow;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// FOLLOW REPOSITORY
// database access layer for follow relationship operations
public interface FollowRepository extends JpaRepository<Follow, Long> {
    // get all users that this user is following
    List<Follow> findByFollower(String follower);
    
    // get all users following this user
    List<Follow> findByFollowing(String following);
    
    // find specific follow relationship between two users
    Optional<Follow> findByFollowerAndFollowing(String follower, String following);
}
