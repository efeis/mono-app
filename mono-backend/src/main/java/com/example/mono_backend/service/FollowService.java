package com.example.mono_backend.service;

// FOLLOW SERVICE
// business logic for managing user follow relationships

import com.example.mono_backend.model.Follow;
import com.example.mono_backend.repository.FollowRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Set;
import java.util.stream.Collectors;

@Service
public class FollowService {

    @Autowired
    private FollowRepository followRepository;

    // create a follow relationship between two users
    public void follow(String follower, String following) {
        if (follower.equals(following)) return; // prevent self-following

        // check if relationship already exists
        boolean exists = followRepository
            .findByFollowerAndFollowing(follower, following)
            .isPresent();

        if (!exists) {
            followRepository.save(new Follow(follower, following));
        }
    }

    // remove a follow relationship
    public void unfollow(String follower, String following) {
        followRepository.findByFollowerAndFollowing(follower, following)
            .ifPresent(followRepository::delete); // delete if exists
    }

    // get all users who follow this user
    public Set<String> getFollowers(String username) {
        return followRepository.findByFollowing(username).stream()
            .map(Follow::getFollower)
            .collect(Collectors.toSet());
    }

    // get all users this user is following
    public Set<String> getFollowing(String username) {
        return followRepository.findByFollower(username).stream()
            .map(Follow::getFollowing)
            .collect(Collectors.toSet());
    }
}
