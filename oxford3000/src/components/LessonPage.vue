<template>
    <div class="container py-4">
        <div class="d-flex justify-content-between align-items-center mb-4">
            <h2>Lesson {{ currentStoryIndex + 1 }} / {{ stories.length }}</h2>

            <div>
                <button class="btn btn-outline-secondary me-2" :disabled="currentStoryIndex === 0"
                    @click="previousStory">
                    ⬅️ ก่อนหน้า
                </button>
                <button class="btn btn-outline-secondary" :disabled="currentStoryIndex === stories.length - 1"
                    @click="nextStory">
                    ถัดไป ➡️
                </button>
            </div>
        </div>

        <!-- แสดงว่าเรียนแล้วหรือยัง -->
        <div v-if="isCurrentStoryLearned" class="alert alert-success">
            ✓ คุณเรียน Lesson นี้แล้ว
        </div>

        <!-- Story Component -->
        <Story :content="currentStory.content" :translation="currentStory.translation"
            :target-words="currentTargetWords" @word-click="handleWordClick" />

        <!-- Word List Component -->
        <WordList :words="currentWordsList" :is-word-learned="isWordLearned" @word-click="handleWordClick" />

        <!-- ปุ่ม "เรียนแล้ว" -->
        <div class="text-center mt-4">
            <button class="btn btn-success btn-lg" :disabled="isCurrentStoryLearned" @click="markAsLearned">
                <span v-if="!isCurrentStoryLearned">✓ เรียนแล้ว</span>
                <span v-else>✓ เรียนแล้ว</span>
            </button>
            <div class="text-muted mt-2 small">
                กดปุ่มนี้เมื่อคุณเรียนจบ Story และคำศัพท์ทั้ง 10 คำแล้ว
            </div>
        </div>

        <!-- Word Detail Modal -->
        <WordDetail :show="showWordDetail" :word="selectedWordDetail"
            :is-learned="isWordLearned(selectedWordDetail.word)" @close="showWordDetail = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { stories } from '../data/stories';
import { wordSets, vocabulary, getCommonWordMeaning } from '../data/vocabulary';
import { Word } from '@/type/index';
import { useStorage } from '../composables/useStorage';
import Story from './Story.vue';
import WordList from './WordList.vue';
import WordDetail from './WordDetail.vue';

const currentStoryIndex = ref(0);
const showWordDetail = ref(false);
const selectedWordDetail = ref<Word>({ word: '', meaning: '' });

const { isStoryLearned, isWordLearned, markStoryAsLearned, loadState } = useStorage();

onMounted(async () => {
    await loadState();
});

// Story ปัจจุบัน
const currentStory = computed(() => stories[currentStoryIndex.value]);

// คำศัพท์เป้าหมาย (10 คำ)
const currentTargetWords = computed(() => {
    const wordSet = wordSets.find(ws => ws.id === currentStory.value.wordSetId);
    return wordSet ? wordSet.words : [];
});

// รายการคำศัพท์พร้อมรายละเอียด
const currentWordsList = computed(() => {
    return currentTargetWords.value.map(word => vocabulary[word] || {
        word,
        meaning: 'ไม่พบความหมาย'
    });
});

// เช็คว่า story ปัจจุบันเรียนแล้วหรือยัง
const isCurrentStoryLearned = computed(() =>
    isStoryLearned(currentStory.value.id)
);

// จัดการเมื่อคลิกคำ
const handleWordClick = (word: string) => {
    const lowerWord = word.toLowerCase();

    // ถ้าเป็นคำศัพท์เป้าหมาย
    if (vocabulary[lowerWord]) {
        selectedWordDetail.value = vocabulary[lowerWord];
    } else {
        // ถ้าเป็นคำทั่วไป
        selectedWordDetail.value = {
            word: lowerWord,
            meaning: getCommonWordMeaning(lowerWord)
        };
    }

    showWordDetail.value = true;
};

// ทำเครื่องหมายว่าเรียนแล้ว
const markAsLearned = async () => {
    await markStoryAsLearned(currentStory.value.id, currentTargetWords.value);
};

// เปลี่ยน story
const previousStory = () => {
    if (currentStoryIndex.value > 0) {
        currentStoryIndex.value--;
        window.scrollTo(0, 0);
    }
};

const nextStory = () => {
    if (currentStoryIndex.value < stories.length - 1) {
        currentStoryIndex.value++;
        window.scrollTo(0, 0);
    }
};
</script>