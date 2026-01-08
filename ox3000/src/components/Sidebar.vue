<template>
    <nav class="sidebar-container d-flex flex-column">
        <div class="sidebar-header mb-4">
            <h4 class="brand-title">
                Oxford<span class="text-gradient">3000</span>
            </h4>
            <p class="brand-subtitle">Essential Vocabulary</p>
        </div>

        <div class="flex-grow-1">
            <ul class="nav flex-column gap-2">
                <li class="nav-item">
                    <router-link to="/lesson" class="nav-link-custom" active-class="active">
                        <span class="icon-box">
                            <i class="bi bi-book-half"></i>
                        </span>
                        <span class="link-text">Lesson</span>
                        <i class="bi bi-chevron-right ms-auto arrow-icon"></i>
                    </router-link>
                </li>
                <li class="nav-item">
                    <router-link to="/vocabulary" class="nav-link-custom" active-class="active">
                        <span class="icon-box">
                            <i class="bi bi-collection-fill"></i>
                        </span>
                        <span class="link-text">Vocabulary</span>
                        <i class="bi bi-chevron-right ms-auto arrow-icon"></i>
                    </router-link>
                </li>
            </ul>
        </div>

        <div class="sidebar-footer mt-4">
            <div class="progress-card">
                <div class="d-flex justify-content-between align-items-end mb-3">
                    <h6 class="m-0 text-uppercase fw-bold small tracking-wide">My Progress</h6>
                </div>

                <div class="progress-item mb-3">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="text-xs">Stories</span>
                        <span class="text-xs fw-bold text-primary">{{ totalLearnedStories }}</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill bg-gradient-primary"
                            :style="{ width: getPercent(totalLearnedStories, 100) + '%' }"></div>
                    </div>
                </div>

                <div class="progress-item mb-4">
                    <div class="d-flex justify-content-between mb-1">
                        <span class="text-xs">Words</span>
                        <span class="text-xs fw-bold text-success">{{ totalLearnedWords }}</span>
                    </div>
                    <div class="progress-track">
                        <div class="progress-fill bg-gradient-success"
                            :style="{ width: getPercent(totalLearnedWords, 3000) + '%' }"></div>
                    </div>
                </div>

                <button class="btn btn-reset w-100" @click="handleReset">
                    <i class="bi bi-arrow-counterclockwise me-2"></i>
                    <span>Reset Progress</span>
                </button>
            </div>
        </div>
    </nav>
</template>

<script setup lang="ts">
import { useProgress } from '@/composables/useProgress';

const { totalLearnedWords, totalLearnedStories, resetProgress } = useProgress();

const handleReset = () => {
    if (confirm('คุณแน่ใจหรือไม่ที่จะรีเซ็ทความคืบหน้าทั้งหมด?')) {
        resetProgress();
    }
};

const getPercent = (value: number, max: number) => {
    return Math.min((value / max) * 100, 100);
};
</script>

<style scoped>
/* Import Font: Poppins */
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');

.sidebar-container {
    background-color: #121212;
    /* Very Dark Grey */
    min-height: 100vh;
    padding: 2rem 1.5rem;
    font-family: 'Poppins', sans-serif;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    width: 280px;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

/* Header Styling */
.brand-title {
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.2rem;
    font-size: 1.5rem;
    letter-spacing: -0.5px;
}

.text-gradient {
    background: linear-gradient(135deg, #3B82F6, #8B5CF6);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
}

.brand-subtitle {
    font-size: 0.75rem;
    color: #6c757d;
    font-weight: 400;
    letter-spacing: 0.5px;
}

/* Navigation Links */
.nav-link-custom {
    display: flex;
    align-items: center;
    padding: 0.8rem 1rem;
    color: #a0aec0;
    text-decoration: none;
    border-radius: 12px;
    transition: all 0.3s ease;
    border: 1px solid transparent;
}

.icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    margin-right: 12px;
    transition: all 0.3s ease;
}

.link-text {
    font-weight: 500;
    font-size: 0.95rem;
}

.arrow-icon {
    font-size: 0.8rem;
    opacity: 0;
    transform: translateX(-10px);
    transition: all 0.3s ease;
}

/* Hover State */
.nav-link-custom:hover {
    color: #fff;
    background-color: rgba(255, 255, 255, 0.03);
}

.nav-link-custom:hover .arrow-icon {
    opacity: 1;
    transform: translateX(0);
}

/* Active State */
.nav-link-custom.active {
    background: linear-gradient(90deg, rgba(59, 130, 246, 0.15), rgba(59, 130, 246, 0.05));
    border: 1px solid rgba(59, 130, 246, 0.3);
    color: #60A5FA;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.nav-link-custom.active .icon-box {
    background: #3B82F6;
    color: white;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
}

/* Progress Footer */
.progress-card {
    background: #1A1A1A;
    border-radius: 16px;
    padding: 1.25rem;
    border: 1px solid rgba(255, 255, 255, 0.05);
}

.tracking-wide {
    letter-spacing: 1px;
    font-size: 0.7rem;
}

.progress-track {
    width: 100%;
    height: 6px;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 10px;
    overflow: hidden;
}

.progress-fill {
    height: 100%;
    border-radius: 10px;
    transition: width 1s ease;
}

.bg-gradient-primary {
    background: linear-gradient(90deg, #3B82F6, #60A5FA);
}

.bg-gradient-success {
    background: linear-gradient(90deg, #10B981, #34D399);
}

.text-xs {
    font-size: 0.75rem;
}

/* Reset Button */
.btn-reset {
    background: transparent;
    border: 1px solid rgba(220, 53, 69, 0.3);
    color: #ef4444;
    font-size: 0.85rem;
    border-radius: 8px;
    padding: 0.5rem;
    transition: all 0.2s;
}

.btn-reset:hover {
    background: rgba(220, 53, 69, 0.1);
    border-color: #ef4444;
    color: #fff;
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
    .sidebar-container {
        height: 100vh;
        width: 100%;
        position: relative;
        min-height: auto;
        border-right: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
}
</style>