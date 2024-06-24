/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_OPTIMIZELY_SDK_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
