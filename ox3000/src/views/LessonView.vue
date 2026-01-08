<template>
    <div class="lesson-view">
        <div class="container py-4">
            <!-- Story Navigation -->
            <div class="row align-items-center mb-4">
                <!-- Previous Button -->
                <div class="col-3 col-md-2">
                    <button class="btn btn-outline-secondary w-100" :disabled="localStoryIndex === 0"
                        @click="previousStory">
                        <i class="bi bi-chevron-left"></i>
                        <span class="d-none d-md-inline"> ก่อนหน้า</span>
                    </button>
                </div>

                <!-- Lesson Counter + Jump -->
                <div class="col-6 col-md-8 text-center">
                    <div class="d-flex justify-content-center align-items-center gap-2">
                        <h4 class="mb-0">Lesson</h4>
                        <input type="number" v-model.number="jumpToLesson" @keyup.enter="handleJumpToLesson" :min="1"
                            :max="stories.length" class="form-control form-control-sm lesson-input" placeholder="#" />
                        <span class="text-muted">/ {{ stories.length }}</span>
                        <button class="btn btn-sm btn-primary" @click="handleJumpToLesson" title="ไปที่บทเรียน">
                            <i class="bi bi-arrow-right-circle"></i>
                        </button>
                    </div>
                </div>

                <!-- Next Button -->
                <div class="col-3 col-md-2">
                    <button class="btn btn-outline-secondary w-100" :disabled="localStoryIndex === stories.length - 1"
                        @click="nextStory">
                        <span class="d-none d-md-inline">ถัดไป </span>
                        <i class="bi bi-chevron-right"></i>
                    </button>
                </div>
            </div>

            <!-- Story Badge -->
            <div class="mb-3" v-if="isStoryLearned(currentStory.id)">
                <span class="badge bg-success">
                    <i class="bi bi-check-circle me-1"></i>
                    เรียนแล้ว
                </span>
            </div>

            <!-- Story Content Card -->
            <div class="card mb-4">
                <div class="card-header d-flex justify-content-between align-items-center">
                    <h5 class="mb-0">Story</h5>
                    <button class="btn btn-sm" :class="isPlaying ? 'btn-danger' : 'btn-primary'"
                        @click="toggleStoryAudio">
                        <i class="bi" :class="isPlaying ? 'bi-pause-fill' : 'bi-play-fill'"></i>
                        {{ isPlaying ? 'หยุด' : 'ฟังเรื่อง' }}
                    </button>
                </div>
                <div class="card-body">
                    <StoryContent :content="currentStory.content" :target-words="currentWordSet?.words || []"
                        @word-click="handleWordClick" />

                    <!-- Toggle Thai Translation -->
                    <div class="mt-4">
                        <button class="btn btn-sm btn-outline-secondary mb-3"
                            @click="showTranslation = !showTranslation">
                            <i class="bi" :class="showTranslation ? 'bi-eye-slash' : 'bi-eye'"></i>
                            {{ showTranslation ? 'ซ่อนคำแปล' : 'แสดงคำแปล' }}
                        </button>

                        <div v-if="showTranslation" class="translation-text p-3 bg-light rounded">
                            {{ currentStory.translation }}
                        </div>
                    </div>
                </div>
            </div>

            <!-- Word List -->
            <WordList :words="currentWordSet?.words || []" @word-click="handleTargetWordClick" />

            <!-- Mark as Learned Button -->
            <div class="text-center mt-4">
                <button class="btn btn-lg btn-success" :disabled="isStoryLearned(currentStory.id)"
                    @click="markAsLearned">
                    <i class="bi bi-check-circle me-2"></i>
                    {{ isStoryLearned(currentStory.id) ? 'เรียนแล้ว' : 'เรียนเสร็จแล้ว' }}
                </button>
            </div>
        </div>

        <!-- Word Detail Modal -->
        <WordDetailModal :show="showModal" :word="selectedWord" :is-target-word="isSelectedWordTarget"
            :example-from-story="getExampleSentence()" @close="showModal = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { stories, wordSets } from '@/data/mockData';
import StoryContent from '@/components/StoryContent.vue';
import WordList from '@/components/WordList.vue';
import WordDetailModal from '@/components/WordDetailModal.vue';
import { useProgress } from '@/composables/useProgress';
import { useTextToSpeech } from '@/composables/useTextToSpeech';

// Local state
const localStoryIndex = ref(0);
const showModal = ref(false);
const selectedWord = ref('');
const isSelectedWordTarget = ref(false);
const showTranslation = ref(false);
const jumpToLesson = ref<number | null>(null);

const {
    markStoryAsLearned,
    isStoryLearned,
    setCurrentLesson,
    getCurrentLesson
} = useProgress();

const { isPlaying, toggle: toggleAudio } = useTextToSpeech();

// Load saved lesson on mount
onMounted(() => {
    const savedLesson = getCurrentLesson();
    if (savedLesson >= 0 && savedLesson < stories.length) {
        localStoryIndex.value = savedLesson;
    }
    jumpToLesson.value = localStoryIndex.value + 1;
});

// Watch local index and save to storage
watch(localStoryIndex, (newIndex) => {
    setCurrentLesson(newIndex);
    jumpToLesson.value = newIndex + 1;
});

const currentStory = computed(() => stories[localStoryIndex.value]);
const currentWordSet = computed(() =>
    wordSets.find(ws => ws.storyId === currentStory.value.id)
);

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
    const sentence = sentences.find(s =>
        s.toLowerCase().includes(selectedWord.value.toLowerCase())
    );

    return sentence ? sentence.trim() : '';
};

const toggleStoryAudio = () => {
    toggleAudio(currentStory.value.content);
};

const markAsLearned = () => {
    if (currentWordSet.value) {
        markStoryAsLearned(currentStory.value.id, currentWordSet.value.words);
    }
};

const previousStory = () => {
    if (localStoryIndex.value > 0) {
        localStoryIndex.value--;
        showTranslation.value = false;
    }
};

const nextStory = () => {
    if (localStoryIndex.value < stories.length - 1) {
        localStoryIndex.value++;
        showTranslation.value = false;
    }
};

const handleJumpToLesson = () => {
    if (jumpToLesson.value === null) return;

    const targetIndex = jumpToLesson.value - 1; // Convert to 0-based index

    if (targetIndex >= 0 && targetIndex < stories.length) {
        localStoryIndex.value = targetIndex;
        showTranslation.value = false;
    } else {
        alert(`กรุณากรอกเลขบทเรียนระหว่าง 1-${stories.length}`);
        jumpToLesson.value = localStoryIndex.value + 1;
    }
};
</script>

<style scoped>
.translation-text {
    font-size: 1rem;
    line-height: 1.6;
    color: #495057;
}

.lesson-input {
    width: 70px;
    text-align: center;
    display: inline-block;
}

/* Remove spinner arrows from number input */
.lesson-input::-webkit-outer-spin-button,
.lesson-input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.lesson-input[type=number] {
    -moz-appearance: textfield;
    appearance: textfield;
    /* เพิ่ม standard property */
}
</style>