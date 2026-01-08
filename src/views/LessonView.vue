<template>
    <div class="lesson-view mx-auto" style="max-width: 800px;">
        <div class="card mb-4 sticky-top-controls">
            <div class="card-body p-2 p-md-3">
                <div class="d-flex justify-content-between align-items-center">
                    <button class="btn btn-dark-soft icon-btn" :disabled="localStoryIndex === 0" @click="previousStory">
                        <i class="bi bi-chevron-left"></i>
                    </button>

                    <div class="d-flex align-items-center gap-2 bg-darker rounded-pill px-3 py-1">
                        <span class="text-white small">Lesson</span>
                        <input type="number" v-model.number="jumpToLesson" @keyup.enter="handleJumpToLesson"
                            class="lesson-input" />
                        <span class="text-white small opacity-50">/ {{ stories.length }}</span>
                    </div>

                    <button class="btn btn-dark-soft icon-btn" :disabled="localStoryIndex === stories.length - 1"
                        @click="nextStory">
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>

        <div class="card mb-4 border-0 shadow-lg overflow-hidden">
            <div class="status-bar" :class="{ 'learned': isStoryLearned(currentStory.id) }"></div>

            <div class="card-header d-flex justify-content-between align-items-center border-0 pt-4 px-4">
                <div class="d-flex align-items-center gap-2">
                    <span v-if="isStoryLearned(currentStory.id)"
                        class="badge bg-success-subtle text-success rounded-pill px-3">
                        <i class="bi bi-check-circle-fill me-1"></i> Learned
                    </span>
                    <span v-else class="badge bg-secondary-subtle text-muted rounded-pill px-3">To Do</span>
                </div>

                <button class="btn btn-circle" :class="isPlaying ? 'btn-danger pulse' : 'btn-primary'"
                    @click="toggleStoryAudio">
                    <i class="bi" :class="isPlaying ? 'bi-pause-fill' : 'bi-play-fill'"></i>
                </button>
            </div>

            <div class="card-body px-4 pb-4">
                <StoryContent :content="currentStory.content" :target-words="currentWordSet?.words || []"
                    @word-click="handleWordClick" />
            </div>

            <div class="card-footer bg-darker border-0 p-3">
                <button
                    class="btn btn-link text-decoration-none w-100 d-flex justify-content-center align-items-center gap-2"
                    @click="showTranslation = !showTranslation">
                    <i class="bi" :class="showTranslation ? 'bi-eye-slash' : 'bi-translate'"></i>
                    {{ showTranslation ? 'ซ่อนคำแปล' : 'แตะเพื่อดูคำแปล' }}
                </button>

                <transition name="fade">
                    <div v-if="showTranslation" class="mt-3 p-3 rounded bg-dark text-secondary small lh-lg">
                        {{ currentStory.translation }}
                    </div>
                </transition>
            </div>
        </div>

        <WordList :words="currentWordSet?.words || []" @word-click="handleTargetWordClick" />

        <div class="action-area mt-4 mb-5 text-center">
            <button class="btn btn-lg w-100 py-3 rounded-xl shadow-lg transition-all"
                :class="isStoryLearned(currentStory.id) ? 'btn-outline-success opacity-75' : 'btn-success'"
                :disabled="isStoryLearned(currentStory.id)" @click="markAsLearned">
                <div class="d-flex align-items-center justify-content-center gap-2">
                    <i class="bi" :class="isStoryLearned(currentStory.id) ? 'bi-check-all' : 'bi-check-lg'"></i>
                    <span class="fw-bold">{{ isStoryLearned(currentStory.id) ? 'บทเรียนนี้ผ่านแล้ว' :
                        'ทำเครื่องหมายว่าเรียนจบ' }}</span>
                </div>
            </button>
        </div>

        <WordDetailModal :show="showModal" :word="selectedWord" :is-target-word="isSelectedWordTarget"
            :example-from-story="getExampleSentence()" @close="showModal = false" />
    </div>
</template>

<script setup lang="ts">
/* (Script ยังคงเหมือนเดิม 100% ตาม requirement ไม่ต้องแก้ logic) */
import { ref, computed, onMounted, watch } from 'vue';
import { stories, wordSets } from '@/data/mockData';
import StoryContent from '@/components/StoryContent.vue';
import WordList from '@/components/WordList.vue';
import WordDetailModal from '@/components/WordDetailModal.vue';
import { useProgress } from '@/composables/useProgress';
import { useTextToSpeech } from '@/composables/useTextToSpeech';

const localStoryIndex = ref(0);
const showModal = ref(false);
const selectedWord = ref('');
const isSelectedWordTarget = ref(false);
const showTranslation = ref(false);
const jumpToLesson = ref<number | null>(null);

const { markStoryAsLearned, isStoryLearned, setCurrentLesson, getCurrentLesson } = useProgress();
const { isPlaying, toggle: toggleAudio } = useTextToSpeech();

onMounted(() => {
    const savedLesson = getCurrentLesson();
    if (savedLesson >= 0 && savedLesson < stories.length) {
        localStoryIndex.value = savedLesson;
    }
    jumpToLesson.value = localStoryIndex.value + 1;
});

watch(localStoryIndex, (newIndex) => {
    setCurrentLesson(newIndex);
    jumpToLesson.value = newIndex + 1;
});

const currentStory = computed(() => stories[localStoryIndex.value]);
const currentWordSet = computed(() => wordSets.find(ws => ws.storyId === currentStory.value.id));

const handleWordClick = ({ word, isTarget }: { word: string; isTarget: boolean }) => {
    selectedWord.value = word;
    isSelectedWordTarget.value = isTarget;
    showModal.value = true;
};

const handleTargetWordClick = (word: string) => {
    selectedWord.value = word;
    isSelectedWordTarget.value = true;
    showModal.value = true;
};

const getExampleSentence = (): string => {
    if (!isSelectedWordTarget.value) return '';
    const sentences = currentStory.value.content.split(/[.!?]+/);
    const sentence = sentences.find(s => s.toLowerCase().includes(selectedWord.value.toLowerCase()));
    return sentence ? sentence.trim() : '';
};

const toggleStoryAudio = () => toggleAudio(currentStory.value.content);
const markAsLearned = () => { if (currentWordSet.value) markStoryAsLearned(currentStory.value.id, currentWordSet.value.words); };
const previousStory = () => { if (localStoryIndex.value > 0) { localStoryIndex.value--; showTranslation.value = false; } };
const nextStory = () => { if (localStoryIndex.value < stories.length - 1) { localStoryIndex.value++; showTranslation.value = false; } };
const handleJumpToLesson = () => {
    if (jumpToLesson.value === null) return;
    const targetIndex = jumpToLesson.value - 1;
    if (targetIndex >= 0 && targetIndex < stories.length) { localStoryIndex.value = targetIndex; showTranslation.value = false; }
    else { alert(`กรุณากรอกเลขบทเรียนระหว่าง 1-${stories.length}`); jumpToLesson.value = localStoryIndex.value + 1; }
};
</script>

<style scoped>
.sticky-top-controls {
    position: sticky;
    top: 1rem;
    /* ระยะห่างจากด้านบน mobile header */
    z-index: 900;
    background: rgba(30, 30, 30, 0.8);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.bg-darker {
    background-color: #121212;
}

.btn-dark-soft {
    background-color: rgba(255, 255, 255, 0.05);
    color: var(--text-main);
    border: none;
}

.btn-dark-soft:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
}

.icon-btn {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
}

.lesson-input {
    background: transparent;
    border: none;
    color: white;
    width: 40px;
    text-align: center;
    font-weight: bold;
}

.lesson-input:focus {
    outline: none;
    border-bottom: 2px solid var(--primary);
}

.status-bar {
    height: 4px;
    width: 100%;
    background: transparent;
    transition: background 0.3s;
}

.status-bar.learned {
    background: var(--success-color, #10B981);
}

.btn-circle {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.25rem;
    transition: transform 0.2s;
}

.btn-circle:active {
    transform: scale(0.95);
}

.rounded-xl {
    border-radius: 16px;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

@media (min-width: 768px) {
    .sticky-top-controls {
        top: 2rem;
    }
}
</style>