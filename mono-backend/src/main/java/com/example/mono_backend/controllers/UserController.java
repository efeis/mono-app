// USER CONTROLLER
// handles user registration, login, profile management, and follow/unfollow operations
package com.example.mono_backend.controllers;

import com.example.mono_backend.model.User;
import com.example.mono_backend.repository.UserRepository;
import com.example.mono_backend.service.FollowService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

// controller for handling user-related operations
// allows user registration, login, profile management, and follow/unfollow operations

@CrossOrigin(origins = "http://localhost:3000") // allow frontend requests
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final FollowService followService;

    @Autowired
    public UserController(UserRepository userRepository,
                          FollowService followService) {
        this.userRepository = userRepository;
        this.followService  = followService;
    }

    // USER CREATION & AUTH

    // register a new user account
    @PostMapping("/register")
    public String registerUser(@RequestBody User user) {
        if (userRepository.existsByUsernameIgnoreCase(user.getUsername())) {
            return "taken"; // username already exists
        }
        userRepository.save(user);
        return "ok";
    }

    // authenticate user login
    @PostMapping("/login")
    public String loginUser(@RequestBody User loginReq) {
        return userRepository.findByUsername(loginReq.getUsername())
            .map(u -> u.getPassword().equals(loginReq.getPassword())
                      ? "ok"
                      : "wrong-password")
            .orElse("not-found");
    }

    // PROFILE MANAGEMENT

    // get user profile information
    @GetMapping("/profile")
    public Map<String, String> getProfile(@RequestParam String username) {
        return userRepository.findByUsername(username)
            .map(user -> Map.of(
                "fullName", Optional.ofNullable(user.getFullName()).orElse(""),
                "email",    Optional.ofNullable(user.getEmail()).orElse(""),
                "bio",      Optional.ofNullable(user.getBio()).orElse("")
            ))
            .orElse(Map.of()); // return empty map if user not found
    }

    // update user profile information
    @PutMapping("/profile")
    public String updateProfile(@RequestBody Map<String, String> req) {
        String username = req.get("username");
        if (username == null) return "missing-username";

        return userRepository.findByUsername(username)
            .map(user -> {
                // update only provided fields
                user.setFullName(req.getOrDefault("fullName", user.getFullName()));
                user.setEmail(req.getOrDefault("email", user.getEmail()));
                user.setBio(req.getOrDefault("bio", user.getBio()));
                userRepository.save(user);
                return "updated";
            })
            .orElse("not-found");
    }

    // UTILITY ENDPOINTS

    // check if username exists
    @GetMapping("/exists")
    public Map<String, Boolean> userExists(@RequestParam String username) {
        boolean exists = userRepository.existsByUsernameIgnoreCase(username);
        return Map.of("exists", exists);
    }

    // search for users by username pattern
    @GetMapping("/search")
    public List<Map<String,Object>> searchUsers(
            @RequestParam("q") String q,      // search query
            @RequestParam("me") String me     // current user (to check follow status)
    ) {
        var matches = userRepository
            .findByUsernameContainingIgnoreCase(q);

        return matches.stream()
            .map(u -> Map.<String,Object>of(
                "username",    u.getUsername(),
                "isFollowing", followService.getFollowing(me)
                                            .contains(u.getUsername())
            ))
            .toList();
    }

    // FOLLOW / UNFOLLOW 

    // follow another user
    @PostMapping("/follow")
    public String follow(@RequestBody Map<String,String> req) {
        String follower  = req.get("follower");
        String following = req.get("following");
        // validate input
        if (follower == null 
         || following == null 
         || follower.equals(following)) {
            return "invalid";
        }
        followService.follow(follower, following);
        return "ok";
    }

    // unfollow a user
    @DeleteMapping("/follow")
    public String unfollow(@RequestBody Map<String,String> req) {
        String follower  = req.get("follower");
        String following = req.get("following");
        // validate input
        if (follower == null 
         || following == null 
         || follower.equals(following)) {
            return "invalid";
        }
        followService.unfollow(follower, following);
        return "ok";
    }

    // get list of users following this user
    @GetMapping("/followers")
    public Map<String,Set<String>> getFollowers(@RequestParam String username) {
        Set<String> followers = followService.getFollowers(username);
        return Map.of("followers", followers);
    }

    // get list of users this user is following
    @GetMapping("/following")
    public Map<String,Set<String>> getFollowing(@RequestParam String username) {
        Set<String> following = followService.getFollowing(username);
        return Map.of("following", following);
    }
}
