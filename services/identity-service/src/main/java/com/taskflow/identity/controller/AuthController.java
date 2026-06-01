package com.taskflow.identity.controller;

import com.taskflow.identity.dto.AuthResponse;
import com.taskflow.identity.dto.ErrorResponse;
import com.taskflow.identity.dto.LoginRequest;
import com.taskflow.identity.dto.RegisterRequest;
import com.taskflow.identity.security.JwtService;
import com.taskflow.identity.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final JwtService jwtService;

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(
            @Valid @RequestBody RegisterRequest request) {
        log.info("Register request for email: {}", request.getEmail());
        AuthResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(
            @Valid @RequestBody LoginRequest request) {
        log.info("Login request for email: {}", request.getEmail());
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/health")
    public ResponseEntity<String> health() {
        return ResponseEntity.ok("Identity Service is running");
    }

    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(
            @RequestHeader(value = "Authorization", required = false)
            String authHeader) {

        // Return 401 if no token provided
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ErrorResponse.builder()
                            .status(401)
                            .error("Unauthorized")
                            .message("Authorization token is required")
                            .path("/api/auth/me")
                            .build());
        }

        String token = authHeader.substring(7);
        String email = jwtService.extractEmail(token);
        String userId = jwtService.extractUserId(token);
        String role = jwtService.extractClaim(token,
                claims -> claims.get("role", String.class));

        return ResponseEntity.ok(
                AuthResponse.builder()
                        .userId(userId)
                        .email(email)
                        .role(role)
                        .build()
        );
    }
}