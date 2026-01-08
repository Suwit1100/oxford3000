<template>
    <div v-if="show" class="modal-backdrop-custom" @click.self="$emit('close')">
        <div class="modal-dialog-custom">
            <div class="custom-modal-content">
                <div class="modal-header-custom">
                    <div>
                        <h2 class="display-6 fw-bold text-gradient mb-0">{{ word }}</h2>
                        <span class="small font-monospace" v-if="definition?.phonetic">
                            /{{ definition.phonetic }}/
                        </span>
                    </div>
                    <button class="btn btn-close-custom" @click="$emit('close')">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>

                <div class="modal-body-custom custom-scrollbar">
                    <div v-if="loading" class="text-center py-5">
                        <div class="spinner-border text-primary" role="status"></div>
                    </div>
                    <div v-else-if="error"
                        class="alert alert-danger bg-danger bg-opacity-10 border-danger border-opacity-25 text-danger">
                        {{ error }}
                    </div>

                    <div v-else-if="definition" class="animation-fade-in">
                        <div
                            class="p-3 rounded-3 bg-primary bg-opacity-10 mb-4 border border-primary border-opacity-10">
                            <span class="text-primary small text-uppercase fw-bold mb-1 d-block">คำแปลภาษาไทย</span>
                            <h3 class="mb-0 text-white">{{ definition.thaiTranslation }}</h3>
                        </div>

                        <button class="btn btn-dark-outline mb-4 w-100 py-2" @click="speakWord" :disabled="isSpeaking">
                            <i class="bi me-2"
                                :class="isSpeaking ? 'bi-volume-up-fill text-primary' : 'bi-volume-up'"></i>
                            {{ isSpeaking ? 'กำลังเล่นเสียง...' : 'ฟังการออกเสียง' }}
                        </button>

                        <div v-if="isTargetWord && exampleFromStory" class="mb-4">
                            <h6 class="section-title"><i class="bi bi-chat-quote-fill me-2"></i>จากบทเรียน</h6>
                            <div class="example-card">
                                "{{ exampleFromStory }}"
                            </div>
                        </div>

                        <div>
                            <h6 class="section-title">ความหมายอื่นๆ</h6>
                            <div v-for="(meaning, index) in definition.meanings" :key="index" class="mb-4">
                                <div class="d-flex align-items-center gap-2 mb-2">
                                    <span class="badge bg-secondary text-white">{{ meaning.partOfSpeech }}</span>
                                    <span class="fw-bold text-white">{{ meaning.definitionTh }}</span>
                                </div>
                                <p class="small mb-2 ps-1">{{ meaning.definitionEn }}</p>
                                <div v-if="meaning.example"
                                    class="ps-3 border-start border-2 border-secondary border-opacity-25 fst-italic small">
                                    "{{ meaning.example }}"
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
/* Script คงเดิม */
import { ref, watch } from 'vue';
import { useDictionary, type WordDetail } from '@/composables/useDictionary';
import { useTextToSpeech } from '@/composables/useTextToSpeech';

interface Props { show: boolean; word: string; isTargetWord: boolean; exampleFromStory?: string; }
const props = defineProps<Props>();
defineEmits(['close']);

const { loading, error, fetchWordDefinition } = useDictionary();
const { speak, isSpeaking } = useTextToSpeech();
const definition = ref<WordDetail | null>(null);

watch(() => [props.word, props.show], async ([newWord, newShow]) => {
    if (newWord && newShow) { definition.value = await fetchWordDefinition(newWord as string); }
}, { immediate: true });

const speakWord = () => { speak(props.word); };
</script>

<style scoped>
.modal-backdrop-custom {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(5px);
    z-index: 1060;
    display: flex;
    justify-content: center;
    align-items: center;
    animation: fadeIn 0.2s ease-out;
}

.modal-dialog-custom {
    width: 100%;
    max-width: 500px;
    margin: 1rem;
    animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.custom-modal-content {
    background: #1E1E1E;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 20px;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
    overflow: hidden;
    max-height: 85vh;
    display: flex;
    flex-direction: column;
}

.modal-header-custom {
    padding: 1.5rem;
    background: #252525;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.modal-body-custom {
    padding: 1.5rem;
    overflow-y: auto;
}

.btn-close-custom {
    background: rgba(255, 255, 255, 0.05);
    border: none;
    color: white;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
}

.btn-close-custom:hover {
    background: rgba(255, 255, 255, 0.1);
}

.btn-dark-outline {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: var(--text-main);
    border-radius: 12px;
}

.example-card {
    background: rgba(255, 255, 255, 0.03);
    padding: 1rem;
    border-radius: 12px;
    font-style: italic;
    color: #A0A0A0;
}

.section-title {
    color: #60A5FA;
    font-size: 0.85rem;
    text-transform: uppercase;
    font-weight: bold;
    margin-bottom: 1rem;
}

.text-gradient {
    background: linear-gradient(to right, #60A5FA, #A78BFA);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

@keyframes slideUp {
    from {
        transform: translateY(20px);
        opacity: 0;
    }

    to {
        transform: translateY(0);
        opacity: 1;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}
</style>