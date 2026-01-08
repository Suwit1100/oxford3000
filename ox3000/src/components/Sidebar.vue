<template>
    <nav class="sidebar bg-dark text-white p-3">
        <h4 class="mb-4">Oxford 3000</h4>

        <ul class="nav flex-column">
            <li class="nav-item mb-2">
                <router-link to="/lesson" class="nav-link text-white" active-class="active">
                    <i class="bi bi-book me-2"></i>
                    Lesson
                </router-link>
            </li>
            <li class="nav-item mb-2">
                <router-link to="/vocabulary" class="nav-link text-white" active-class="active">
                    <i class="bi bi-journal-text me-2"></i>
                    Vocabulary
                </router-link>
            </li>
        </ul>

        <hr class="my-4 bg-secondary">

        <div class="progress-section">
            <h6 class="mb-3">ความคืบหน้า</h6>
            <p class="mb-2">
                <i class="bi bi-check-circle me-2"></i>
                Stories: {{ totalLearnedStories }}
            </p>
            <p class="mb-3">
                <i class="bi bi-book me-2"></i>
                Words: {{ totalLearnedWords }}
            </p>

            <!-- Reset Button -->
            <button class="btn btn-danger btn-sm w-100" @click="handleReset" title="รีเซ็ทความคืบหน้าทั้งหมด">
                <i class="bi bi-arrow-clockwise me-2"></i>
                รีเซ็ททั้งหมด
            </button>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useProgress } from '@/composables/useProgress';

const { totalLearnedWords, totalLearnedStories, resetProgress } = useProgress();

const handleReset = () => {
    resetProgress();
};
</script>

<style scoped>
.sidebar {
    min-height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    width: 250px;
    overflow-y: auto;
}

.nav-link {
    border-radius: 5px;
    transition: background-color 0.2s;
}

.nav-link:hover {
    background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
    background-color: #0d6efd;
}

.progress-section {
    font-size: 0.9rem;
}

.btn-danger {
    margin-top: 0.5rem;
}

@media (max-width: 768px) {
    .sidebar {
        width: 100%;
        position: relative;
        min-height: auto;
    }
}
</style>