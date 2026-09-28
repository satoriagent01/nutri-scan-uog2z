let config = { url: "", apiKey: "" };

export function setAIConfig(url, apiKey) {
  config = { url, apiKey };
}

export function getAIConfig() {
  return { ...config };
}