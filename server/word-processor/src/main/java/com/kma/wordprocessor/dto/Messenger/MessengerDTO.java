package com.kma.wordprocessor.dto.Messenger;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MessengerDTO {
    private String id;

    private List<MessageDTO> messages;
}
