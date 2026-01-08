<template>
    <div class="story-content">
        <span v-for="(word, index) in words" :key="index" :class="getWordClass(word)" @click="handleWordClick(word)"
            class="story-word">
            {{ word }}{{ ' ' }}
        </span>
    </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
    content: string;
    targetWords: string[];
}

const props = defineProps<Props>();
const emit = defineEmits(['wordClick']);

const words = computed(() => {
    // Split by spaces but keep punctuation with words
    return props.content.split(' ');
});

const getWordClass = (word: string): string => {
    // Remove punctuation for comparison
    const cleanWord = word.replace(/[.,!?;:]/g, '').toLowerCase();
    const isTarget = props.targetWords.map(w => w.toLowerCase()).includes(cleanWord);

    return isTarget ? 'target-word' : 'regular-word';
};

const handleWordClick = (word: string) => {
    // Remove punctuation for the word detail
    const cleanWord = word.replace(/[.,!?;:]/g, '');
    const isTarget = props.targetWords.map(w => w.toLowerCase()).includes(cleanWord.toLowerCase());

    emit('wordClick', {
        word: cleanWord,
        isTarget
    });
};
</script>

<style scoped>
.story-content {
    font-size: 1.1rem;
    line-height: 1.8;
    margin-bottom: 2rem;
}

.story-word {
    cursor: pointer;
    transition: all 0.2s;
}

.story-word:hover {
    background-color: #f8f9fa;
    border-radius: 3px;
}

.target-word {
    color: #0d6efd;
    border-bottom: 2px solid #0d6efd;
    font-weight: 500;
}

.regular-word {
    color: #212529;
}
</style>