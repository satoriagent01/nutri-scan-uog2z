import { test, describe } from "node:test";
import assert from "node:assert/strict";
import { addProduct, getProducts, deleteProduct } from "../src/products.js";

describe("Product Library Management", () => {
  test("AC-6: adds a product to the library", () => {
    const product = {
      id: "test-1",
      name: "Test Product",
      brand: "TestBrand",
      servingSize: "100g",
      nutritionPer100g: {
        energyKj: 1000,
        energyKcal: 239,
        fat: 10,
        saturatedFat: 5,
        carbohydrates: 20,
        sugars: 10,
        fiber: 2,
        protein: 5,
        salt: 0.5
      }
    };
    
    addProduct(product);
    const products = getProducts();
    assert.equal(products.length, 1);
    assert.equal(products[0].name, "Test Product");
    assert.equal(products[0].brand, "TestBrand");
  });

  test("AC-7: retrieves all products from the library", () => {
    // Clear any existing products first
    const existingProducts = getProducts();
    existingProducts.forEach(p => deleteProduct(p.id));
    
    const product1 = {
      id: "test-2",
      name: "Product 1",
      brand: "Brand1",
      servingSize: "50g",
      nutritionPer100g: {
        energyKj: 500,
        energyKcal: 119,
        fat: 5,
        saturatedFat: 2,
        carbohydrates: 10,
        sugars: 5,
        fiber: 1,
        protein: 2,
        salt: 0.2
      }
    };
    
    const product2 = {
      id: "test-3",
      name: "Product 2",
      brand: "Brand2",
      servingSize: "200g",
      nutritionPer100g: {
        energyKj: 800,
        energyKcal: 191,
        fat: 8,
        saturatedFat: 3,
        carbohydrates: 15,
        sugars: 8,
        fiber: 1.5,
        protein: 3,
        salt: 0.3
      }
    };
    
    addProduct(product1);
    addProduct(product2);
    
    const products = getProducts();
    assert.equal(products.length, 2);
    assert.ok(products.some(p => p.name === "Product 1"));
    assert.ok(products.some(p => p.name === "Product 2"));
  });

  test("AC-8: deletes a product from the library", () => {
    // Clear any existing products first
    const existingProducts = getProducts();
    existingProducts.forEach(p => deleteProduct(p.id));
    
    const product = {
      id: "test-4",
      name: "Product to Delete",
      brand: "Brand3",
      servingSize: "150g",
      nutritionPer100g: {
        energyKj: 600,
        energyKcal: 143,
        fat: 6,
        saturatedFat: 2.5,
        carbohydrates: 12,
        sugars: 6,
        fiber: 1.2,
        protein: 2.5,
        salt: 0.25
      }
    };
    
    addProduct(product);
    assert.equal(getProducts().length, 1);
    
    deleteProduct("test-4");
    assert.equal(getProducts().length, 0);
  });

  test("AC-9: handles product with missing optional fields", () => {
    const minimalProduct = {
      id: "test-5",
      name: "Minimal Product",
      servingSize: "100g",
      nutritionPer100g: {
        energyKj: 400,
        energyKcal: 96,
        fat: 4,
        saturatedFat: 1,
        carbohydrates: 8,
        sugars: 4,
        fiber: 0.8,
        protein: 1.6,
        salt: 0.16
      }
    };
    
    addProduct(minimalProduct);
    const products = getProducts();
    assert.equal(products.length, 1);
    assert.equal(products[0].name, "Minimal Product");
    assert.equal(products[0].brand, ""); // Should default to empty string
  });

  test("AC-10: product ID is unique and preserved", () => {
    // Clear any existing products first
    const existingProducts = getProducts();
    existingProducts.forEach(p => deleteProduct(p.id));
    
    const product = {
      id: "unique-id-123",
      name: "Unique Product",
      brand: "UniqueBrand",
      servingSize: "75g",
      nutritionPer100g: {
        energyKj: 700,
        energyKcal: 167,
        fat: 7,
        saturatedFat: 3,
        carbohydrates: 14,
        sugars: 7,
        fiber: 1.4,
        protein: 2.8,
        salt: 0.28
      }
    };
    
    addProduct(product);
    const products = getProducts();
    assert.equal(products[0].id, "unique-id-123");
    
    // Try to add another product with same ID (should update or handle appropriately)
    const updatedProduct = {
      id: "unique-id-123",
      name: "Updated Product",
      brand: "UpdatedBrand",
      servingSize: "80g",
      nutritionPer100g: {
        energyKj: 750,
        energyKcal: 179,
        fat: 7.5,
        saturatedFat: 3.2,
        carbohydrates: 15,
        sugars: 7.5,
        fiber: 1.5,
        protein: 3,
        salt: 0.3
      }
    };
    
    addProduct(updatedProduct);
    const updatedProducts = getProducts();
    assert.equal(updatedProducts.length, 1);
    assert.equal(updatedProducts[0].name, "Updated Product");
  });
});