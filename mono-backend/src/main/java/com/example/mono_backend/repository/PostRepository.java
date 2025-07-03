// POST REPOSITORY
// database access layer for post operations
package com.example.mono_backend.repository;

import com.example.mono_backend.model.Post;
import com.example.mono_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {
    // get all posts by a specific author
    List<Post> findByAuthor_Username(String username);

    // get posts from multiple authors, sorted by newest first (for feed)
    List<Post> findAllByAuthorInOrderByTimestampDesc(List<User> authors);
}