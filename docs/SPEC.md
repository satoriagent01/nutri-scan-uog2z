# NutriScan - Especificación del Producto

## Visión General
NutriScan es una aplicación web gratuita y sin anuncios que permite a los usuarios escanear fotos de las tablas nutricionales de los productos del supermercado, extraer la información nutricional mediante OCR con IA, y planificar/combinar comidas personalizadas para hacer seguimiento de su ingesta nutricional.

## Stack Tecnológico
- **Frontend**: Node 24 con ES modules, React (vía CDN o import), HTML estático en `public/`
- **Testing**: `node --test` (runner nativo de Node)
- **OCR/IA**: Módulo que llama a un endpoint OpenAI-compatible (configurable por el usuario con URL y API key)
- **Almacenamiento**: localStorage para datos del usuario (privacidad)
- **Sin build step**: Todo se ejecuta directamente con Node

## Módulos y Funciones

### `src/ocr.js` - Extracción de datos nutricionales mediante IA
- **`extractNutrition(imageData: string) => Promise<NutritionData>`**
  - Recibe una imagen en base64 o URL, llama al endpoint de IA para extraer la tabla nutricional.
  - Retorna un objeto con los datos nutricionales extraídos.
  - Ejemplo de entrada: imagen base64 de la foto 1.jpg
  - Ejemplo de salida:
    ```javascript
    {
      energy: { kJ: 2292, kcal: 549 },
      fat: 33,
      saturatedFat: 13,
      carbohydrates: 55,
      sugars: 45,
      fiber: 2.4,
      protein: 6.8,
      salt: 0.18,
      servingSize: "30 g",
      productName: "Barra de chocolate sin gluten"
    }
    ```

### `src/products.js` - Gestión de productos
- **`addProduct(product: Product) => void`**
  - Agrega un producto a la biblioteca del usuario (localStorage).
  - Ejemplo de entrada:
    ```javascript
    {
      id: "prod-001",
      name: "Barra de chocolate sin gluten",
      brand: "Dr. Schär AG",
      servingSize: "30 g",
      nutritionPer100g: {
        energy: { kJ: 2292, kcal: 549 },
        fat: 33,
        saturatedFat: 13,
        carbohydrates: 55,
        sugars: 45,
        fiber: 2.4,
        protein: 6.8,
        salt: 0.18
      }
    }
    ```
- **`getProducts() => Product[]`**
  - Retorna todos los productos almacenados.
- **`deleteProduct(id: string) => void`**
  - Elimina un producto de la biblioteca.

### `src/meals.js` - Planificación de comidas
- **`createMeal(meal: Meal) => void`**
  - Crea una nueva comida con productos y cantidades personalizadas.
  - Ejemplo de entrada:
    ```javascript
    {
      id: "meal-001",
      name: "Desayuno",
      date: "2024-01-15",
      items: [
        { productId: "prod-001", grams: 60 },
        { productId: "prod-002", grams: 200 }
      ]
    }
    ```
- **`getMeals(date?: string) => Meal[]`**
  - Retorna las comidas, opcionalmente filtradas por fecha.
- **`calculateMealNutrition(meal: Meal) => NutritionTotal`**
  - Calcula el total nutricional de una comida basado en los gramos de cada producto.
  - Ejemplo de salida:
    ```javascript
    {
      energy: { kJ: 4584, kcal: 1098 },
      fat: 66,
      saturatedFat: 26,
      carbohydrates: 110,
      sugars: 90,
      fiber: 4.8,
      protein: 13.6,
      salt: 0.36
    }
    ```

### `src/tracking.js` - Seguimiento nutricional
- **`getDailyTotal(date: string) => NutritionTotal`**
  - Retorna el total nutricional diario sumando todas las comidas del día.
  - Ejemplo de salida:
    ```javascript
    {
      energy: { kJ: 8500, kcal: 2033 },
      fat: 120,
      saturatedFat: 45,
      carbohydrates: 250,
      sugars: 80,
      fiber: 15,
      protein: 90,
      salt: 2.5
    }
    ```
- **`getWeeklyOverview(startDate: string) => DailyTotals[]`**
  - Retorna un resumen semanal de la ingesta nutricional.

### `src/config.js` - Configuración del usuario
- **`setAIConfig(url: string, apiKey: string) => void`**
  - Configura el endpoint de IA y la clave API.
- **`getAIConfig() => { url: string, apiKey: string }`**
  - Retorna la configuración actual de IA.

## Criterios de Aceptación

### AC-1: Escaneo de fotos de etiquetas nutricionales
- El usuario puede tomar o subir una foto de una tabla nutricional.
- La app extrae correctamente los datos de energía, grasas, carbohidratos, azúcares, fibra, proteína y sal.
- Ejemplo: La foto 1.jpg (barra de chocolate Dr. Schär) debe extraer: 2292 kJ / 549 kcal por 100g, 33g de grasa, 55g de carbohidratos, 45g de azúcares, 2.4g de fibra, 6.8g de proteína, 0.18g de sal.

### AC-2: Extracción multilingüe
- La app puede procesar tablas nutricionales en diferentes idiomas (alemán, francés, italiano, neerlandés, español, inglés).
- Ejemplo: La foto 2.jpg (zumo de manzana-naranja-mango) tiene tabla en neerlandés: "Voedingswaarde per 100 ml" con 199 kJ / 47 kcal.

### AC-3: Biblioteca de productos
- Los productos escaneados se almacenan en la biblioteca del usuario.
- Cada producto tiene: nombre, marca, tamaño de porción, y datos nutricionales por 100g y por porción.
- El usuario puede ver, editar y eliminar productos de su biblioteca.

### AC-4: Planificación de comidas personalizada
- El usuario puede crear comidas agregando productos con cantidades personalizadas en gramos.
- La app calcula automáticamente el total nutricional basado en los gramos de cada producto.
- Ejemplo: Si un producto tiene 549 kcal por 100g y el usuario agrega 60g, la app calcula 329.4 kcal.

### AC-5: Seguimiento nutricional
- El usuario puede ver el total nutricional diario y semanal.
- Se pueden rastrear calorías, sodio, grasas saturadas, y cualquier otro nutriente de la tabla.
- Ejemplo: El seguimiento diario suma todas las comidas del día y muestra el total.

### AC-6: Interfaz de usuario
- La app es una página web estática en `public/`.
- Diseño mobile-first, simple y limpio.
- Funciona en móvil y escritorio.

### AC-7: Privacidad y almacenamiento local
- Todos los datos se almacenan en localStorage.
- No se envían datos personales a servidores externos (excepto la imagen al endpoint de IA configurado por el usuario).

### AC-8: Configuración de IA
- El usuario puede configurar su propio endpoint OpenAI-compatible (URL y API key).
- La app no llama a ningún servicio de IA por defecto; el usuario debe proporcionar sus propias credenciales.

### AC-9: Entrada manual de productos
- Además del escaneo, el usuario puede agregar productos manualmente.
- El formulario manual incluye todos los campos nutricionales.

### AC-10: Gratis y sin anuncios
- La app es completamente gratuita.
- No contiene anuncios ni elementos publicitarios.

## Ejemplos de las Imágenes Compartidas

### Foto 1.jpg - Barra de chocolate sin gluten (Dr. Schär)
- **Idiomas**: Alemán, francés, neerlandés, italiano
- **Tabla nutricional por 100g**:
  - Energía: 2292 kJ / 549 kcal
  - Grasas: 33g (de las cuales saturadas: 13g)
  - Carbohidratos: 55g (de los cuales azúcares: 45g)
  - Fibra: 2.4g
  - Proteína: 6.8g
  - Sal: 0.18g
- **Porción**: 30g (1 Melto)
- **Por porción (30g)**: 688 kJ / 165 kcal, 10g grasa, 3.9g saturadas, 16g carbohidratos, 14g azúcares, 0.7g fibra, 2.0g proteína, 0.05g sal
- **Ingredientes**: pasta de nueces 57%, leche en polvo, cacao en polvo, etc.
- **Alérgenos**: nueces, leche, soja

### Foto 2.jpg - Zumo de manzana-naranja-mango
- **Idioma**: Neerlandés
- **Tabla nutricional por 100ml**:
  - Energía: 199 kJ / 47 kcal
  - Grasas: 0g
  - Carbohidratos: 11g (de los cuales azúcares: 10g)
  - Proteína: 0.7g
  - Sal: 0.4g
- **Porción**: 200ml (1 vaso)
- **Por vaso (200ml)**: 399 kJ / 94 kcal, 22g carbohidratos, 20g azúcares
- **Ingredientes**: 45% manzana, 35% naranja, 20% mango
- **Vitamina C**: 26% de la referencia diaria por 100ml

### Foto 3.jpg - Aceite de oliva en spray
- **Idioma**: Neerlandés
- **Tabla nutricional por 100ml**:
  - Energía: 3404 kJ / 828 kcal
  - Grasas: 92g (de las cuales saturadas: 14g)
  - Carbohidratos: 0g (de los cuales azúcares: 0g)
  - Proteína: 0g
  - Sal: 0g
  - Vitamina E: 150% de la referencia diaria
- **Contenido**: 200ml
- **Ingredientes**: aceite de oliva extra virgen

## Estructura del Repositorio

```
nutri-scan-uog2z/
├── docs/
│   └── SPEC.md
├── public/
│   ├── index.html
│   ├── style.css
│   └── app.js
├── src/
│   ├── ocr.js
│   ├── products.js
│   ├── meals.js
│   ├── tracking.js
│   └── config.js
└── tests/
    ├── ocr.test.js
    ├── products.test.js
    ├── meals.test.js
    └── tracking.test.js
```