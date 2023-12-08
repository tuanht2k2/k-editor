package com.kma.wordprocessor.dto.Messenger;

import lombok.Data;
import org.springframework.context.annotation.Bean;

import java.util.List;

@Data
public class GlobalMessengerDTO {

    List<MessengerDTO> messengers;

}
