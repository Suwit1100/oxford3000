<template>
    <div class="card mb-4">
        <div class="card-body">
            <!-- ปุ่มฟัง Story -->
            <div class="mb-3">
                <button class="btn btn-primary" @click="togglePlay">
                    <span v-if="!isPlaying">▶️ ฟัง Story</span>
                    <span v-else>⏸️ หยุด</span>
                </button>
            </div>

            <!-- Story Content (แต่ละคำกดได้) -->
            <div class="story-content mb-4" style="font-size: 1.1rem; line-height: 1.8;">
                <span v-for="(word, index) in storyWords" :key="index" :class="getWordClass(word)" class="story-word"
                    @click="handleWordClick(word)">
                    {{ word }}
                </span>
            </div>

            <!-- แปลไทย -->
            <div class="mt-4">
                <button class="btn btn-sm btn-outline-secondary mb-2" @click="showTranslation = !showTranslation">
                    {{ showTranslation ? '🔼 ซ่อนคำแปล' : '🔽 แสดงคำแปล' }}
                </button>

                <div v-if="showTranslation" class="text-muted" style="line-height: 1.6;">
                    {{ translation }}
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTTS } from '../composables/useTTS';

const props = defineProps<{
    content: string;
    translation: string;
    targetWords: string[];
}>();

const emit = defineEmits<{
    'word-click': [word: string];
}>();

const showTranslation = ref(false);
const { speak, isPlaying } = useTTS();

// แยก story เป็นคำๆ (รวมเครื่องหมายวรรคตอน)
const storyWords = computed(() => {
    return props.content.split(/(\s+|[.,!?;:])/).filter(w => w.trim().length > 0 || w === ' ');
});

// เช็คว่าคำนี้เป็นคำศัพท์เป้าหมายหรือไม่
const isTargetWord = (word: string): boolean => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    return props.targetWords.some(target =>
        target.toLowerCase() === cleanWord
    );
};

// กำหนด CSS class ให้กับคำ
const getWordClass = (word: string): string => {
    if (word.trim() === '' || /^[.,!?;:]$/.test(word)) {
        return '';
    }
    return isTargetWord(word) ? 'target-word' : 'common-word';
};

// จัดการเมื่อคลิกคำ
const handleWordClick = (word: string) => {
    const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '');
    if (cleanWord) {
        emit('word-click', cleanWord);
    }
};

// ฟัง/หยุด Story
const togglePlay = () => {
    speak(props.content);
};
</script>

<style scoped>
.story-word {
    cursor: pointer;
    padding: 2px 0;
    transition: background-color 0.2s;
}

.target-word {
    color: #0d6efd;
    border-bottom: 2px dotted #0d6efd;
    font-weight: 500;
}

.target-word:hover {
    background-color: #e7f1ff;
}

.common-word:hover {
    background-color: #f8f9fa;
}
</style>