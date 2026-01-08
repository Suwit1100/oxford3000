<template>
    <div v-if="show" class="modal fade show d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <div>
                        <h5 class="modal-title mb-1">{{ word }}</h5>
                        <small class="text-muted" v-if="definition?.phonetic">
                            {{ definition.phonetic }}
                        </small>
                    </div>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>

                <div class="modal-body">
                    <div v-if="loading" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">กำลังโหลด...</span>
                        </div>
                    </div>

                    <div v-else-if="error" class="alert alert-warning">
                        <i class="bi bi-exclamation-triangle me-2"></i>
                        {{ error }}
                    </div>

                    <div v-else-if="definition">
                        <div class="translation-box mb-3">
                            <strong class="d-block mb-1">คำแปล (ไทย):</strong>
                            <h4 class="mb-0 text-primary">{{ definition.thaiTranslation }}</h4>
                        </div>

                        <div class="mb-3">
                            <button class="btn btn-sm btn-outline-primary me-2" @click="speakWord"
                                :disabled="isSpeaking">
                                <i class="bi" :class="isSpeaking ? 'bi-volume-up-fill' : 'bi-volume-up'"></i>
                                {{ isSpeaking ? 'กำลังพูด...' : 'ฟังเสียง' }}
                            </button>
                        </div>

                        <hr>

                        <div class="mb-3" v-if="isTargetWord && exampleFromStory">
                            <div class="alert alert-info mb-3">
                                <strong><i class="bi bi-book me-2"></i>ตัวอย่างจาก story:</strong>
                                <p class="mb-0 mt-2 fst-italic">"{{ exampleFromStory }}"</p>
                            </div>
                        </div>

                        <div>
                            <h6 class="mb-3">ความหมาย:</h6>

                            <div v-for="(meaning, index) in definition.meanings" :key="index" class="mb-3">
                                <div class="mb-2">
                                    <span class="badge bg-primary">{{ meaning.partOfSpeech }}</span>
                                </div>

                                <p class="mb-2">{{ meaning.definitionTh }}</p>

                                <p class="text-muted small mb-2">{{ meaning.definitionEn }}</p>

                                <div v-if="meaning.example" class="example-box">
                                    <i class="bi bi-quote"></i>
                                    <span class="fst-italic">{{ meaning.example }}</span>
                                </div>

                                <hr v-if="index < definition.meanings.length - 1" class="my-3">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { useDictionary, type WordDetail } from '@/composables/useDictionary';
import { useTextToSpeech } from '@/composables/useTextToSpeech';

interface Props {
    show: boolean;
    word: string;
    isTargetWord: boolean;
    exampleFromStory?: string;
}

const props = defineProps<Props>();
defineEmits(['close']);

const { loading, error, fetchWordDefinition } = useDictionary();
const { speak, isSpeaking } = useTextToSpeech(); // ดึง isSpeaking มาใช้เพื่อทำ UI state
const definition = ref<WordDetail | null>(null);

watch(() => [props.word, props.show], async ([newWord, newShow]) => {
    if (newWord && newShow) {
        definition.value = await fetchWordDefinition(newWord as string);
    }
}, { immediate: true });

// ใช้ฟังก์ชัน TTS แทนการเล่นไฟล์เสียง
const speakWord = () => {
    speak(props.word);
};
</script>

<style scoped>
.modal {
    display: block;
}

.translation-box {
    background-color: #f8f9fa;
    padding: 1rem;
    border-radius: 0.5rem;
    border-left: 4px solid #0d6efd;
}

.example-box {
    background-color: #f8f9fa;
    padding: 0.75rem;
    border-radius: 0.25rem;
    border-left: 3px solid #6c757d;
    color: #495057;
}

hr {
    opacity: 0.1;
}
</style>