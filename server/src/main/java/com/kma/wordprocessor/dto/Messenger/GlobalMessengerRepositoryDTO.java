package com.kma.wordprocessor.dto.Messenger;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
@AllArgsConstructor
public class GlobalMessengerRepositoryDTO {

    private List<MessengerDTO> messengerRepo;

    public MessengerDTO findMessengerById (String messengerIdToFind) {
        for (MessengerDTO messenger : messengerRepo) {
            if (messenger.getId().equals(messengerIdToFind)) {
                return messenger;
            }
        }

        return null;
    }

    public MessengerDTO updateMessengerRepo (String messengerId, MessageDTO newMessage) {
        MessengerDTO messenger = this.findMessengerById(messengerId);
        if (messenger == null) {
            // create new messenger
            ArrayList<MessageDTO> messages = new ArrayList<MessageDTO>();
            messages.add(newMessage);
            MessengerDTO newMessenger = new MessengerDTO(messengerId, messages);
            List<MessengerDTO> currentMessengerRepo =  this.getMessengerRepo();
            currentMessengerRepo.add(newMessenger);
            this.setMessengerRepo(currentMessengerRepo);
            return newMessenger;
        } else {
            List<MessageDTO> currentMessages = messenger.getMessages();
            currentMessages.add(newMessage);
            messenger.setMessages(currentMessages); // add newMessage to Messenger
            // replace messenger in messengerRepo
            for (int i = 0; i < this.messengerRepo.size(); i++) {
                MessengerDTO messengerToReplace = this.messengerRepo.get(i);
                if (messengerToReplace.getId().equals(messengerId)) {
                    this.messengerRepo.set(i, messenger);
                }
            }
            return messenger;
        }
    }

}
