package com.kma.wordprocessor.controllers.WebSocketControllers;

import com.kma.wordprocessor.dto.KSheet.SheetUpdateDTO;
import com.kma.wordprocessor.dto.KSheet.SheetUpdateGroupDTO;
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
public class KSheetDocumentController {

    @Autowired
    FileService fileService;

    @MessageMapping("/documents/k-sheet/{sheetId}")
    @SendTo("/documents/k-sheet/{sheetId}")
    List<SheetUpdateGroupDTO> updateSheet(@Payload SheetUpdateDTO sheetUpdateDTO, @DestinationVariable String sheetId) {
        return fileService.updateSheetFile(sheetUpdateDTO);
    }

}
