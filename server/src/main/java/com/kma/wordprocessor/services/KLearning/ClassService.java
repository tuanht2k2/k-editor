package com.kma.wordprocessor.services.KLearning;

import com.kma.wordprocessor.dto.KLearning.*;
import com.kma.wordprocessor.models.KLearning.Chapter;
import com.kma.wordprocessor.models.KLearning.Class;
import com.kma.wordprocessor.models.KLearning.ExamScore;
import com.kma.wordprocessor.models.KLearning.Lesson;
import com.kma.wordprocessor.models.UserInfo;
import com.kma.wordprocessor.repositories.KLearning.ClassRepository;
import com.kma.wordprocessor.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class ClassService {

    @Autowired
    ClassRepository classRepository;

    @Autowired
    PasswordEncoder passwordEncoder;

    @Autowired
    ChapterService chapterService;

    @Autowired
    UserService userService;

    @Autowired
    LessonService lessonService;

    @Autowired
    ExamScoreService examScoreService;

    public boolean createClass(String classname, String ownerId) {
        if (classRepository.existsByClassnameAndOwnerId(classname, ownerId)) {
            return false;
        }
        Class newClass = new Class(classname, ownerId, new Date());
        classRepository.save(newClass);
        return true;
    }

    public void deleteClass(String id){
        classRepository.deleteById(id);
    }

    public ClassesDTO getClasses (String ownerId) {
        List<Class> yourClasses =  classRepository.findByOwnerId(ownerId);
        List<Class> joinedClasses = classRepository.findAllByMemberIdsContains(ownerId);
        ClassesDTO classesDTO = new ClassesDTO(yourClasses, joinedClasses);
        return classesDTO;
    }

    public Class getOneClass (String classId) {
        Optional<Class> optionalClass = classRepository.findById(classId);
        return optionalClass.orElse(null); // optionalClass.isEmpty() ? null : optionalClass.get();
    }

    public Class getChapters (String classId) {
        Optional<Class> optionalClass = classRepository.findById(classId);
        if (optionalClass.isEmpty()) return null;
        Class classData = optionalClass.get();
        List<Chapter> chapterList = chapterService.getChapterList(classId);
        classData.setChapterList(chapterList);
        return classData;
    }

    public MemberDataDTO getMembers (String classId) {
        Optional<Class> optionalClass = classRepository.findById(classId);
        if (optionalClass.isEmpty()) return null;
        Class classData = optionalClass.get();
        List<UserInfo> members = userService.getAllUserByIds(classData.getMemberIds());
        List<UserInfo> requests = userService.getAllUserByIds(classData.getRequests());
        return new MemberDataDTO(classData.get_id(), classData.getOwnerId(), members, requests);
    }

    public MemberDataDTO manageMember (MemberRequestDTO memberRequestDTO) {
        Optional<Class> optionalClass = classRepository.findById(memberRequestDTO.getClassId());

        if (optionalClass.isEmpty()) return null;

        Class classData = optionalClass.get();

        List<String> members = classData.getMemberIds();
        List<String> requests = classData.getRequests();
        switch (memberRequestDTO.getStatus()) {
            case "REMOVE_MEMBER":
                members.remove(memberRequestDTO.getUserId());
                break;
            case "JOIN":
                if (memberRequestDTO.getUserId().equals(classData.getOwnerId())) return null;
                if (members.contains(memberRequestDTO.getUserId())) return null;
                if (requests.contains(memberRequestDTO.getUserId())) return null;
                requests.add(memberRequestDTO.getUserId());
                break;
            case "REMOVE_REQUEST":
                requests.remove(memberRequestDTO.getUserId());
                break;
            case "ADD_MEMBER":   // == "ACCEPT_JOIN_REQUEST"
                if (memberRequestDTO.getUserId().equals(classData.getOwnerId())) return null;

                requests.remove(memberRequestDTO.getUserId());
                members.add(memberRequestDTO.getUserId());
            default:
                break;
        }
        classData.setMemberIds(members);
        classData.setRequests(requests);
        classRepository.save(classData);
        return getMembers(memberRequestDTO.getClassId());
    }

    public boolean isAClassMember(String classId, String userId) {
        Optional<Class> optionalClass = classRepository.findById(classId);
        if (optionalClass.isEmpty()) return false;
        Class classData = optionalClass.get();
        if (!classData.getMemberIds().contains(userId)) return false;
        return !classData.getOwnerId().equals(userId);
    }

    // exam overview
    public MemberOverviewDTO getMemberOverview (String classId, String userId) {

        if (!isAClassMember(classId, userId)) return null;

        UserInfo memberInfo = userService.getMemberInfo(userId);
        if (memberInfo == null) return null;

        List<Lesson> exams = lessonService.getAllExamByClassId(classId);
        int totalOfCompletedExam = 0;
        double totalOfCoefficient = 0;
        double totalOfScore = 0.0;
        List<ExamOverviewDTO> examOverviews = new ArrayList<ExamOverviewDTO>();
        for (Lesson exam : exams) {
            totalOfCoefficient = totalOfCoefficient + Double.parseDouble(exam.getCoefficient());
            ExamOverviewDTO examOverviewDTO = new ExamOverviewDTO();
            ExamScore examScore = examScoreService.getExamScoreByLessonIdAndOwnerId(exam.get_id(), userId);

            if (examScore != null) {
                totalOfCompletedExam++;
                totalOfScore = totalOfScore + examScore.getScore() * Double.parseDouble(exam.getCoefficient());
            }
            examOverviewDTO.setLesson(exam);
            examOverviewDTO.setScore(examScore);
            examOverviews.add(examOverviewDTO);

        }

        // calculate cpa
        DecimalFormat decimalFormat = new DecimalFormat("#.##");
        String cpa = decimalFormat.format(totalOfScore/totalOfCoefficient);


        MemberOverviewDTO memberOverviewDTO = new MemberOverviewDTO();
        memberOverviewDTO.setMember(memberInfo);
        memberOverviewDTO.setTotalOfExaminations(exams.size());
        memberOverviewDTO.setTotalOfCompletedExaminations(totalOfCompletedExam);
        memberOverviewDTO.setCpa(cpa);
        memberOverviewDTO.setExamOverviews(examOverviews);

        return memberOverviewDTO;
    }

}
