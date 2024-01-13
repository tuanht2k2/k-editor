package com.kma.wordprocessor.services.KLearning;

import com.kma.wordprocessor.models.KLearning.Chapter;
import com.kma.wordprocessor.models.KLearning.Lesson;
import com.kma.wordprocessor.repositories.KLearning.ChapterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ChapterService {

    @Autowired
    ChapterRepository chapterRepository;

    @Autowired
    LessonService lessonService;

    public void createChapter(String classId, String chapterName) {
        Chapter newChapter = new Chapter(classId, chapterName, new ArrayList<Lesson>());
        chapterRepository.save(newChapter);
    }

    public Chapter getChapter (String chapterId) {
        Optional<Chapter> optionalChapter = chapterRepository.findById(chapterId);
        if (optionalChapter.isEmpty()) return null;
        Chapter chapter = optionalChapter.get();
        List<Lesson> lessonList = lessonService.getLessonList(chapterId);
        chapter.setLessonList(lessonList);
        return chapter;
    }

    public List<Chapter> getChapterList(String classId) {
        List<Chapter> chapterList = chapterRepository.findByClassId(classId);
        for (Chapter chapter : chapterList) {
            List<Lesson> lessonList = lessonService.getLessonList(chapter.get_id());
            chapter.setLessonList(lessonList);
        }
        return chapterList;
    }

}
