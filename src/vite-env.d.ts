/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly BASE_URL: string;
  // เพิ่ม env variables อื่นๆ ตามต้องการ
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
