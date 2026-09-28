import { getMeals } from "./meals.js";

const EMPTY_NUTRITION = {
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

export function getDailyTotal(date) {
  const meals = getMeals(date);
  const total = { ...EMPTY_NUTRITION };

  for (const meal of meals) {
    for (const item of meal.items) {
      const productNutrition = item.nutritionPer100g || {};
      const factor = item.grams / 100;

      for (const key of Object.keys(EMPTY_NUTRITION)) {
        const value = productNutrition[key] || 0;
        total[key] += value * factor;
      }
    }
  }

  // Round to avoid floating point issues
  for (const key of Object.keys(total)) {
    total[key] = Math.round(total[key] * 100) / 100;
  }

  return total;
}

export function getWeeklyOverview(startDate) {
  const overview = [];
  const start = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const dateStr = currentDate.toISOString().split("T")[0];

    overview.push({
      date: dateStr,
      total: getDailyTotal(dateStr)
    });
  }

  return overview;
}