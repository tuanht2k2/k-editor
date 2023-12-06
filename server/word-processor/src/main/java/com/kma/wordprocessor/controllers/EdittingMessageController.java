package com.kma.wordprocessor.controllers;

import com.kma.wordprocessor.dto.MessageDTO;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;

@Controller
@CrossOrigin(origins = "*")
public class EdittingMessageController {

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    List<MessageDTO> messageList = new ArrayList<MessageDTO>();

    @MessageMapping("/documents/{documentId}/messenger")
    @SendTo("/documents/{documentId}/messenger")
    public List<MessageDTO> sendMessage (@Payload MessageDTO message,@DestinationVariable String documentId) {

        messageList.add(message);
        return messageList;
    }
}



