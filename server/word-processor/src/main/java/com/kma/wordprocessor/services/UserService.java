package com.kma.wordprocessor.services;

import com.kma.wordprocessor.models.Folder;
import com.kma.wordprocessor.models.ResponseObj;
import com.kma.wordprocessor.models.UserInfo;
import com.kma.wordprocessor.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public ResponseObj getAllUsers () {
        List<UserInfo> usersInfo = userRepo.findAll();
        return new ResponseObj("OK", "User found!", usersInfo);
    }

    public ResponseObj getUserById (String id) {
        Optional<UserInfo> user = userRepo.findById(id);
        if (user.isPresent()) {
            return new ResponseObj("OK", "User found!", user);
        }
        return new ResponseObj("404 not found!", "User not found!", user);
    }

    public List<UserInfo> getAllUserByIds(List<String> ids) {
        return userRepo.findAllById(ids);
    }

    public Optional<UserInfo> getUserByUsername(String username) {
        Optional<UserInfo> user = userRepo.findByUsername(username);
        return user;
    }

    public ResponseObj addUser(UserInfo userInfo) {
        if (userRepo.existsUserInfosByUsernameAndEmail(userInfo.getUsername(), userInfo.getEmail())) {
            return new ResponseObj("BAD_REQUEST", "Add user failed!", "");
        }

        String passEncoded = passwordEncoder.encode(userInfo.getPassword());
        userInfo.setPassword(passEncoded);
        userRepo.save(userInfo);
        return new ResponseObj("OK", "Add user completely", userInfo);
    }

    public ResponseObj createFolder(UserInfo user, String folderId) {

            if (user.getFolders() == null) {
                List<String> folders = new ArrayList<String>();
                folders.add(folderId);
                user.setFolders(folders);
            } else {
                List<String> currentFolders = user.getFolders();
                currentFolders.add(folderId);
                user.setFolders(currentFolders);
            }

            userRepo.save(user);

            return new ResponseObj("OK", "Create folder successfully","");

    }

    public ResponseObj createFile() {
        return new ResponseObj();
    }
}
