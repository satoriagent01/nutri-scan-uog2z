const MEALS_STORAGE_KEY = "nutriscan-meals";

function getMealsFromStorage() {
  const stored = localStorage.getItem(MEALS_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

function saveMeals(meals) {
  localStorage.setItem(MEALS_STORAGE_KEY, JSON.stringify(meals));
}

export function createMeal(meal) {
  const meals = getMealsFromStorage();
  meals.push(meal);
  saveMeals(meals);
}

export function getMeals(date) {
  const meals = getMealsFromStorage();
  if (date) {
    return meals.filter(m => m.date === date);
  }
  return meals;
}

export function calculateMealNutrition(meal) {
  const products = JSON.parse(localStorage.getItem("nutriscan-products") || "[]");
  let total = {
    energyKj: 0,
    energyKcal: 0,
    fat: 0,
    saturatedFat: 0,
    carbohydrates: 0,
    sugars: 0,
    fiber: 0,
    protein: 0,
    salt: 0
  };

  for (const item of meal.items) {
    const product = products.find(p => p.id === item.productId);
    if (product && product.nutritionPer100g) {
      const nutrition = product.nutritionPer100g;
      const factor = item.grams / 100;
      total.energyKj += (nutrition.energyKj || 0) * factor;
      total.energyKcal += (nutrition.energyKcal || 0) * factor;
      total.fat += (nutrition.fat || 0) * factor;
      total.saturatedFat += (nutrition.saturatedFat || 0) * factor;
      total.carbohydrates += (nutrition.carbohydrates || 0) * factor;
      total.sugars += (nutrition.sugars || 0) * factor;
      total.fiber += (nutrition.fiber || 0) * factor;
      total.protein += (nutrition.protein || 0) * factor;
      total.salt += (nutrition.salt || 0) * factor;
    }
  }

  // Round to avoid floating point issues
  total.energyKj = Math.round(total.energyKj * 100) / 100;
  total.energyKcal = Math.round(total.energyKcal * 100) / 100;
  total.fat = Math.round(total.fat * 100) / 100;
  total.saturatedFat = Math.round(total.saturatedFat * 100) / 100;
  total.carbohydrates = Math.round(total.carbohydrates * 100) / 100;
  total.sugars = Math.round(total.sugars * 100) / 100;
  total.fiber = Math.round(total.fiber * 100) / 100;
  total.protein = Math.round(total.protein * 100) / 100;
  total.salt = Math.round(total.salt * 100) / 100;

  return total;
}