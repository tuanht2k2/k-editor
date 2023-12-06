package com.kma.wordprocessor.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kma.wordprocessor.models.ResponseObj;
import com.kma.wordprocessor.models.UserInfo;
import com.kma.wordprocessor.repositories.UserRepository;
import com.kma.wordprocessor.services.UserService;
import org.apache.catalina.User;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@CrossOrigin(origins = "*")
@RestController
@RequestMapping(path = "api/users")
public class UserController {
    @Autowired
    UserService userService;

    @Autowired
    UserRepository userRepo;

    @GetMapping("")
    ResponseObj getAllUsers () {
        ResponseObj res = userService.getAllUsers();
        return res;
    }

    @GetMapping("/username={username}")
    ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        Optional<UserInfo> optionalUserInfo = userService.getUserByUsername(username);
        if (optionalUserInfo.isPresent()) return new ResponseEntity<UserInfo>(optionalUserInfo.get(), HttpStatus.OK);
        return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }

    @GetMapping("/{id}")
    ResponseObj getUserById (@PathVariable String id) {
        ResponseObj res = userService.getUserById(id);
        return res;
    }

    @PostMapping("/getallbyids")
    public ResponseEntity<List<UserInfo>> getAllById (@RequestBody List<String> ids ) {
        List<UserInfo> users = userService.getAllUserByIds(ids);
        return new ResponseEntity<List<UserInfo>>(users, HttpStatus.OK);
    }
}
