import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { extractNutrition } from "../src/ocr.js";

// Mock the global fetch for AI calls
global.fetch = async (url, options) => {
  const body = JSON.parse(options.body);
  const messages = body.messages;
  const lastMessage = messages[messages.length - 1].content;

  // Simulate AI response based on the image data hint
  if (lastMessage.includes("chocolate")) {
    return {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({
          name: "Chocolate Bar",
          brand: "TestBrand",
          servingSize: "30g",
          nutritionPer100g: {
            energyKj: 2292,
            energyKcal: 549,
            fat: 33,
            saturatedFat: 13,
            carbohydrates: 55,
            sugars: 45,
            fiber: 2.4,
            protein: 6.8,
            salt: 0.18
          }
        })} }],
      }),
    };
  }

  if (lastMessage.includes("juice")) {
    return {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({
          name: "Apple Orange Mango Juice",
          brand: "FreshJuice",
          servingSize: "200ml",
          nutritionPer100g: {
            energyKj: 199,
            energyKcal: 47,
            fat: 0,
            saturatedFat: 0,
            carbohydrates: 11,
            sugars: 10,
            fiber: 0,
            protein: 0.4,
            salt: 0
          }
        })} }],
      }),
    };
  }

  if (lastMessage.includes("oil")) {
    return {
      ok: true,
      json: async () => ({
        choices: [{ message: { content: JSON.stringify({
          name: "Extra Virgin Olive Oil",
          brand: "PremiumOil",
          servingSize: "100ml",
          nutritionPer100g: {
            energyKj: 3404,
            energyKcal: 828,
            fat: 92,
            saturatedFat: 0,
            carbohydrates: 0,
            sugars: 0,
            fiber: 0,
            protein: 0,
            salt: 0
          }
        })} }],
      }),
    };
  }

  // Default response
  return {
    ok: true,
    json: async () => ({
      choices: [{ message: { content: JSON.stringify({
        name: "Unknown Product",
        brand: "",
        servingSize: "100g",
        nutritionPer100g: {
          energyKj: 0,
          energyKcal: 0,
          fat: 0,
          saturatedFat: 0,
          carbohydrates: 0,
          sugars: 0,
          fiber: 0,
          protein: 0,
          salt: 0
        }
      })} }],
    }),
  };
};

describe("extractNutrition", () => {
  test("AC-1: extracts nutrition data from a chocolate bar image", async () => {
    const result = await extractNutrition("chocolate_bar_image_data");
    assert.equal(result.name, "Chocolate Bar");
    assert.equal(result.brand, "TestBrand");
    assert.equal(result.servingSize, "30g");
    assert.equal(result.nutritionPer100g.energyKj, 2292);
    assert.equal(result.nutritionPer100g.energyKcal, 549);
    assert.equal(result.nutritionPer100g.fat, 33);
    assert.equal(result.nutritionPer100g.saturatedFat, 13);
    assert.equal(result.nutritionPer100g.carbohydrates, 55);
    assert.equal(result.nutritionPer100g.sugars, 45);
    assert.equal(result.nutritionPer100g.fiber, 2.4);
    assert.equal(result.nutritionPer100g.protein, 6.8);
    assert.equal(result.nutritionPer100g.salt, 0.18);
  });

  test("AC-2: extracts nutrition data from a juice bottle image", async () => {
    const result = await extractNutrition("juice_bottle_image_data");
    assert.equal(result.name, "Apple Orange Mango Juice");
    assert.equal(result.brand, "FreshJuice");
    assert.equal(result.servingSize, "200ml");
    assert.equal(result.nutritionPer100g.energyKj, 199);
    assert.equal(result.nutritionPer100g.energyKcal, 47);
    assert.equal(result.nutritionPer100g.fat, 0);
    assert.equal(result.nutritionPer100g.saturatedFat, 0);
    assert.equal(result.nutritionPer100g.carbohydrates, 11);
    assert.equal(result.nutritionPer100g.sugars, 10);
    assert.equal(result.nutritionPer100g.fiber, 0);
    assert.equal(result.nutritionPer100g.protein, 0.4);
    assert.equal(result.nutritionPer100g.salt, 0);
  });

  test("AC-3: extracts nutrition data from an olive oil bottle image", async () => {
    const result = await extractNutrition("oil_bottle_image_data");
    assert.equal(result.name, "Extra Virgin Olive Oil");
    assert.equal(result.brand, "PremiumOil");
    assert.equal(result.servingSize, "100ml");
    assert.equal(result.nutritionPer100g.energyKj, 3404);
    assert.equal(result.nutritionPer100g.energyKcal, 828);
    assert.equal(result.nutritionPer100g.fat, 92);
    assert.equal(result.nutritionPer100g.saturatedFat, 0);
    assert.equal(result.nutritionPer100g.carbohydrates, 0);
    assert.equal(result.nutritionPer100g.sugars, 0);
    assert.equal(result.nutritionPer100g.fiber, 0);
    assert.equal(result.nutritionPer100g.protein, 0);
    assert.equal(result.nutritionPer100g.salt, 0);
  });

  test("AC-4: handles AI API errors gracefully", async () => {
    // Temporarily override fetch to simulate an error
    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: false,
      status: 500,
      json: async () => ({ error: "Internal Server Error" }),
    });

    try {
      await assert.rejects(
        extractNutrition("some_image"),
        /AI API error/
      );
    } finally {
      global.fetch = originalFetch;
    }
  });

  test("AC-5: handles malformed AI response", async () => {
    const originalFetch = global.fetch;
    global.fetch = async () => ({
      ok: true,
      json: async () => ({
        choices: [{ message: { content: "not valid json" } }],
      }),
    });

    try {
      await assert.rejects(
        extractNutrition("some_image"),
        /Failed to parse nutrition data/
      );
    } finally {
      global.fetch = originalFetch;
    }
  });
});