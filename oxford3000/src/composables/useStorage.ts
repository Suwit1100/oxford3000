// composables/useStorage.ts
import { ref, computed } from "vue";
import type { LearnedState } from "@/type/index";

const STORAGE_KEY = "oxford-learned-state";

const learnedState = ref<LearnedState>({
  stories: [],
  words: [],
});

// โหลดข้อมูลจาก storage เมื่อเริ่มต้น
const loadState = async () => {
  try {
    const result = await window.storage.get(STORAGE_KEY);
    if (result && result.value) {
      learnedState.value = JSON.parse(result.value);
    }
  } catch (error) {
    console.log("No saved state found, starting fresh");
  }
};

// บันทึกข้อมูลลง storage
const saveState = async () => {
  try {
    await window.storage.set(STORAGE_KEY, JSON.stringify(learnedState.value));
  } catch (error) {
    console.error("Failed to save state:", error);
  }
};

export const useStorage = () => {
  // เช็คว่า story เรียนแล้วหรือยัง
  const isStoryLearned = (storyId: number) => {
    return learnedState.value.stories.includes(storyId);
  };

  // เช็คว่าคำศัพท์เรียนแล้วหรือยัง
  const isWordLearned = (word: string) => {
    return learnedState.value.words.includes(word.toLowerCase());
  };

  // ทำเครื่องหมายว่าเรียน story แล้ว (พร้อมคำศัพท์ทั้ง 10 คำ)
  const markStoryAsLearned = async (storyId: number, words: string[]) => {
    if (!learnedState.value.stories.includes(storyId)) {
      learnedState.value.stories.push(storyId);
    }

    words.forEach((word) => {
      const lowerWord = word.toLowerCase();
      if (!learnedState.value.words.includes(lowerWord)) {
        learnedState.value.words.push(lowerWord);
      }
    });

    await saveState();
  };

  // นับจำนวน story ที่เรียนแล้ว
  const learnedStoriesCount = computed(() => learnedState.value.stories.length);

  // นับจำนวนคำที่เรียนแล้ว
  const learnedWordsCount = computed(() => learnedState.value.words.length);

  // รีเซ็ตข้อมูลทั้งหมด
  const resetAll = async () => {
    learnedState.value = { stories: [], words: [] };
    await saveState();
  };

  return {
    loadState,
    isStoryLearned,
    isWordLearned,
    markStoryAsLearned,
    learnedStoriesCount,
    learnedWordsCount,
    learnedState,
    resetAll,
  };
};
