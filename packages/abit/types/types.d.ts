/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ENABLE_SPA: boolean;
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
