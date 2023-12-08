package com.kma.wordprocessor.controllers;

import com.kma.wordprocessor.dto.MessageDTO;
import com.kma.wordprocessor.models.UserInfo;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;

@Controller
@CrossOrigin(origins = "*")
public class WebSocketDocumentMessageController {
    List<MessageDTO> messages = new ArrayList<MessageDTO>();

    List<UserInfo> member = new ArrayList<UserInfo>();

    @MessageMapping("/documents/{documentId}/messenger")
    @SendTo("/documents/{documentId}/messenger")
    public List<MessageDTO> sendMessage (@Payload MessageDTO message,@DestinationVariable String documentId) {
        messages.add(message);
        return messages;
    }
}



