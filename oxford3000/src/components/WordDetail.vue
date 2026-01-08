<template>
    <div v-if="show" class="modal d-block" tabindex="-1" style="background-color: rgba(0,0,0,0.5);"
        @click.self="$emit('close')">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{ word.word }}</h5>
                    <button type="button" class="btn-close" @click="$emit('close')"></button>
                </div>
                <div class="modal-body">
                    <div v-if="word.partOfSpeech" class="mb-2">
                        <span class="badge bg-secondary">{{ word.partOfSpeech }}</span>
                    </div>

                    <div class="mb-3">
                        <strong>ความหมาย:</strong> {{ word.meaning }}
                    </div>

                    <div v-if="word.exampleSentence" class="mb-3">
                        <strong>ตัวอย่าง:</strong>
                        <div class="text-muted fst-italic">
                            {{ word.exampleSentence }}
                        </div>
                    </div>

                    <button class="btn btn-primary" @click="playSound">
                        <span v-if="!isPlaying">🔊 ฟังเสียง</span>
                        <span v-else>⏸️ หยุด</span>
                    </button>

                    <div v-if="isLearned" class="mt-3">
                        <span class="badge bg-success">✓ เรียนแล้ว</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Word } from '@/type/index';
import { useTTS } from '../composables/useTTS';

const props = defineProps<{
    show: boolean;
    word: Word;
    isLearned: boolean;
}>();

const emit = defineEmits<{
    close: [];
}>();

const { speakWord, isPlaying } = useTTS();

const playSound = () => {
    speakWord(props.word.word);
};
</script>