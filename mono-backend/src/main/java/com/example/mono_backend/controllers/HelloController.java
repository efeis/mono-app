// HELLO CONTROLLER
// simple endpoint to test if the backend is running
package com.example.mono_backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HelloController {
      @GetMapping("/hello")
      public String sayHello() {
        return "hello, that's mono!";
      }
}

