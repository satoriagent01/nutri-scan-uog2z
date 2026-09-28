import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { setAIConfig, getAIConfig } from "../src/config.js";

describe("AI Configuration", () => {
  test("AC-22: sets AI configuration correctly", () => {
    setAIConfig("https://api.openai.com/v1", "test-api-key-123");
    const config = getAIConfig();
    
    assert.equal(config.url, "https://api.openai.com/v1");
    assert.equal(config.apiKey, "test-api-key-123");
  });

  test("AC-23: retrieves default configuration when not set", () => {
    // Assuming default values are set initially
    const config = getAIConfig();
    
    // Check that config object exists and has expected structure
    assert.ok(config);
    assert.ok(typeof config.url === "string");
    assert.ok(typeof config.apiKey === "string");
  });

  test("AC-24: updates existing configuration", () => {
    // Set initial config
    setAIConfig("https://api.openai.com/v1", "initial-key");
    
    // Update config
    setAIConfig("https://api.example.com/v1", "updated-key");
    
    const config = getAIConfig();
    assert.equal(config.url, "https://api.example.com/v1");
    assert.equal(config.apiKey, "updated-key");
  });

  test("AC-25: handles empty string configuration", () => {
    setAIConfig("", "");
    const config = getAIConfig();
    
    assert.equal(config.url, "");
    assert.equal(config.apiKey, "");
  });

  test("AC-26: configuration persists across calls", () => {
    setAIConfig("https://persistent.api.com/v1", "persistent-key");
    
    // Multiple calls to getAIConfig should return the same values
    const config1 = getAIConfig();
    const config2 = getAIConfig();
    
    assert.equal(config1.url, config2.url);
    assert.equal(config1.apiKey, config2.apiKey);
    assert.equal(config1.url, "https://persistent.api.com/v1");
    assert.equal(config1.apiKey, "persistent-key");
  });
});