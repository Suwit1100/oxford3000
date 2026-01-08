<template>
    <div class="story-content-wrapper">
        <p class="story-text">
            <span v-for="(word, index) in words" :key="index" :class="getWordClass(word)" @click="handleWordClick(word)"
                class="story-word">
                {{ word }}{{ ' ' }}
            </span>
        </p>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props { content: string; targetWords: string[]; }
const props = defineProps<Props>();
const emit = defineEmits(['wordClick']);

const words = computed(() => props.content.split(' '));

const getWordClass = (word: string): string => {
    const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
    const isTarget = props.targetWords.map(w => w.toLowerCase()).includes(cleanWord);
    return isTarget ? 'target-word' : 'regular-word';
};

const handleWordClick = (word: string) => {
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    const isTarget = props.targetWords.map(w => w.toLowerCase()).includes(cleanWord.toLowerCase());
    emit('wordClick', { word: cleanWord, isTarget });
};
</script>

<style scoped>
.story-content-wrapper {
    /* เพิ่ม Line height ให้อ่านง่าย */
    line-height: 2;
    font-size: 1.15rem;
    font-weight: 300;
}

.story-word {
    cursor: pointer;
    border-radius: 4px;
    padding: 0 2px;
    transition: all 0.2s;
    display: inline-block;
}

/* Hover Effect ที่นุ่มนวล */
.story-word:hover {
    background-color: rgba(255, 255, 255, 0.1);
    color: white;
}

/* Target Word: สีฟ้าสว่างและขีดเส้นใต้แบบจุด */
.target-word {
    color: #60A5FA;
    /* Blue-400 */
    font-weight: 500;
    text-decoration: underline;
    text-decoration-color: rgba(96, 165, 250, 0.5);
    text-underline-offset: 4px;
}

.target-word:hover {
    background-color: rgba(59, 130, 246, 0.2);
    color: #93C5FD;
}

.regular-word {
    color: #D1D5DB;
    /* Gray-300 */
}
</style>