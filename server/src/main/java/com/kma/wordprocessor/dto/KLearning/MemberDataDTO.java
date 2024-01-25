package com.kma.wordprocessor.dto.KLearning;

import com.kma.wordprocessor.models.UserInfo;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class MemberDataDTO {

    private String classId;

    private String ownerId;

    private List<UserInfo> members;

    private List<UserInfo> requests;

}
