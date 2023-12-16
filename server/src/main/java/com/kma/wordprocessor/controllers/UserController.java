package com.kma.wordprocessor.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kma.wordprocessor.dto.ChangePasswordDTO;
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
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
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

    @GetMapping("/{id}")
    ResponseObj getUserById (@PathVariable String id) {
        ResponseObj res = userService.getUserById(id);
        return res;
    }

    @GetMapping("/username={username}")
    ResponseEntity<?> getUserByUsername(@PathVariable String username) {
        UserInfo user = userService.getUserByUsername(username);
        return (user == null) ? new ResponseEntity<>(null, HttpStatus.NOT_FOUND) : new ResponseEntity<UserInfo>(user, HttpStatus.OK);
    }

    @PostMapping("/getallbyids")
    public ResponseEntity<List<UserInfo>> getAllById (@RequestBody List<String> ids ) {
        List<UserInfo> users = userService.getAllUserByIds(ids);
        return new ResponseEntity<List<UserInfo>>(users, HttpStatus.OK);
    }

    @PostMapping("/{userId}/access-file/{fileId}")
    public void accessFile (@PathVariable String userId, @PathVariable String fileId) {
        userService.accessFile(userId, fileId);
    }

    @PostMapping("/{userId}/upload-profile-image")
    public ResponseEntity<?> uploadProfileImage (@PathVariable String userId,@RequestParam("file") MultipartFile image) throws IOException {
        UserInfo userInfo = userService.updateProfileImage(userId,image);
        return (userInfo != null) ? new ResponseEntity<UserInfo>(userInfo, HttpStatus.OK) : new ResponseEntity<>(null, HttpStatus.BANDWIDTH_LIMIT_EXCEEDED) ;
    }

    @PatchMapping("/change-password")
    public ResponseEntity<?> changePassword(@RequestBody ChangePasswordDTO changePasswordDTO) {
        boolean isSuccess = userService.changePasswordStatus(changePasswordDTO);
        return isSuccess ? new ResponseEntity<>(null, HttpStatus.OK) : new ResponseEntity<>(null, HttpStatus.UNAUTHORIZED);
    }

    @PatchMapping("/update-profile")
    public ResponseEntity<?> updateUserInfo (@RequestBody UserInfo newUser) {
        boolean updateStatus = userService.updateUserInfo(newUser);
        return updateStatus ? new ResponseEntity<UserInfo>(newUser, HttpStatus.OK) : new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
    }
}
