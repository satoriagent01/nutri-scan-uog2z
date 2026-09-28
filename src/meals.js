const meals = [];

export function createMeal(meal) {
  meals.push(meal);
}

export function getMeals(date) {
  if (date) {
    return meals.filter(m => m.date === date);
  }
  return [...meals];
}

export function calculateMealNutrition(meal) {
  const total = {
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
    const product = getProducts().find(p => p.id === item.productId);
    if (product && product.nutritionPer100g) {
      const factor = item.grams / 100;
      const n = product.nutritionPer100g;
      total.energyKj += (n.energyKj || 0) * factor;
      total.energyKcal += (n.energyKcal || 0) * factor;
      total.fat += (n.fat || 0) * factor;
      total.saturatedFat += (n.saturatedFat || 0) * factor;
      total.carbohydrates += (n.carbohydrates || 0) * factor;
      total.sugars += (n.sugars || 0) * factor;
      total.fiber += (n.fiber || 0) * factor;
      total.protein += (n.protein || 0) * factor;
      total.salt += (n.salt || 0) * factor;
    }
  }

  return total;
}