package com.kma.wordprocessor.controllers.WebSocketControllers;

import com.kma.wordprocessor.dto.KWord.DocumentActionUpdateDTO;
import com.kma.wordprocessor.services.FileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

import java.util.List;

@Controller
@CrossOrigin(origins = "*")
public class KWordDocumentController {

    @Autowired
    FileService fileService;

    @MessageMapping("/documents/k-word/{documentId}")
    @SendTo("/documents/k-word/{documentId}")
    List<DocumentActionUpdateDTO> updateDocument (@Payload DocumentActionUpdateDTO actionObj, @DestinationVariable String documentId){
        return fileService.updateTxtFile(actionObj);
    }
}
