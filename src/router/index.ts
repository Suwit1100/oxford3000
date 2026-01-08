import { createRouter, createWebHashHistory } from "vue-router";
import LessonView from "@/views/LessonView.vue";
import VocabularyView from "@/views/VocabularyView.vue";

const router = createRouter({
  history: createWebHashHistory(), // <-- เปลี่ยนตรงนี้
  routes: [
    {
      path: "/",
      redirect: "/lesson",
    },
    {
      path: "/lesson",
      name: "lesson",
      component: LessonView,
    },
    {
      path: "/vocabulary",
      name: "vocabulary",
      component: VocabularyView,
    },
  ],
});

export default router;
