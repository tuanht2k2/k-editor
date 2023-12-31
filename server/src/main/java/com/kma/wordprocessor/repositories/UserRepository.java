package com.kma.wordprocessor.repositories;

import com.kma.wordprocessor.models.UserInfo;
import org.apache.catalina.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<UserInfo, String> {
    Optional<UserInfo> findByUsername(String username);

    Optional<UserInfo> getUserByUsername(String username);

    boolean existsUserInfosByUsername(String username);

    boolean existsUserInfosByEmail(String username);

    boolean existsUserInfosByPhoneNumber(String phoneNumber);
}
