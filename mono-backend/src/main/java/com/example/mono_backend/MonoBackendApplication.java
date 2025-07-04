package com.example.mono_backend;

// SPRING BOOT APPLICATION ENTRY POINT
// main class that starts the Spring Boot application

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EntityScan("com.example.mono_backend.model")                 // scan for jpa entities
@EnableJpaRepositories("com.example.mono_backend.repository") // scan for repositories
public class MonoBackendApplication {
  public static void main(String[] args) {
    SpringApplication.run(MonoBackendApplication.class, args);
  }
}
