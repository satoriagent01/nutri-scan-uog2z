import { getMeals, calculateMealNutrition } from "./meals.js";

export function getDailyTotal(date) {
  const meals = getMeals(date);
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

  for (const meal of meals) {
    const mealNutrition = calculateMealNutrition(meal);
    total.energyKj += mealNutrition.energyKj;
    total.energyKcal += mealNutrition.energyKcal;
    total.fat += mealNutrition.fat;
    total.saturatedFat += mealNutrition.saturatedFat;
    total.carbohydrates += mealNutrition.carbohydrates;
    total.sugars += mealNutrition.sugars;
    total.fiber += mealNutrition.fiber;
    total.protein += mealNutrition.protein;
    total.salt += mealNutrition.salt;
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

export function getWeeklyOverview(startDate) {
  const days = [];
  const start = new Date(startDate);

  for (let i = 0; i < 7; i++) {
    const currentDate = new Date(start);
    currentDate.setDate(start.getDate() + i);
    const dateStr = currentDate.toISOString().split("T")[0];
    const dailyTotal = getDailyTotal(dateStr);
    days.push({
      date: dateStr,
      ...dailyTotal
    });
  }

  return days;
}