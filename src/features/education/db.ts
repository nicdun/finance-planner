import { supabase } from "@/lib/supabase/client";

// Types for database entities
export interface DBLearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration: number;
  icon: string;
  color: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DBChapter {
  id: string;
  learning_path_id: string;
  title: string;
  description: string;
  content: string;
  duration: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DBQuizQuestion {
  id: string;
  chapter_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  explanation: string;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DBUserLearningProgress {
  id: string;
  user_id: string;
  learning_path_id: string;
  completion_percentage: number;
  started_at: string;
  completed_at: string | null;
  last_accessed_at: string;
  created_at: string;
  updated_at: string;
}

export interface DBUserChapterProgress {
  id: string;
  user_id: string;
  chapter_id: string;
  completed: boolean;
  completed_at: string | null;
  time_spent: number;
  created_at: string;
  updated_at: string;
}

export interface DBUserQuizAttempt {
  id: string;
  user_id: string;
  chapter_id: string;
  quiz_questions_id: string;
  selected_answer: number;
  is_correct: boolean;
  attempt_number: number;
  attempted_at: string;
  created_at: string;
}

export interface DBUserAchievement {
  id: string;
  user_id: string;
  achievement_type: string;
  achievement_name: string;
  unlocked_at: string;
  created_at: string;
}

// Learning Paths functions
export async function getLearningPaths(): Promise<DBLearningPath[]> {
  const { data, error } = await supabase
    .from("learning_paths")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching learning paths:", error);
    throw error;
  }

  return data || [];
}

export async function getLearningPath(
  id: string
): Promise<DBLearningPath | null> {
  const { data, error } = await supabase
    .from("learning_paths")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching learning path:", error);
    throw error;
  }

  return data;
}

// Chapters functions
export async function getChaptersByLearningPath(
  learningPathId: string
): Promise<DBChapter[]> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("learning_path_id", learningPathId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching chapters:", error);
    throw error;
  }

  return data || [];
}

export async function getChapter(id: string): Promise<DBChapter | null> {
  const { data, error } = await supabase
    .from("chapters")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching chapter:", error);
    throw error;
  }

  return data;
}

// Quiz Questions functions
export async function getQuizQuestionsByChapter(
  chapterId: string
): Promise<DBQuizQuestion[]> {
  const { data, error } = await supabase
    .from("quiz_questions")
    .select("*")
    .eq("chapter_id", chapterId)
    .order("sort_order", { ascending: true });

  if (error) {
    console.error("Error fetching quiz questions:", error);
    throw error;
  }

  return data || [];
}

// User Learning Progress functions
export async function getUserLearningProgress(
  userId: string
): Promise<DBUserLearningProgress[]> {
  const { data, error } = await supabase
    .from("user_learning_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user learning progress:", error);
    throw error;
  }

  return data || [];
}

export async function getUserLearningProgressByPath(
  userId: string,
  learningPathId: string
): Promise<DBUserLearningProgress | null> {
  const { data, error } = await supabase
    .from("user_learning_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("learning_path_id", learningPathId)
    .single();

  if (error && error.code !== "PGRST116") {
    // PGRST116 is "not found" error
    console.error("Error fetching user learning progress by path:", error);
    throw error;
  }

  return data;
}

export async function startLearningPath(
  userId: string,
  learningPathId: string
): Promise<DBUserLearningProgress> {
  const { data, error } = await supabase
    .from("user_learning_progress")
    .insert({
      user_id: userId,
      learning_path_id: learningPathId,
      completion_percentage: 0,
      started_at: new Date().toISOString(),
      last_accessed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error starting learning path:", error);
    throw error;
  }

  return data;
}

export async function updateLearningPathAccess(
  userId: string,
  learningPathId: string
): Promise<void> {
  const { error } = await supabase
    .from("user_learning_progress")
    .update({
      last_accessed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .eq("learning_path_id", learningPathId);

  if (error) {
    console.error("Error updating learning path access:", error);
    throw error;
  }
}

// User Chapter Progress functions
export async function getUserChapterProgress(
  userId: string
): Promise<DBUserChapterProgress[]> {
  const { data, error } = await supabase
    .from("user_chapter_progress")
    .select("*")
    .eq("user_id", userId);

  if (error) {
    console.error("Error fetching user chapter progress:", error);
    throw error;
  }

  return data || [];
}

export async function getUserChapterProgressByChapter(
  userId: string,
  chapterId: string
): Promise<DBUserChapterProgress | null> {
  const { data, error } = await supabase
    .from("user_chapter_progress")
    .select("*")
    .eq("user_id", userId)
    .eq("chapter_id", chapterId)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error fetching user chapter progress by chapter:", error);
    throw error;
  }

  return data;
}

export async function startChapter(
  userId: string,
  chapterId: string
): Promise<DBUserChapterProgress> {
  const { data, error } = await supabase
    .from("user_chapter_progress")
    .insert({
      user_id: userId,
      chapter_id: chapterId,
      completed: false,
      time_spent: 0,
    })
    .select()
    .single();

  if (error) {
    console.error("Error starting chapter:", error);
    throw error;
  }

  return data;
}

export async function completeChapter(
  userId: string,
  chapterId: string,
  timeSpent: number = 0
): Promise<DBUserChapterProgress> {
  const { data, error } = await supabase
    .from("user_chapter_progress")
    .upsert({
      user_id: userId,
      chapter_id: chapterId,
      completed: true,
      completed_at: new Date().toISOString(),
      time_spent: timeSpent,
      updated_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error completing chapter:", error);
    throw error;
  }

  return data;
}

export async function updateChapterTimeSpent(
  userId: string,
  chapterId: string,
  timeSpent: number
): Promise<void> {
  const { error } = await supabase.from("user_chapter_progress").upsert({
    user_id: userId,
    chapter_id: chapterId,
    time_spent: timeSpent,
    updated_at: new Date().toISOString(),
  });

  if (error) {
    console.error("Error updating chapter time spent:", error);
    throw error;
  }
}

// User Quiz Attempts functions
export async function recordQuizAttempt(
  userId: string,
  chapterId: string,
  questionId: string,
  selectedAnswer: number,
  isCorrect: boolean,
  attemptNumber: number = 1
): Promise<DBUserQuizAttempt> {
  const { data, error } = await supabase
    .from("user_quiz_attempts")
    .insert({
      user_id: userId,
      chapter_id: chapterId,
      quiz_questions_id: questionId,
      selected_answer: selectedAnswer,
      is_correct: isCorrect,
      attempt_number: attemptNumber,
      attempted_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error recording quiz attempt:", error);
    throw error;
  }

  return data;
}

export async function getUserQuizAttempts(
  userId: string,
  chapterId?: string
): Promise<DBUserQuizAttempt[]> {
  let query = supabase
    .from("user_quiz_attempts")
    .select("*")
    .eq("user_id", userId);

  if (chapterId) {
    query = query.eq("chapter_id", chapterId);
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching user quiz attempts:", error);
    throw error;
  }

  return data || [];
}

// User Achievements functions
export async function getUserAchievements(
  userId: string
): Promise<DBUserAchievement[]> {
  const { data, error } = await supabase
    .from("user_achievements")
    .select("*")
    .eq("user_id", userId)
    .order("unlocked_at", { ascending: false });

  if (error) {
    console.error("Error fetching user achievements:", error);
    throw error;
  }

  return data || [];
}

export async function unlockAchievement(
  userId: string,
  achievementType: string,
  achievementName: string
): Promise<DBUserAchievement> {
  const { data, error } = await supabase
    .from("user_achievements")
    .insert({
      user_id: userId,
      achievement_type: achievementType,
      achievement_name: achievementName,
      unlocked_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) {
    console.error("Error unlocking achievement:", error);
    throw error;
  }

  return data;
}

// Combined functions for loading complete learning data
export async function getFullLearningData(userId: string) {
  try {
    const [
      learningPaths,
      userLearningProgress,
      userChapterProgress,
      userAchievements,
    ] = await Promise.all([
      getLearningPaths(),
      getUserLearningProgress(userId),
      getUserChapterProgress(userId),
      getUserAchievements(userId),
    ]);

    // Load chapters and quiz questions for each learning path
    const learningPathsWithChapters = await Promise.all(
      learningPaths.map(async (path) => {
        const chapters = await getChaptersByLearningPath(path.id);
        const chaptersWithQuestions = await Promise.all(
          chapters.map(async (chapter) => {
            const questions = await getQuizQuestionsByChapter(chapter.id);
            return { ...chapter, questions };
          })
        );
        return { ...path, chapters: chaptersWithQuestions };
      })
    );

    return {
      learningPaths: learningPathsWithChapters,
      userLearningProgress,
      userChapterProgress,
      userAchievements,
    };
  } catch (error) {
    console.error("Error loading full learning data:", error);
    throw error;
  }
}
