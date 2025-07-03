package com.example.mono_backend.repository;

import com.example.mono_backend.model.Like;
import com.example.mono_backend.model.Post;
import com.example.mono_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

// LIKE REPOSITORY
// database access layer for like operations
public interface LikeRepository extends JpaRepository<Like, Long> {
    // find specific like by user and post (to check if user liked post)
    Optional<Like> findByUserAndPost(User user, Post post);
    
    // count total likes for a post
    long countByPost(Post post);
    
    // get all posts liked by a user
    List<Like> findAllByUser(User user);
    
    // get all likes for a post (for cleanup when deleting post)
    List<Like> findAllByPost(Post post);
}
