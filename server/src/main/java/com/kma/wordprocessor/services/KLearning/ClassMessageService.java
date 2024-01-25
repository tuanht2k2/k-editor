package com.kma.wordprocessor.services.KLearning;

import com.kma.wordprocessor.models.KLearning.ClassMessage;
import com.kma.wordprocessor.models.UserInfo;
import com.kma.wordprocessor.repositories.KLearning.ClassMessageRepository;
import com.kma.wordprocessor.services.UserService;
import org.checkerframework.checker.units.qual.A;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ClassMessageService {

    @Autowired
    ClassMessageRepository classMessageRepository;

    @Autowired
    UserService userService;

    @Autowired
    ClassService classService;

    public List<ClassMessage> getAllMessagesByClassId (String classId) {
        List<ClassMessage> messages = classMessageRepository.findAllByClassId(classId);
        for (ClassMessage message : messages) {
            UserInfo user = userService.getMemberInfo(message.getUser().get_id());
            message.setUser(user);
        }
        return messages;
    }

    public ClassMessage sendMessage (ClassMessage newMessage) {
        ClassMessage message = classMessageRepository.save(newMessage);
        UserInfo user = userService.getMemberInfo(message.getUser().get_id());
        message.setUser(user);
        return message;
    }


}
