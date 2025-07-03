// CORS CONFIGURATION
// allows frontend to make requests to backend from different origins
package com.example.mono_backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.*;
import org.springframework.lang.NonNull;

@Configuration
public class CorsConfig implements WebMvcConfigurer{
  @Override
  public void addCorsMappings(@NonNull CorsRegistry registry) {
    registry.addMapping("/**") // allow all API paths
      .allowedOrigins("http://localhost", "http://localhost:3000") // frontend origins
      .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")   // http methods
      .allowedHeaders("*")      // all headers
      .allowCredentials(true);  // allow cookies/auth
  }
}
