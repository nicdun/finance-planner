import React from "react";
import {
  PiggyBank,
  Target,
  TrendingUp,
  BookOpen,
  BarChart3,
  DollarSign,
  Calculator,
  Wallet,
  Award,
  Star,
} from "lucide-react";
import {
  DBLearningPath,
  DBChapter,
  DBQuizQuestion,
  DBUserLearningProgress,
  DBUserChapterProgress,
  DBUserAchievement,
} from "./db";
import {
  LearningPath,
  Chapter,
  Quiz,
  Question,
} from "@/routes/dashboard/education";

// Icon mapping function
export function getIconComponent(iconName: string): React.ReactNode {
  const iconMap: Record<string, React.ComponentType<any>> = {
    PiggyBank,
    Target,
    TrendingUp,
    BookOpen,
    BarChart3,
    DollarSign,
    Calculator,
    Wallet,
    Award,
    Star,
  };

  const IconComponent = iconMap[iconName] || BookOpen;
  return React.createElement(IconComponent, { className: "h-6 w-6" });
}

// Convert database types to frontend types
export function convertDBLearningPathToFrontend(
  dbPath: DBLearningPath,
  dbChapters: DBChapter[],
  chapterQuestions: Record<string, DBQuizQuestion[]>,
  userProgress?: DBUserLearningProgress,
  userChapterProgress: DBUserChapterProgress[] = []
): LearningPath {
  // Convert chapters
  const chapters: Chapter[] = dbChapters.map((dbChapter) => {
    const questions = chapterQuestions[dbChapter.id] || [];
    const userChapterProg = userChapterProgress.find(
      (ucp) => ucp.chapter_id === dbChapter.id
    );

    // Convert quiz questions
    const quiz: Quiz = {
      id: `quiz_${dbChapter.id}`,
      questions: questions.map((dbQuestion) => ({
        id: dbQuestion.id,
        question: dbQuestion.question,
        options: dbQuestion.options,
        correctAnswer: dbQuestion.correct_answer,
        explanation: dbQuestion.explanation,
      })),
    };

    return {
      id: dbChapter.id,
      title: dbChapter.title,
      description: dbChapter.description,
      content: dbChapter.content,
      quiz,
      completed: userChapterProg?.completed || false,
      duration: `${dbChapter.duration} min`,
    };
  });

  return {
    id: dbPath.id,
    title: dbPath.title,
    description: dbPath.description,
    difficulty: dbPath.difficulty,
    duration: `${dbPath.duration} min`,
    chapters,
    completionPercentage: userProgress?.completion_percentage || 0,
    icon: getIconComponent(dbPath.icon),
    color: dbPath.color,
  };
}

export function convertDBLearningPathsToFrontend(
  dbPaths: DBLearningPath[],
  pathChapters: Record<string, DBChapter[]>,
  chapterQuestions: Record<string, DBQuizQuestion[]>,
  userLearningProgress: DBUserLearningProgress[] = [],
  userChapterProgress: DBUserChapterProgress[] = []
): LearningPath[] {
  return dbPaths.map((dbPath) => {
    const chapters = pathChapters[dbPath.id] || [];
    const userProgress = userLearningProgress.find(
      (ulp) => ulp.learning_path_id === dbPath.id
    );

    return convertDBLearningPathToFrontend(
      dbPath,
      chapters,
      chapterQuestions,
      userProgress,
      userChapterProgress
    );
  });
}

// Achievement types mapping
export const achievementConfig = {
  "first-start": {
    title: "Erste Schritte",
    description: "Ersten Lernpfad gestartet",
    icon: Star,
    color: "text-yellow-600 bg-yellow-100",
  },
  "chapter-master": {
    title: "Kapitel-Meister",
    description: "5 Kapitel abgeschlossen",
    icon: BookOpen,
    color: "text-blue-600 bg-blue-100",
  },
  "time-tracker": {
    title: "Zeiterfasser",
    description: "60 Minuten Lernzeit",
    icon: Target,
    color: "text-green-600 bg-green-100",
  },
  "path-completer": {
    title: "Vollender",
    description: "Ersten Lernpfad abgeschlossen",
    icon: Award,
    color: "text-purple-600 bg-purple-100",
  },
};

export function getAchievementConfig(achievementType: string) {
  return (
    achievementConfig[achievementType as keyof typeof achievementConfig] || {
      title: achievementType,
      description: "Unbekannter Erfolg",
      icon: Star,
      color: "text-gray-600 bg-gray-100",
    }
  );
}

// Helper functions for progress calculations
export function calculateLearningStats(
  learningPaths: LearningPath[],
  userChapterProgress: DBUserChapterProgress[]
) {
  const totalChapters = learningPaths.reduce(
    (sum, path) => sum + path.chapters.length,
    0
  );
  const completedChapters = userChapterProgress.filter(
    (ucp) => ucp.completed
  ).length;
  const totalLearningTime = userChapterProgress.reduce(
    (sum, ucp) => sum + ucp.time_spent,
    0
  );
  const startedPaths = learningPaths.filter(
    (path) => path.completionPercentage > 0
  );
  const completedPaths = learningPaths.filter(
    (path) => path.completionPercentage === 100
  );

  const overallProgress =
    totalChapters > 0
      ? Math.round((completedChapters / totalChapters) * 100)
      : 0;

  return {
    totalChapters,
    completedChapters,
    totalLearningTime,
    startedPaths: startedPaths.length,
    completedPaths: completedPaths.length,
    overallProgress,
  };
}

// Helper function to track chapter time
export function createChapterTimer() {
  let startTime = Date.now();

  return {
    start: () => {
      startTime = Date.now();
    },
    getElapsedMinutes: () => {
      const elapsed = Date.now() - startTime;
      return Math.round(elapsed / (1000 * 60)); // Convert to minutes
    },
    reset: () => {
      startTime = Date.now();
    },
  };
}
