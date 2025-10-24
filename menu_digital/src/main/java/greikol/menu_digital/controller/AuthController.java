package greikol.menu_digital.controller;

import greikol.menu_digital.dto.LoginRequest;
import greikol.menu_digital.dto.LoginResponse;
import greikol.menu_digital.dto.RegisterRequest;
import greikol.menu_digital.dto.RegisterResponse;
import greikol.menu_digital.service.AuthService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest loginRequest) {
        LoginResponse response = authService.login(loginRequest.getEmail(), loginRequest.getPassword());
        return ResponseEntity.ok(response);
    }

    @PostMapping("/register")
    public ResponseEntity<RegisterResponse> register(@RequestBody RegisterRequest registerRequest) {
        RegisterResponse response = authService.register(registerRequest);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}