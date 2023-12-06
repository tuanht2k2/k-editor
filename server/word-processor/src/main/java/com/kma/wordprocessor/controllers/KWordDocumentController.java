package com.kma.wordprocessor.controllers;

import org.json.JSONObject;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;

@Controller
@CrossOrigin(origins = "*")
public class KWordDocumentController {
    @SendTo("document/k-word/{documentId}")
    JSONObject action (@Payload JSONObject actionObj){
        return actionObj;
    }
}
