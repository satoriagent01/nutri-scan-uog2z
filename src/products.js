const products = [];

export function addProduct(product) {
  products.push({ ...product });
}

export function getProducts() {
  return [...products];
}

export function deleteProduct(id) {
  const index = products.findIndex(p => p.id === id);
  if (index !== -1) {
    products.splice(index, 1);
  }
}