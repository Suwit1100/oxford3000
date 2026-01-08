import { ref, computed, watch } from "vue";
import type { ProgressState } from "@/types";

const STORAGE_KEY = "oxford3000_progress";
const CURRENT_LESSON_KEY = "oxford3000_current_lesson";

// Load from localStorage
const loadProgress = (): ProgressState => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const data = JSON.parse(saved);
      return {
        learnedStories: new Set(data.learnedStories || []),
        learnedWords: new Set(data.learnedWords || []),
      };
    }
  } catch (error) {
    console.error("Failed to load progress:", error);
  }
  return {
    learnedStories: new Set(),
    learnedWords: new Set(),
  };
};

const initialProgress = loadProgress();
const learnedStories = ref<Set<number>>(initialProgress.learnedStories);
const learnedWords = ref<Set<string>>(initialProgress.learnedWords);
const currentLessonIndex = ref<number>(
  parseInt(localStorage.getItem(CURRENT_LESSON_KEY) || "0")
);

// Save to localStorage whenever data changes
const saveProgress = () => {
  try {
    const data = {
      learnedStories: Array.from(learnedStories.value),
      learnedWords: Array.from(learnedWords.value),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to save progress:", error);
  }
};

// Watch for changes and save
watch(
  [learnedStories, learnedWords],
  () => {
    saveProgress();
  },
  { deep: true }
);

watch(currentLessonIndex, (newIndex) => {
  localStorage.setItem(CURRENT_LESSON_KEY, newIndex.toString());
});

export function useProgress() {
  const markStoryAsLearned = (storyId: number, words: string[]) => {
    learnedStories.value.add(storyId);
    words.forEach((word) => learnedWords.value.add(word.toLowerCase()));
    // Trigger save
    saveProgress();
  };

  const isStoryLearned = (storyId: number): boolean => {
    return learnedStories.value.has(storyId);
  };

  const isWordLearned = (word: string): boolean => {
    return learnedWords.value.has(word.toLowerCase());
  };

  const totalLearnedWords = computed(() => learnedWords.value.size);
  const totalLearnedStories = computed(() => learnedStories.value.size);

  const getAllLearnedWords = (): string[] => {
    return Array.from(learnedWords.value);
  };

  const setCurrentLesson = (index: number) => {
    currentLessonIndex.value = index;
  };

  const getCurrentLesson = (): number => {
    return currentLessonIndex.value;
  };

  const resetProgress = () => {
    if (
      confirm(
        "⚠️ คุณแน่ใจหรือไม่ที่จะรีเซ็ทความคืบหน้าทั้งหมด?\n\nข้อมูลทั้งหมดจะถูกลบและไม่สามารถกู้คืนได้!"
      )
    ) {
      learnedStories.value.clear();
      learnedWords.value.clear();
      currentLessonIndex.value = 0;

      // Clear localStorage
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(CURRENT_LESSON_KEY);

      alert("✅ รีเซ็ทความคืบหน้าเรียบร้อยแล้ว");

      // Reload page to reset UI
      window.location.reload();
    }
  };

  return {
    markStoryAsLearned,
    isStoryLearned,
    isWordLearned,
    totalLearnedWords,
    totalLearnedStories,
    getAllLearnedWords,
    currentLessonIndex,
    setCurrentLesson,
    getCurrentLesson,
    resetProgress,
  };
}
