package com.kma.wordprocessor.services.KLearning;

import com.kma.wordprocessor.models.KLearning.Chapter;
import com.kma.wordprocessor.models.KLearning.Class;
import com.kma.wordprocessor.repositories.KLearning.ClassRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

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

    public boolean createClass(String classname, String ownerId, String rawPassword) {
        if (classRepository.existsByClassnameAndOwnerId(classname, ownerId)) {
            return false;
        }
        String password = passwordEncoder.encode(rawPassword);
        Class newClass = new Class(classname, ownerId, password, new Date(), new ArrayList<String>(), new ArrayList<Chapter>());
        classRepository.save(newClass);
        return true;
    }

    public void deleteClass(String id){
        classRepository.deleteById(id);
    }

    public List<Class> getClasses (String ownerId,String role) {
        return role.equals("admin") ? classRepository.findByOwnerId(ownerId) : null;
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
}
