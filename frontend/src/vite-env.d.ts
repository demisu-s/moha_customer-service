// src/vite-env.d.ts
/// <reference types="vite/client" />

interface Crypto {
  randomUUID: () => string;
}

interface Window {
  crypto: Crypto;
  msCrypto: Crypto;
}