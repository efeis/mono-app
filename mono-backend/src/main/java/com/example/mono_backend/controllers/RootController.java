package com.example.mono_backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.Map;

@RestController
public class RootController {

  @GetMapping("/")
  public Map<String, String> root() {
    return Map.of(
      "status", "ok",
      "docs", "/swagger-ui/index.html"
    );
  }

  @GetMapping("/healthz")
  public String health() {
    return "ok";
  }
}
