package com.example.mono_backend.controllers;

import com.example.mono_backend.dto.PostRequest;
import com.example.mono_backend.model.Post;
import com.example.mono_backend.model.User;
import com.example.mono_backend.repository.PostRepository;
import com.example.mono_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping
    public String createPost(@RequestBody PostRequest request) {
        User user = userRepository.findByUsername(request.getUsername()).orElse(null);
        if (user == null) {
            return "user-not-found";
        }

        Post post = new Post(request.getContent(), LocalDateTime.now(), user);
        postRepository.save(post);
        return "post-created";
    }

    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }
}
