package com.kma.wordprocessor.controllers.WebSocketControllers;

import com.kma.wordprocessor.dto.KLearning.ConversationUserDTO;
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
public class KTeamsController {

    List<ConversationUserDTO> users = new ArrayList<ConversationUserDTO>();

    public List<ConversationUserDTO> userJoin(ConversationUserDTO user) {
        userLeave(user.get_id());
        users.add(user);
        return users;
    }

    public List<ConversationUserDTO> userLeave(String userId) {
        for (int i=0; i < users.size(); i++) {
            if (users.get(i).get_id().equals(userId)) {
                users.remove(i);
                break;
            }
        }
        return users;
    }

    @MessageMapping("/conversations/{id}/{actionType}") // client send to server
    @SendTo("/conversations/{id}/users") // server send to client
    List<ConversationUserDTO> joinConversation(@Payload ConversationUserDTO user, @DestinationVariable String actionType){
        return actionType.equals("join") ? userJoin(user) : userLeave(user.get_id());
    }

}
