<template>
    <div class="vocabulary-view">
        <div class="container py-4">
            <h2 class="mb-4">คลังคำศัพท์</h2>

            <div class="row mb-4">
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body text-center">
                            <h1 class="display-4 text-primary">{{ totalLearnedWords }}</h1>
                            <p class="text-muted">คำที่เรียนแล้ว</p>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card">
                        <div class="card-body text-center">
                            <h1 class="display-4 text-success">{{ totalLearnedStories }}</h1>
                            <p class="text-muted">เรื่องที่เรียนแล้ว</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Learned Words List -->
            <div class="card">
                <div class="card-header">
                    <h5 class="mb-0">คำศัพท์ทั้งหมด</h5>
                </div>
                <div class="card-body">
                    <div v-if="learnedWordsList.length === 0" class="text-center text-muted py-5">
                        <i class="bi bi-inbox display-1"></i>
                        <p class="mt-3">ยังไม่มีคำศัพท์ที่เรียนแล้ว</p>
                        <router-link to="/lesson" class="btn btn-primary">
                            เริ่มเรียน
                        </router-link>
                    </div>

                    <div v-else class="row g-3">
                        <div v-for="word in learnedWordsList" :key="word" class="col-md-6 col-lg-4">
                            <div class="card h-100 word-card" @click="viewWordDetail(word)">
                                <div class="card-body">
                                    <h6 class="card-title">{{ word }}</h6>
                                    <span class="badge bg-success">
                                        <i class="bi bi-check-circle"></i> เรียนแล้ว
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Word Detail Modal -->
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

const learnedWordsList = computed(() => {
    return getAllLearnedWords().sort();
});

const viewWordDetail = (word: string) => {
    selectedWord.value = word;
    showModal.value = true;
};
</script>

<style scoped>
.word-card {
    cursor: pointer;
    transition: all 0.2s;
}

.word-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>