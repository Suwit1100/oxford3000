import { ref } from "vue";

export function useTextToSpeech() {
  const isPlaying = ref(false);
  const isSpeaking = ref(false);

  const speak = (text: string) => {
    // Stop any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => {
      isPlaying.value = true;
      isSpeaking.value = true;
    };

    utterance.onend = () => {
      isPlaying.value = false;
      isSpeaking.value = false;
    };

    utterance.onerror = () => {
      isPlaying.value = false;
      isSpeaking.value = false;
    };

    window.speechSynthesis.speak(utterance);
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    isPlaying.value = false;
    isSpeaking.value = false;
  };

  const toggle = (text: string) => {
    if (isPlaying.value) {
      stop();
    } else {
      speak(text);
    }
  };

  return {
    isPlaying,
    isSpeaking,
    speak,
    stop,
    toggle,
  };
}
