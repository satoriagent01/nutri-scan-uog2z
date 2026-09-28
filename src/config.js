const STORAGE_KEY = "nutriscan-ai-config";

const DEFAULT_CONFIG = {
  url: "",
  apiKey: ""
};

export function setAIConfig(url, apiKey) {
  const config = { url, apiKey };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
}

export function getAIConfig() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { ...DEFAULT_CONFIG };
    }
  }
  return { ...DEFAULT_CONFIG };
}