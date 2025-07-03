package com.example.mono_backend.controllers;

import com.example.mono_backend.dto.PostRequest;
import com.example.mono_backend.dto.PostResponse;
import com.example.mono_backend.model.Like;
import com.example.mono_backend.model.Post;
import com.example.mono_backend.model.User;
import com.example.mono_backend.repository.LikeRepository;
import com.example.mono_backend.repository.PostRepository;
import com.example.mono_backend.repository.UserRepository;
import com.example.mono_backend.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@CrossOrigin(origins = "http://localhost:3000") // allow frontend requests
@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired
    private PostRepository postRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LikeRepository likeRepository;

    @Autowired
    private FollowService followService;

    // create a new post
    @PostMapping
    public ResponseEntity<String> createPost(@RequestBody PostRequest req) {
        var optUser = userRepository.findByUsername(req.getUsername());
        if (optUser.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("user-not-found");
        }
        // create and save new post
        Post p = new Post(req.getContent(), LocalDateTime.now(), optUser.get());
        postRepository.save(p);
        return ResponseEntity.ok("post-created");
    }

    // toggle like/unlike on a post
    @PostMapping("/{id}/like")
    public ResponseEntity<String> toggleLike(@PathVariable Long id,
                                             @RequestBody PostRequest req) {
        // find user
        var optMe = userRepository.findByUsername(req.getUsername());
        if (optMe.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("user-not-found");
        }
        User me = optMe.get();

        // find post
        var optPost = postRepository.findById(id);
        if (optPost.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("post-not-found");
        }
        Post post = optPost.get();

        // prevent self-liking
        if (post.getAuthor().getUsername().equals(me.getUsername())) {
            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body("cannot-like-own-post");
        }

        // toggle like status
        var existing = likeRepository.findByUserAndPost(me, post);
        if (existing.isPresent()) {
            // unlike
            likeRepository.delete(existing.get());
            post.setLikes((int) likeRepository.countByPost(post));
            postRepository.save(post);
            return ResponseEntity.ok("unliked");
        } else {
            // like
            likeRepository.save(new Like(me, post));
            post.setLikes((int) likeRepository.countByPost(post));
            postRepository.save(post);
            return ResponseEntity.ok("liked");
        }
    }

    // get posts - either all posts or posts by specific user
    @GetMapping
    public List<PostResponse> getPosts(
            @RequestParam(required = false) String username, // filter by author
            @RequestParam(required = false) String viewer    // user viewing (for like status)
    ) {
        List<Post> posts;
        if (username != null && !username.isBlank()) {
            // get posts by specific user
            posts = postRepository.findByAuthor_Username(username);
        } else {
            // get all posts
            posts = postRepository.findAll();
        }

        // find viewer for like status calculation
        User viewerUser = null;
        if (viewer != null && !viewer.isBlank()) {
            viewerUser = userRepository.findByUsername(viewer).orElse(null);
        }

        // convert to response DTOs with like status
        User finalViewerUser = viewerUser;
        return posts.stream()
                .map(post -> {
                    boolean likedByUser = false;
                    if (finalViewerUser != null) {
                        likedByUser = likeRepository.findByUserAndPost(finalViewerUser, post).isPresent();
                    }
                    return new PostResponse(
                            post.getId(),
                            post.getAuthor().getUsername(),
                            post.getContent(),
                            post.getLikes(),
                            post.getTimestamp(),
                            likedByUser
                    );
                })
                .toList();
    }

    // get personalized feed for user (posts from followed users + own posts)
    @GetMapping("/feed")
    public List<PostResponse> getFeed(@RequestParam String username) {
        User me = userRepository.findByUsername(username).orElse(null);
        if (me == null) {
            return List.of(); // return empty feed for unknown user
        }

        // get users this user follows + self
        Set<String> follows = followService.getFollowing(username);
        follows.add(username); // include own posts

        // find all users to include in feed
        List<User> authors = userRepository.findAll().stream()
                .filter(u -> follows.contains(u.getUsername()))
                .toList();

        // get posts from these authors, newest first, limit to 20
        return postRepository
                .findAllByAuthorInOrderByTimestampDesc(authors)
                .stream()
                .limit(20)
                .map(post -> {
                    boolean likedByMe = likeRepository.findByUserAndPost(me, post).isPresent();
                    return new PostResponse(
                            post.getId(),
                            post.getAuthor().getUsername(),
                            post.getContent(),
                            post.getLikes(),
                            post.getTimestamp(),
                            likedByMe
                    );
                })
                .toList();
    }

    // get IDs of posts liked by a user
    @GetMapping("/liked-ids")
    public List<Long> getLikedPostIds(@RequestParam String username) {
        User user = userRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return List.of();
        }
        return likeRepository.findAllByUser(user)
                .stream()
                .map(like -> like.getPost().getId())
                .toList();
    }

    // delete a post (only by its author)
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deletePost(@PathVariable Long id,
                                             @RequestParam String username) {
        // find post
        var optPost = postRepository.findById(id);
        if (optPost.isEmpty()) {
            return ResponseEntity
                    .status(HttpStatus.NOT_FOUND)
                    .body("post-not-found");
        }
        Post post = optPost.get();

        // verify ownership
        if (!post.getAuthor().getUsername().equals(username)) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN)
                    .body("unauthorized");
        }

        // delete associated likes first, then post
        likeRepository.deleteAll(likeRepository.findAllByPost(post));
        postRepository.delete(post);
        return ResponseEntity.ok("deleted");
    }
}
