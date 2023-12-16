package com.kma.wordprocessor.services;

import com.kma.wordprocessor.dto.ChangePasswordDTO;
import com.kma.wordprocessor.models.Folder;
import com.kma.wordprocessor.models.ResponseObj;
import com.kma.wordprocessor.models.UserInfo;
import com.kma.wordprocessor.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    FirebaseStorageService firebaseStorageService;

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

    public UserInfo getUserByUsername(String username) {
        Optional<UserInfo> optionalUserInfo = userRepo.findByUsername(username);
        return optionalUserInfo.orElse(null);
    }

    public String addUser(UserInfo userInfo) {
        if (userRepo.existsUserInfosByUsername(userInfo.getUsername())) {
           return "usernameExisted";
        }

        if (userRepo.existsUserInfosByEmail(userInfo.getEmail())) {
            return "emailExisted";
        }

        if (userRepo.existsUserInfosByPhoneNumber(userInfo.getPhoneNumber())) {
            return "phoneNumberExisted";
        }

        String passEncoded = passwordEncoder.encode(userInfo.getPassword());
        userInfo.setPassword(passEncoded);
        userRepo.save(userInfo);
        return "";
    }

    public boolean updateUserInfo (UserInfo newUser) {
        Optional<UserInfo> optionalUserInfo = userRepo.findById(newUser.get_id());
        if (optionalUserInfo.isPresent()) {
            userRepo.save(newUser);
            return true;
        }
        return false;
    }

    public UserInfo updateProfileImage (String userId,MultipartFile image) throws IOException {
        Optional<UserInfo> optionalUserInfo = userRepo.findById(userId);

        if (optionalUserInfo.isEmpty()) return null;

        InputStream fileStream = image.getInputStream();
        String fileName = image.getOriginalFilename();
        URL fileUrl = firebaseStorageService.uploadFile(fileStream, "user-profile-image",fileName);

        UserInfo userInfo = optionalUserInfo.get();
        userInfo.setProfileImage(fileUrl);
        userRepo.save(userInfo);

        return userInfo;
    }

    public boolean changePasswordStatus (ChangePasswordDTO changePasswordDTO) {
        UserInfo user = this.getUserByUsername(changePasswordDTO.getUsername());
        if (user == null) return false;
        boolean currentPasswordCheck = passwordEncoder.matches(changePasswordDTO.getCurrentPassword(), user.getPassword());
        if (!currentPasswordCheck) {
            return false;
        }
        user.setPassword(passwordEncoder.encode(changePasswordDTO.getNewPassword()));
        userRepo.save(user);
        return true;
    }

    public void createFolder(UserInfo user, String folderId) {

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
    }

    public void accessFile(String userId,String fileId) {
        Optional<UserInfo> optionalUserInfo = userRepo.findById(userId);

        if (!optionalUserInfo.isPresent()) return;
        UserInfo user = optionalUserInfo.get();
        List<String> currentRecentFiles = user.getRecentFiles() == null ? new ArrayList<String>() : user.getRecentFiles();
        currentRecentFiles.remove(fileId);
        currentRecentFiles.add(fileId);
        user.setRecentFiles(currentRecentFiles);
        userRepo.save(user);

    }
}
