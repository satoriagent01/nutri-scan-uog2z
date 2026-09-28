import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { createMeal, getMeals, calculateMealNutrition } from "../src/meals.js";
import { addProduct, deleteProduct } from "../src/products.js";

describe("Meal Planning", () => {
  // Helper to setup test products
  const setupTestProducts = () => {
    // Clear existing products
    const existingProducts = []; // In real implementation, we'd need a way to clear
    // For testing, we'll create fresh products
    
    const product1 = {
      id: "meal-test-1",
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
    
    const product2 = {
      id: "meal-test-2",
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
    
    addProduct(product1);
    addProduct(product2);
    
    return { product1, product2 };
  };

  test("AC-11: creates a meal with products", () => {
    setupTestProducts();
    
    const meal = {
      id: "meal-1",
      name: "Healthy Dinner",
      date: "2024-01-15",
      items: [
        {
          productId: "meal-test-1",
          productName: "Rice",
          grams: 200
        },
        {
          productId: "meal-test-2",
          productName: "Chicken Breast",
          grams: 150
        }
      ]
    };
    
    createMeal(meal);
    const meals = getMeals("2024-01-15");
    assert.equal(meals.length, 1);
    assert.equal(meals[0].name, "Healthy Dinner");
    assert.equal(meals[0].items.length, 2);
  });

  test("AC-12: retrieves meals by date", () => {
    setupTestProducts();
    
    const meal1 = {
      id: "meal-2",
      name: "Breakfast",
      date: "2024-01-15",
      items: [
        {
          productId: "meal-test-1",
          productName: "Rice",
          grams: 100
        }
      ]
    };
    
    const meal2 = {
      id: "meal-3",
      name: "Lunch",
      date: "2024-01-15",
      items: [
        {
          productId: "meal-test-2",
          productName: "Chicken Breast",
          grams: 200
        }
      ]
    };
    
    const meal3 = {
      id: "meal-4",
      name: "Dinner",
      date: "2024-01-16",
      items: [
        {
          productId: "meal-test-1",
          productName: "Rice",
          grams: 150
        }
      ]
    };
    
    createMeal(meal1);
    createMeal(meal2);
    createMeal(meal3);
    
    const meals15 = getMeals("2024-01-15");
    assert.equal(meals15.length, 2);
    
    const meals16 = getMeals("2024-01-16");
    assert.equal(meals16.length, 1);
  });

  test("AC-13: calculates meal nutrition correctly", () => {
    setupTestProducts();
    
    const meal = {
      id: "meal-5",
      name: "Calorie Test Meal",
      date: "2024-01-15",
      items: [
        {
          productId: "meal-test-1",
          productName: "Rice",
          grams: 100
        },
        {
          productId: "meal-test-2",
          productName: "Chicken Breast",
          grams: 100
        }
      ]
    };
    
    const nutrition = calculateMealNutrition(meal);
    
    // Rice: 100g -> 359 kcal, 0.5g fat, 0.1g sat fat, 78g carbs, 0.1g sugars, 0.5g fiber, 7g protein, 0.01g salt
    // Chicken: 100g -> 165 kcal, 3.6g fat, 1g sat fat, 0g carbs, 0g sugars, 0g fiber, 31g protein, 0.08g salt
    // Total: 524 kcal, 4.1g fat, 1.1g sat fat, 78g carbs, 0.1g sugars, 0.5g fiber, 38g protein, 0.09g salt
    
    assert.equal(nutrition.energyKcal, 524);
    assert.equal(nutrition.fat, 4.1);
    assert.equal(nutrition.saturatedFat, 1.1);
    assert.equal(nutrition.carbohydrates, 78);
    assert.equal(nutrition.sugars, 0.1);
    assert.equal(nutrition.fiber, 0.5);
    assert.equal(nutrition.protein, 38);
    assert.equal(nutrition.salt, 0.09);
  });

  test("AC-14: handles meal with single product", () => {
    setupTestProducts();
    
    const meal = {
      id: "meal-6",
      name: "Simple Meal",
      date: "2024-01-15",
      items: [
        {
          productId: "meal-test-1",
          productName: "Rice",
          grams: 250
        }
      ]
    };
    
    const nutrition = calculateMealNutrition(meal);
    
    // Rice: 250g -> 359 * 2.5 = 897.5 kcal, 0.5 * 2.5 = 1.25g fat, etc.
    assert.equal(nutrition.energyKcal, 897.5);
    assert.equal(nutrition.fat, 1.25);
    assert.equal(nutrition.carbohydrates, 195);
    assert.equal(nutrition.protein, 17.5);
  });

  test("AC-15: handles meal with zero grams", () => {
    setupTestProducts();
    
    const meal = {
      id: "meal-7",
      name: "Zero Meal",
      date: "2024-01-15",
      items: [
        {
          productId: "meal-test-1",
          productName: "Rice",
          grams: 0
        }
      ]
    };
    
    const nutrition = calculateMealNutrition(meal);
    
    // All values should be zero
    assert.equal(nutrition.energyKcal, 0);
    assert.equal(nutrition.fat, 0);
    assert.equal(nutrition.carbohydrates, 0);
    assert.equal(nutrition.protein, 0);
  });

  test("AC-16: retrieves all meals without date filter", () => {
    setupTestProducts();
    
    const meal1 = {
      id: "meal-8",
      name: "Meal 1",
      date: "2024-01-15",
      items: []
    };
    
    const meal2 = {
      id: "meal-9",
      name: "Meal 2",
      date: "2024-01-16",
      items: []
    };
    
    createMeal(meal1);
    createMeal(meal2);
    
    const allMeals = getMeals();
    assert.equal(allMeals.length, 2);
  });
});