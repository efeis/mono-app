package com.example.mono_backend;

import com.example.mono_backend.model.User;
import com.example.mono_backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired; // lets Spring to automatically inject dependencies.
import org.springframework.web.bind.annotation.*; // imports Spring's REST annotations.
import org.springframework.web.bind.annotation.CrossOrigin;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/api/users")
public class UserController {

      @Autowired
      private UserRepository userRepository;

      @PostMapping("/register")
      public String registerUser(@RequestBody User user) {
        if (userRepository.existsByUsername(user.getUsername())) {
          return "taken";
        }
      
        userRepository.save(user);
        return "ok";
      }

      @PostMapping("/login")
      public String loginUser(@RequestBody User loginRequest) {
        return userRepository.findByUsername(loginRequest.getUsername())
          .map(user -> {
            if (user.getPassword().equals(loginRequest.getPassword())) {
              return "ok";
            } else {
              return "wrong-password";
            }
          })
          .orElse("not-found");
      }
}
