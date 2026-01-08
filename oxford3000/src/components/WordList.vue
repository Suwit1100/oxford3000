<template>
    <div class="card">
        <div class="card-header bg-primary text-white">
            <h5 class="mb-0">คำศัพท์วันนี้ ({{ words.length }} คำ)</h5>
        </div>
        <div class="card-body">
            <div class="list-group">
                <div v-for="(word, index) in words" :key="word.word"
                    class="list-group-item d-flex justify-content-between align-items-start" style="cursor: pointer;"
                    @click="$emit('word-click', word.word)">
                    <div class="flex-grow-1">
                        <div class="fw-bold">{{ index + 1 }}. {{ word.word }}</div>
                        <div class="text-muted">{{ word.meaning }}</div>
                    </div>
                    <div>
                        <span v-if="word.partOfSpeech" class="badge bg-secondary">
                            {{ word.partOfSpeech }}
                        </span>
                        <span v-if="isWordLearned(word.word)" class="badge bg-success ms-2">
                            ✓
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Word } from '@/type/index';

defineProps<{
    words: Word[];
    isWordLearned: (word: string) => boolean;
}>();

defineEmits<{
    'word-click': [word: string];
}>();
</script>