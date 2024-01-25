package com.kma.wordprocessor.controllers.WebSocketControllers;

import com.kma.wordprocessor.models.KLearning.ClassMessage;
import com.kma.wordprocessor.services.KLearning.ClassMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@Controller
@CrossOrigin(origins = "*")
public class ClassMessengerController {

    @Autowired
    ClassMessageService classMessageService;

    private List<ClassMessage> messages;

    @MessageMapping("/classes/{classId}/messenger")
    @SendTo("/classes/{classId}/messenger")
    List<ClassMessage> messenger (@Payload ClassMessage newMessage, @DestinationVariable String classId){
        if (messages == null) {
            messages = classMessageService.getAllMessagesByClassId(classId);
        }
        if (newMessage.getContent().isEmpty()) {
            return messages;
        }
        ClassMessage resMessage = classMessageService.sendMessage(newMessage);
        messages.add(resMessage);
        return messages;
    }

}
