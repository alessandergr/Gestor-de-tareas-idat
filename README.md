# 📦 CRUD de Productos

Aplicación móvil desarrollada con **React Native** y **Expo** que implementa un sistema de gestión de productos (CRUD: Crear, Leer, Actualizar y Eliminar).

El proyecto fue construido siguiendo los principios de **Clean Architecture**, separando la lógica de negocio, acceso a datos y presentación para lograr un código escalable, mantenible y fácil de probar.

---

# 🚀 Características

- 📋 Listado de productos.
- ➕ Registro de nuevos productos.
- ✏️ Actualización de productos.
- 🗑️ Eliminación de productos.
- 🏛️ Arquitectura basada en Clean Architecture.
- 📦 Inyección de dependencias.
- 🎯 Separación de responsabilidades.
- 📱 Compatible con Android e iOS mediante Expo.

---

# 🏗️ Arquitectura

El proyecto está organizado utilizando **Clean Architecture**, dividiendo la aplicación en capas independientes.

```
Presentation
    │
    ▼
Domain
    │
    ▼
Data
```

## Estructura del proyecto

```text
src
├── app/                    # Configuración principal de la aplicación
├── assets/                 # Recursos estáticos
├── config/                 # Configuraciones globales
├── core/                   # Código compartido
│
├── modules/
│   ├── Auth/
│   ├── Products/
│   │
│   ├── data/
│   │   ├── data-sources/
│   │   ├── dtos/
│   │   ├── models/
│   │   └── repositories/
│   │
│   ├── domain/
│   │   ├── entities/
│   │   ├── repositories/
│   │   └── use-cases/
│   │
│   ├── di/
│   │   └── product.dependencies.ts
│   │
│   └── presentation/
│       ├── components/
│       ├── hooks/
│       └── screens/
│
└── Profile/
```

### Capas

### 📱 Presentation

Contiene toda la interfaz de usuario.

- Screens
- Components
- Hooks
- Estado de la UI

---

### 🧠 Domain

Contiene las reglas de negocio.

- Entities
- Repository Contracts
- Use Cases

Esta capa **no depende de ninguna otra**.

---

### 💾 Data

Responsable del acceso a datos.

- Data Sources
- DTOs
- Models
- Implementaciones de Repositories

---

### 🔌 Dependency Injection

Centraliza la creación e inyección de dependencias para desacoplar las capas de la aplicación.

---

# 🛠️ Tecnologías

- React Native
- Expo
- TypeScript
- Node.js
- pnpm

---

# 📋 Requisitos

| Herramienta | Versión   |
| ----------- | --------- |
| Node.js     | `24.16.0` |
| pnpm        | `10.26.0` |
| Expo        | `54.0.35` |

> Reemplaza las versiones por las que utilizas en tu entorno.

---

# 📥 Clonar el repositorio

```bash
git clone https://github.com/fjosdelacr/react-native-store-app.git

cd react-native-store-app
```

---

# 📦 Instalar dependencias

```bash
pnpm install
```

---

# ▶️ Ejecutar el proyecto

## Iniciar Expo

```bash
pnpm start
```

Luego abre **Expo Go** y escanea el código QR.

---

## Android

Inicia un emulador Android o conecta un dispositivo físico.

```bash
pnpm android
```

---

## iOS

> Requiere macOS y Xcode.

```bash
pnpm ios
```

---

# 📜 Scripts

| Script         | Descripción                       |
| -------------- | --------------------------------- |
| `pnpm start`   | Inicia el servidor de Expo.       |
| `pnpm android` | Ejecuta la aplicación en Android. |
| `pnpm ios`     | Ejecuta la aplicación en iOS.     |

---

# 💡 Principios aplicados

- Clean Architecture
- SOLID
- Separation of Concerns
- Dependency Injection
- Repository Pattern
- Use Case Pattern
- Modular Architecture

---

# 📈 Escalabilidad

La estructura del proyecto permite agregar nuevos módulos siguiendo la misma arquitectura sin afectar el resto de la aplicación.

Ejemplo:

```
modules
├── Products
├── Auth
├── Profile
├── Orders
├── Users
└── Payments
```

Cada módulo mantiene sus propias capas de:

- Data
- Domain
- Presentation
- Dependency Injection

Lo que facilita el mantenimiento y el crecimiento del proyecto.

---

# 👨‍💻 Autor

**Joseph De La Cruz**

GitHub

https://github.com/fjosdelacr

---

# 📄 Licencia

Este proyecto fue desarrollado con fines educativos y como referencia para proyectos construidos con **React Native**, **Expo** y **Clean Architecture**.
