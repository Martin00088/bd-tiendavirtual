![db](https://github.com/user-attachments/assets/dd694074-4ed8-4f47-b12d-725f1cf14b58)

# 📦 E-Commerce Database Schema (Prisma + PostgreSQL)

Este proyecto define la estructura de la base de datos para un sistema de comercio electrónico utilizando **Prisma** con **PostgreSQL**. Incluye gestión de usuarios, productos, pedidos, pagos y carritos de compra.

## 📌 Tecnologías Utilizadas

- **Prisma ORM**
- **PostgreSQL**
- **TypeScript (Opcional para API)**
- **Node.js**

## 📂 Modelos y Relaciones

### 🔐 Autenticación y Verificación

- **VerificationRequest**: Maneja las solicitudes de verificación con identificadores únicos y tokens.

### 👤 Usuarios y Relacionados

- **User**: Contiene la información del usuario (nombre, correo, rol, etc.).
- **Address**: Dirección del usuario, relación **uno a uno** con `User`.
- **Payment**: Registra los pagos efectuados por los usuarios.

### 🛒 Carrito de Compras

- **Cart**: Relacionado con `User`, contiene productos en el carrito.
- **CartItem**: Elemento dentro del carrito, vinculado a una `ProductVariation`.

### 🏷️ Catálogo de Productos

- **Category** y **SubCategory**: Organizan los productos en categorías y subcategorías.
- **Product**: Representa un producto dentro de una subcategoría.
- **ProductVariation**: Variante de un producto (ejemplo: talla, color, precio, stock).
- **ProductVariationSizeStock**: Define el stock por talla para cada variación de producto.
- **Image**: Almacena imágenes de las variaciones de productos.

### 📦 Pedidos y Compras

- **Order**: Representa un pedido realizado por el usuario.
- **Order\_Item**: Elementos comprados en una orden, vinculados a `ProductVariation`.

## 🔄 Relaciones Claves

- `User` tiene **una** `Address`, **un** `Cart` y **muchos** `Order` y `Payment`.
- `Cart` contiene **muchos** `CartItem`.
- `Product` pertenece a una `SubCategory` y tiene **múltiples** `ProductVariation`.
- `Order` tiene **muchos** `Order_Item`.


