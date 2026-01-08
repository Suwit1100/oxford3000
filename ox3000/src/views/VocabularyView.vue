<template>
    <div class="vocabulary-view container-fluid p-0">
        <h2 class="fw-bold mb-4">คลังคำศัพท์</h2>

        <div class="row g-3 mb-5">
            <div class="col-6">
                <div class="stat-card bg-primary-gradient">
                    <h1 class="display-4 fw-bold mb-0 text-white">{{ totalLearnedWords }}</h1>
                    <span class="text-white opacity-75 small">คำที่จำได้</span>
                    <i class="bi bi-translate icon-bg"></i>
                </div>
            </div>
            <div class="col-6">
                <div class="stat-card bg-success-gradient">
                    <h1 class="display-4 fw-bold mb-0 text-white">{{ totalLearnedStories }}</h1>
                    <span class="text-white opacity-75 small">เรื่องที่อ่านจบ</span>
                    <i class="bi bi-book icon-bg"></i>
                </div>
            </div>
        </div>

        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5 class="m-0 fw-bold">รายการคำศัพท์</h5>
        </div>

        <div v-if="learnedWordsList.length === 0"
            class="empty-state text-center py-5 rounded-3 border border-secondary border-opacity-25 border-dashed">
            <i class="bi bi-inbox display-1  opacity-25"></i>
            <p class="mt-3 ">ยังไม่มีข้อมูล</p>
            <router-link to="/lesson" class="btn btn-primary rounded-pill px-4">เริ่มเรียนเลย</router-link>
        </div>

        <div v-else class="row g-3">
            <div v-for="word in learnedWordsList" :key="word" class="col-12 col-sm-6 col-lg-4">
                <div class="word-card-item" @click="viewWordDetail(word)">
                    <span class="fw-bold fs-5">{{ word }}</span>
                    <i class="bi bi-check-circle-fill text-success"></i>
                </div>
            </div>
        </div>

        <WordDetailModal :show="showModal" :word="selectedWord" :is-target-word="true" @close="showModal = false" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useProgress } from '@/composables/useProgress';
import WordDetailModal from '@/components/WordDetailModal.vue';

const { totalLearnedWords, totalLearnedStories, getAllLearnedWords } = useProgress();
const showModal = ref(false);
const selectedWord = ref('');
const learnedWordsList = computed(() => getAllLearnedWords().sort());
const viewWordDetail = (word: string) => { selectedWord.value = word; showModal.value = true; };
</script>

<style scoped>
.stat-card {
    position: relative;
    padding: 1.5rem;
    border-radius: 20px;
    overflow: hidden;
    height: 100%;
    border: none;
}

.bg-primary-gradient {
    background: linear-gradient(135deg, #3B82F6, #2563EB);
}

.bg-success-gradient {
    background: linear-gradient(135deg, #10B981, #059669);
}

.icon-bg {
    position: absolute;
    right: -10px;
    bottom: -20px;
    font-size: 5rem;
    opacity: 0.2;
    transform: rotate(-15deg);
}

.word-card-item {
    background: var(--bg-card);
    border: 1px solid rgba(255, 255, 255, 0.05);
    padding: 1rem 1.25rem;
    border-radius: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    transition: all 0.2s;
}

.word-card-item:hover {
    background: rgba(255, 255, 255, 0.1);
    transform: translateX(5px);
}
</style>