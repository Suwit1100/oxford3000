// composables/useTTS.ts
import { ref } from "vue";

export const useTTS = () => {
  const isPlaying = ref(false);
  const currentUtterance = ref<SpeechSynthesisUtterance | null>(null);

  // พูดข้อความ
  const speak = (text: string) => {
    // หยุดการพูดก่อนหน้าถ้ามี
    if (isPlaying.value) {
      stop();
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.75; // ความเร็ว

    utterance.onstart = () => {
      isPlaying.value = true;
    };

    utterance.onend = () => {
      isPlaying.value = false;
      currentUtterance.value = null;
    };

    utterance.onerror = () => {
      isPlaying.value = false;
      currentUtterance.value = null;
    };

    currentUtterance.value = utterance;
    speechSynthesis.speak(utterance);
  };

  // หยุดการพูด
  const stop = () => {
    speechSynthesis.cancel();
    isPlaying.value = false;
    currentUtterance.value = null;
  };

  // พูดคำเดียว
  const speakWord = (word: string) => {
    speak(word);
  };

  return {
    speak,
    stop,
    speakWord,
    isPlaying,
  };
};
