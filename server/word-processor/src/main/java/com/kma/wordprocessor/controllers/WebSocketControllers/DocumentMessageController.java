package com.kma.wordprocessor.controllers.WebSocketControllers;

import com.kma.wordprocessor.dto.Messenger.GlobalMessengerRepositoryDTO;
import com.kma.wordprocessor.dto.Messenger.MessageDTO;
import com.kma.wordprocessor.dto.Messenger.MessengerDTO;
import com.kma.wordprocessor.models.UserInfo;
import com.kma.wordprocessor.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Controller
@CrossOrigin(origins = "*")
public class DocumentMessageController {
    @Autowired
    UserRepository userRepository;

    GlobalMessengerRepositoryDTO globalMessengerRepositoryDTO = new GlobalMessengerRepositoryDTO(new ArrayList<MessengerDTO>());

    @MessageMapping("/documents/{documentId}/messenger")
    @SendTo("/documents/{documentId}/messenger")
    public MessengerDTO sendMessage (@Payload MessageDTO message, @DestinationVariable String documentId) {
        return globalMessengerRepositoryDTO.updateMessengerRepo(documentId, message);
    }
}



