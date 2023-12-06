package com.kma.wordprocessor.models;

import lombok.Data;
import netscape.javascript.JSObject;

import java.util.List;

@Data
public class Messages {
    List<JSObject> messageList;
}
