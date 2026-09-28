const STORAGE_KEY = "nutriscan-products";

function getProductsFromStorage() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return [];
    }
  }
  return [];
}

function saveProducts(products) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

export function addProduct(product) {
  const products = getProductsFromStorage();
  products.push(product);
  saveProducts(products);
}

export function getProducts() {
  return getProductsFromStorage();
}

export function deleteProduct(id) {
  const products = getProductsFromStorage();
  const filtered = products.filter(p => p.id !== id);
  saveProducts(filtered);
}