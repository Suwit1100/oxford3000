<template>
    <div class="container py-4">
        <h2 class="mb-4">Vocabulary</h2>

        <div class="row mb-3">
            <div class="col-md-6">
                <input v-model="searchQuery" type="text" class="form-control" placeholder="🔍 ค้นหาคำศัพท์..." />
            </div>
            <div class="col-md-6">
                <select v-model="filterStatus" class="form-select">
                    <option value="all">ทั้งหมด</option>
                    <option value="learned">เรียนแล้ว</option>
                    <option value="not-learned">ยังไม่เรียน</option>
                </select>
            </div>
        </div>

        <div class="mb-3">
            <span class="badge bg-primary">ทั้งหมด: {{ allWords.length }} คำ</span>
            <span class="badge bg-success ms-2">เรียนแล้ว: {{ learnedCount }} คำ</span>
            <span class="badge bg-secondary ms-2">ยังไม่เรียน: {{ notLearnedCount }} คำ</span>
        </div>

        <div class="row">
            <div v-for="word in filteredWords" :key="word.word" class="col-md-6 mb-3">
                <div class="card h-100" :class="{ 'border-success': isWordLearned(word.word) }" style="cursor: pointer;"
                    @click="handleWordClick(word)">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title mb-0">{{ word.word }}</h5>
                            <div>
                                <span v-if="word.partOfSpeech" class="badge bg-secondary">
                                    {{ word.partOfSpeech }}
                                </span>
                                <span v-if="isWordLearned(word.word)" class="badge bg-success ms-2">
                                    ✓
                                </span>
                            </div>
                        </div>
                        <p class="card-text text-muted">{{ word.meaning }}</p>
                        <button class="btn btn-sm btn-outline-primary" @click.stop="playWord(word.word)">
                            🔊 ฟัง
                        </button>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="filteredWords.length === 0" class="alert alert-info">
            ไม่พบคำศัพท์ที่ค้นหา
        </div>

        <!-- Word Detail Modal -->
        <WordDetail :show="showWordDetail" :word="selectedWordDetail"
            :is-learned="isWordLearned(selectedWordDetail.word)" @close="showWordDetail = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { vocabulary } from '../data/vocabulary';
import { Word } from '@/type/index';
import { useStorage } from '../composables/useStorage';
import { useTTS } from '../composables/useTTS';
import WordDetail from './WordDetail.vue';

const searchQuery = ref('');
const filterStatus = ref('all');
const showWordDetail = ref(false);
const selectedWordDetail = ref<Word>({ word: '', meaning: '' });

const { isWordLearned, loadState } = useStorage();
const { speakWord } = useTTS();

onMounted(async () => {
    await loadState();
});

// คำศัพท์ทั้งหมด
const allWords = computed(() => {
    return Object.values(vocabulary);
});

// กรองคำศัพท์ตามการค้นหาและสถานะ
const filteredWords = computed(() => {
    let words = allWords.value;

    // กรองตามการค้นหา
    if (searchQuery.value.trim()) {
        const query = searchQuery.value.toLowerCase();
        words = words.filter(w =>
            w.word.toLowerCase().includes(query) ||
            w.meaning.toLowerCase().includes(query)
        );
    }

    // กรองตามสถานะ
    if (filterStatus.value === 'learned') {
        words = words.filter(w => isWordLearned(w.word));
    } else if (filterStatus.value === 'not-learned') {
        words = words.filter(w => !isWordLearned(w.word));
    }

    return words;
});

// นับจำนวน
const learnedCount = computed(() =>
    allWords.value.filter(w => isWordLearned(w.word)).length
);

const notLearnedCount = computed(() =>
    allWords.value.filter(w => !isWordLearned(w.word)).length
);

// จัดการเมื่อคลิกคำ
const handleWordClick = (word: Word) => {
    selectedWordDetail.value = word;
    showWordDetail.value = true;
};

// ฟังเสียงคำ
const playWord = (word: string) => {
    speakWord(word);
};
</script>