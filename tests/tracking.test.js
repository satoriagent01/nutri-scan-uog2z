import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { getDailyTotal, getWeeklyOverview } from "../src/tracking.js";
import { addProduct } from "../src/products.js";
import { createMeal } from "../src/meals.js";

describe("Nutrition Tracking", () => {
  // Helper to setup test products and meals
  const setupTestData = () => {
    // Clear existing products
    const existingProducts = []; // In real implementation, we'd need a way to clear
    
    const rice = {
      id: "tracking-rice",
      name: "Rice",
      brand: "Generic",
      servingSize: "100g",
      nutritionPer100g: {
        energyKj: 1500,
        energyKcal: 359,
        fat: 0.5,
        saturatedFat: 0.1,
        carbohydrates: 78,
        sugars: 0.1,
        fiber: 0.5,
        protein: 7,
        salt: 0.01
      }
    };
    
    const chicken = {
      id: "tracking-chicken",
      name: "Chicken Breast",
      brand: "Fresh",
      servingSize: "100g",
      nutritionPer100g: {
        energyKj: 690,
        energyKcal: 165,
        fat: 3.6,
        saturatedFat: 1,
        carbohydrates: 0,
        sugars: 0,
        fiber: 0,
        protein: 31,
        salt: 0.08
      }
    };
    
    addProduct(rice);
    addProduct(chicken);
    
    return { rice, chicken };
  };

  test("AC-17: calculates daily total nutrition correctly", () => {
    setupTestData();
    
    // Create meals for 2024-01-15
    const meal1 = {
      id: "daily-meal-1",
      name: "Breakfast",
      date: "2024-01-15",
      items: [
        {
          productId: "tracking-rice",
          productName: "Rice",
          grams: 100
        }
      ]
    };
    
    const meal2 = {
      id: "daily-meal-2",
      name: "Lunch",
      date: "2024-01-15",
      items: [
        {
          productId: "tracking-chicken",
          productName: "Chicken Breast",
          grams: 200
        }
      ]
    };
    
    createMeal(meal1);
    createMeal(meal2);
    
    const dailyTotal = getDailyTotal("2024-01-15");
    
    // Rice: 100g -> 359 kcal, 0.5g fat, 0.1g sat fat, 78g carbs, 0.1g sugars, 0.5g fiber, 7g protein, 0.01g salt
    // Chicken: 200g -> 165 * 2 = 330 kcal, 3.6 * 2 = 7.2g fat, 1 * 2 = 2g sat fat, 0g carbs, 0g sugars, 0g fiber, 31 * 2 = 62g protein, 0.08 * 2 = 0.16g salt
    // Total: 689 kcal, 7.7g fat, 2.1g sat fat, 78g carbs, 0.1g sugars, 0.5g fiber, 69g protein, 0.17g salt
    
    assert.equal(dailyTotal.energyKcal, 689);
    assert.equal(dailyTotal.fat, 7.7);
    assert.equal(dailyTotal.saturatedFat, 2.1);
    assert.equal(dailyTotal.carbohydrates, 78);
    assert.equal(dailyTotal.sugars, 0.1);
    assert.equal(dailyTotal.fiber, 0.5);
    assert.equal(dailyTotal.protein, 69);
    assert.equal(dailyTotal.salt, 0.17);
  });

  test("AC-18: returns zero totals for date with no meals", () => {
    setupTestData();
    
    const dailyTotal = getDailyTotal("2024-01-20");
    
    assert.equal(dailyTotal.energyKcal, 0);
    assert.equal(dailyTotal.fat, 0);
    assert.equal(dailyTotal.saturatedFat, 0);
    assert.equal(dailyTotal.carbohydrates, 0);
    assert.equal(dailyTotal.sugars, 0);
    assert.equal(dailyTotal.fiber, 0);
    assert.equal(dailyTotal.protein, 0);
    assert.equal(dailyTotal.salt, 0);
  });

  test("AC-19: calculates weekly overview correctly", () => {
    setupTestData();
    
    // Create meals for different days of the week
    const meal1 = {
      id: "weekly-meal-1",
      name: "Monday Meal",
      date: "2024-01-15", // Monday
      items: [
        {
          productId: "tracking-rice",
          productName: "Rice",
          grams: 100
        }
      ]
    };
    
    const meal2 = {
      id: "weekly-meal-2",
      name: "Tuesday Meal",
      date: "2024-01-16", // Tuesday
      items: [
        {
          productId: "tracking-chicken",
          productName: "Chicken Breast",
          grams: 150
        }
      ]
    };
    
    const meal3 = {
      id: "weekly-meal-3",
      name: "Wednesday Meal",
      date: "2024-01-17", // Wednesday
      items: [
        {
          productId: "tracking-rice",
          productName: "Rice",
          grams: 200
        }
      ]
    };
    
    createMeal(meal1);
    createMeal(meal2);
    createMeal(meal3);
    
    const weeklyOverview = getWeeklyOverview("2024-01-15");
    
    // Should return 7 days starting from 2024-01-15
    assert.equal(weeklyOverview.length, 7);
    
    // Check Monday (2024-01-15)
    const monday = weeklyOverview.find(day => day.date === "2024-01-15");
    assert.ok(monday);
    assert.equal(monday.energyKcal, 359); // 100g rice
    
    // Check Tuesday (2024-01-16)
    const tuesday = weeklyOverview.find(day => day.date === "2024-01-16");
    assert.ok(tuesday);
    // 150g chicken: 165 * 1.5 = 247.5 kcal, 3.6 * 1.5 = 5.4g fat, 1 * 1.5 = 1.5g sat fat, 0g carbs, 0g sugars, 0g fiber, 31 * 1.5 = 46.5g protein, 0.08 * 1.5 = 0.12g salt
    assert.equal(tuesday.energyKcal, 247.5);
    assert.equal(tuesday.fat, 5.4);
    assert.equal(tuesday.protein, 46.5);
    
    // Check Wednesday (2024-01-17)
    const wednesday = weeklyOverview.find(day => day.date === "2024-01-17");
    assert.ok(wednesday);
    // 200g rice: 359 * 2 = 718 kcal, 0.5 * 2 = 1g fat, 0.1 * 2 = 0.2g sat fat, 78 * 2 = 156g carbs, 0.1 * 2 = 0.2g sugars, 0.5 * 2 = 1g fiber, 7 * 2 = 14g protein, 0.01 * 2 = 0.02g salt
    assert.equal(wednesday.energyKcal, 718);
    assert.equal(wednesday.carbohydrates, 156);
    assert.equal(wednesday.protein, 14);
    
    // Check Thursday (2024-01-18) - no meals
    const thursday = weeklyOverview.find(day => day.date === "2024-01-18");
    assert.ok(thursday);
    assert.equal(thursday.energyKcal, 0);
  });

  test("AC-20: weekly overview handles empty week", () => {
    setupTestData();
    
    const weeklyOverview = getWeeklyOverview("2024-01-20");
    
    assert.equal(weeklyOverview.length, 7);
    weeklyOverview.forEach(day => {
      assert.equal(day.energyKcal, 0);
      assert.equal(day.fat, 0);
      assert.equal(day.protein, 0);
    });
  });

  test("AC-21: daily total handles multiple meals on same day", () => {
    setupTestData();
    
    // Create multiple meals for the same day
    const meal1 = {
      id: "multi-meal-1",
      name: "Breakfast",
      date: "2024-01-20",
      items: [
        {
          productId: "tracking-rice",
          productName: "Rice",
          grams: 50
        }
      ]
    };
    
    const meal2 = {
      id: "multi-meal-2",
      name: "Lunch",
      date: "2024-01-20",
      items: [
        {
          productId: "tracking-chicken",
          productName: "Chicken Breast",
          grams: 100
        }
      ]
    };
    
    const meal3 = {
      id: "multi-meal-3",
      name: "Dinner",
      date: "2024-01-20",
      items: [
        {
          productId: "tracking-rice",
          productName: "Rice",
          grams: 150
        }
      ]
    };
    
    createMeal(meal1);
    createMeal(meal2);
    createMeal(meal3);
    
    const dailyTotal = getDailyTotal("2024-01-20");
    
    // Rice 50g: 359 * 0.5 = 179.5 kcal, 0.5 * 0.5 = 0.25g fat, 0.1 * 0.5 = 0.05g sat fat, 78 * 0.5 = 39g carbs, 0.1 * 0.5 = 0.05g sugars, 0.5 * 0.5 = 0.25g fiber, 7 * 0.5 = 3.5g protein, 0.01 * 0.5 = 0.005g salt
    // Chicken 100g: 165 kcal, 3.6g fat, 1g sat fat, 0g carbs, 0g sugars, 0g fiber, 31g protein, 0.08g salt
    // Rice 150g: 359 * 1.5 = 538.5 kcal, 0.5 * 1.5 = 0.75g fat, 0.1 * 1.5 = 0.15g sat fat, 78 * 1.5 = 117g carbs, 0.1 * 1.5 = 0.15g sugars, 0.5 * 1.5 = 0.75g fiber, 7 * 1.5 = 10.5g protein, 0.01 * 1.5 = 0.015g salt
    // Total: 179.5 + 165 + 538.5 = 883 kcal, 0.25 + 3.6 + 0.75 = 4.6g fat, 0.05 + 1 + 0.15 = 1.2g sat fat, 39 + 0 + 117 = 156g carbs, 0.05 + 0 + 0.15 = 0.2g sugars, 0.25 + 0 + 0.75 = 1g fiber, 3.5 + 31 + 10.5 = 45g protein, 0.005 + 0.08 + 0.015 = 0.1g salt
    
    assert.equal(dailyTotal.energyKcal, 883);
    assert.equal(dailyTotal.fat, 4.6);
    assert.equal(dailyTotal.saturatedFat, 1.2);
    assert.equal(dailyTotal.carbohydrates, 156);
    assert.equal(dailyTotal.sugars, 0.2);
    assert.equal(dailyTotal.fiber, 1);
    assert.equal(dailyTotal.protein, 45);
    assert.equal(dailyTotal.salt, 0.1);
  });
});