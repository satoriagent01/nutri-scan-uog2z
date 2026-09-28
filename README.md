# NutriScan 🥗

Una aplicación web gratuita y sin anuncios para rastrear la nutrición escaneando fotos de etiquetas de productos del supermercado.

## Características

- **Escaneo de etiquetas**: Toma fotos de las tablas nutricionales y extrae los datos automáticamente usando IA
- **Biblioteca de productos**: Guarda productos escaneados o agrégalos manualmente
- **Planificador de comidas**: Crea comidas personalizadas agregando productos con cantidades específicas en gramos
- **Seguimiento nutricional**: Visualiza tu ingesta diaria y semanal de calorías, grasas, carbohidratos, proteínas, etc.
- **Privacidad**: Todos los datos se almacenan localmente en tu navegador (localStorage)
- **Sin anuncios**: Totalmente gratis, sin publicidad

## Stack Tecnológico

- **Frontend**: React 18 (cargado vía CDN)
- **Backend**: Node.js (ES Modules)
- **OCR/IA**: Endpoint OpenAI-compatible (configurable)
- **Almacenamiento**: localStorage
- **Testing**: Node.js test runner (`node --test`)

## Instalación

No se requiere build step ni dependencias externas para el frontend.

```bash
# Clonar el repositorio
git clone https://github.com/s55cf475d/nutri-scan-uog2z.git
cd nutri-scan-uog2z

# Abrir public/index.html en un navegador
# O usar un servidor local simple:
npx serve public
```

## Configuración del Endpoint de IA

NutriScan necesita un endpoint de IA compatible con OpenAI para extraer datos nutricionales de las fotos.

1. Abre la sección "⚙️ Configuración" en la app
2. Ingresa la URL de tu endpoint OpenAI-compatible (ej: `https://api.openai.com/v1`)
3. Ingresa tu API Key
4. Guarda la configuración

### Endpoints compatibles

- **OpenAI**: `https://api.openai.com/v1` (requiere API key de OpenAI)
- **Azure OpenAI**: Tu endpoint de Azure
- **Otras APIs compatibles**: Cualquier servicio que implemente la API de Chat Completions de OpenAI

## Cómo usar

### 1. Escanear una etiqueta

1. Ve a la pestaña "📸 Escanear"
2. Toca el área de carga para tomar una foto o seleccionar una imagen
3. Toca "🔍 Extraer Datos" para procesar la imagen con IA
4. Revisa los datos extraídos y toca "💾 Guardar Producto"

### 2. Agregar productos manualmente

1. Ve a la pestaña "📦 Productos"
2. Toca "+ Agregar"
3. Completa los campos del producto
4. Toca "Guardar Producto"

### 3. Crear una comida

1. Ve a la pestaña "🍽️ Comidas"
2. Selecciona la fecha
3. Toca "+ Nueva"
4. Ingresa el nombre de la comida
5. Selecciona productos de tu biblioteca y especifica la cantidad en gramos
6. Toca "Guardar Comida"

### 4. Ver seguimiento

1. Ve a la pestaña "📊 Seguimiento"
2. Selecciona "Diario" o "Semanal"
3. Elige la fecha para ver los totales nutricionales

## Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests con watch mode
node --test --watch
```

## Estructura del proyecto

```
nutri-scan-uog2z/
├── public/
│   └── index.html          # UI React principal
├── src/
│   ├── config.js            # Configuración del endpoint de IA
│   ├── products.js          # Gestión de productos (localStorage)
│   ├── meals.js             # Planificación de comidas
│   ├── tracking.js          # Seguimiento nutricional
│   └── ocr.js               # Extracción OCR con IA
├── tests/
│   ├── config.test.js       # Tests de configuración
│   ├── products.test.js     # Tests de productos
│   ├── meals.test.js        # Tests de comidas
│   ├── tracking.test.js     # Tests de seguimiento
│   └── ocr.test.js          # Tests de OCR
├── docs/
│   └── SPEC.md              # Especificación del producto
├── package.json
└── README.md
```

## Módulos

### `src/config.js`
Gestiona la configuración del endpoint de IA (URL y API key) usando localStorage.

### `src/products.js`
CRUD de productos: agregar, listar y eliminar productos del usuario.

### `src/meals.js`
Planificación de comidas: crear comidas con productos y cantidades personalizadas, calcular nutrición total.

### `src/tracking.js`
Seguimiento nutricional: totales diarios y resúmenes semanales.

### `src/ocr.js`
Extracción de datos nutricionales de imágenes usando un endpoint OpenAI-compatible.

## Lo que no está implementado aún

- Escaneo de códigos de barras
- Sincronización en la nube
- Exportación de datos
- Temas oscuros
- Notificaciones
- Base de datos de productos pre-cargada

## Licencia

MIT - Gratis y sin anuncios para siempre.