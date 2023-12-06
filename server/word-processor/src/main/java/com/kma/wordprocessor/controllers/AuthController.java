package com.kma.wordprocessor.controllers;

import com.kma.wordprocessor.dto.AuthResDTO;
import com.kma.wordprocessor.dto.LoginDTO;
import com.kma.wordprocessor.dto.RegisterDTO;
import com.kma.wordprocessor.entities.AuthResponse;
import com.kma.wordprocessor.jwt.JwtUtil;
import com.kma.wordprocessor.models.ResponseObj;
import com.kma.wordprocessor.models.UserInfo;
import com.kma.wordprocessor.repositories.UserRepository;
import com.kma.wordprocessor.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path = "/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    JwtUtil jwtUtil;

    @Autowired
    UserService userService;

    public AuthController(AuthenticationManager authenticationManager) {
        this.authenticationManager = authenticationManager;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginDTO loginDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                    loginDTO.getUsername(),
                    loginDTO.getPassword()
            ));
            SecurityContextHolder.getContext().setAuthentication(authentication);

            String token = jwtUtil.generateToken(loginDTO.getUsername(), loginDTO.getPassword());
            AuthResponse authResponse = new AuthResponse(loginDTO.getUsername(), token, "OK");
            return new ResponseEntity<AuthResponse>(authResponse, HttpStatus.OK);

        } catch (BadCredentialsException ex){
            return new ResponseEntity<AuthResponse>(new AuthResponse(loginDTO.getUsername(), "", "FAILED"), HttpStatus.UNAUTHORIZED);
        }


    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDTO registerDTO) {

        UserInfo newUser = new UserInfo(registerDTO.getUsername(), registerDTO.getEmail(), registerDTO.getPassword(),"user");
        ResponseObj responseObj =  userService.addUser(newUser);
        if (responseObj.getStatus().equals("OK")) {
            return new ResponseEntity<>("Account registration successful!", HttpStatus.OK);
        }
        return new ResponseEntity<>("Account registration failure!", HttpStatus.BAD_REQUEST);
    }
}
