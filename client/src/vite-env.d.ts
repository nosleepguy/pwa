/// <reference types="vite/client" />

// Extend the Navigator type to include 'standalone'
interface Navigator {
    standalone?: boolean;
    getInstalledRelatedApps?: () => Promise<Array<{ platform: string; url: string }>>;
  }