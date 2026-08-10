# 📋 Gestor de Tareas

Aplicación móvil desarrollada con React Native, Expo y TypeScript para organizar tareas personales.

La aplicación permite registrar usuarios, crear, editar y eliminar tareas, asignar prioridades, buscar tareas, filtrarlas y agregar imágenes. También cuenta con almacenamiento local mediante SQLite y sincronización con Firebase.

---

# Nombre de la aplicación

**Gestor de Tareas** — Versión **1.0.0**

---

# Tecnologías utilizadas

- React Native
- Expo
- TypeScript
- Expo Router
- Firebase Authentication
- Cloud Firestore
- SQLite
- Cloudinary
- Expo Image Picker
- NetInfo
- Context API
- Expo Vector Icons

---

# Características

- Registro e inicio de sesión.
- Perfil de usuario.
- Foto de perfil.
- Crear tareas.
- Editar tareas.
- Eliminar tareas.
- Ver detalle de una tarea.
- Prioridad baja, media y alta.
- Búsqueda de tareas por nombre.
- Filtro por prioridad.
- Agregar imágenes a las tareas.
- Tomar fotos con la cámara.
- Seleccionar imágenes de la galería para las tareas.
- Guardado local con SQLite.
- Sincronización con Firestore.
- Detección de conexión a internet.
- Modo claro y modo oscuro.
- Validaciones en los formularios.
- Navegación con Expo Router y Bottom Tabs.

---

# Comandos para ejecutar el proyecto

## 1. Instalar dependencias

```bash
npm install
```

Instala las dependencias necesarias del proyecto.

---

## 2. Ejecutar el proyecto

```bash
npx expo start
```

Inicia el proyecto con Expo.

---

## 3. Ejecutar con Expo Go usando tunnel

```bash
npx expo start --tunnel
```

Esta opción permite conectarse desde Expo Go incluso cuando existen problemas con la red local.

---

## 4. Revisar errores de TypeScript

```bash
npx tsc --noEmit
```

Permite comprobar que el proyecto no tenga errores de TypeScript.

---

# Estructura del proyecto

```text
Gestor-de-tareas-idat
│
├── assets
│
├── src
│   │
│   ├── app
│   │   ├── (tabs)
│   │   │   ├── tasks
│   │   │   └── settings
│   │   ├── login
│   │   ├── register
│   │   └── _layout.tsx
│   │
│   ├── config
│   │   ├── database
│   │   └── firebase
│   │
│   ├── core
│   │   ├── components
│   │   └── contexts
│   │
│   └── modules
│       ├── auth
│       │   ├── data
│       │   └── presentation
│       │
│       └── Tasks
│           ├── data
│           ├── di
│           ├── domain
│           └── presentation
│
├── app.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

# Descripción de la estructura

## app

Contiene las rutas de la aplicación.

Se utiliza Expo Router para manejar la navegación entre el login, registro, tareas, detalle, edición y perfil.

---

## config

Contiene configuraciones generales del proyecto.

### database

Configura SQLite, que se utiliza para guardar las tareas localmente.

### firebase

Contiene la configuración de Firebase utilizada para la autenticación y Firestore.

---

## core

Contiene elementos que se reutilizan en diferentes partes de la aplicación.

### components

Incluye componentes como botones, inputs, fondos y modales.

### contexts

Contiene el contexto utilizado para cambiar entre modo claro y modo oscuro.

---

# Módulo auth

Contiene lo relacionado con las cuentas y el perfil del usuario.

Entre sus funciones se encuentran:

- Registro.
- Inicio de sesión.
- Cierre de sesión.
- Nombre.
- Apellido.
- Género.
- Correo.
- Foto de perfil.

Firebase Authentication se utiliza para manejar las cuentas y Firestore para guardar la información adicional del perfil.

---

# Módulo Tasks

Contiene todo lo relacionado con las tareas.

Está separado en varias carpetas:

### data

Trabaja con la información local y remota.

Aquí se encuentran:

- SQLite.
- Firestore.
- Modelos.
- Repositorios.
- Sincronización.
- Servicio para subir imágenes.

### domain

Contiene la entidad de tarea, los repositorios y los casos de uso.

### presentation

Contiene las pantallas, componentes y hooks utilizados por el usuario.

### di

Contiene las dependencias utilizadas para conectar las diferentes partes del módulo.

---

# Datos de una tarea

Cada tarea puede tener:

- Título.
- Descripción.
- Prioridad.
- Imagen.

Las prioridades disponibles son:

- Baja.
- Media.
- Alta.

---

# Almacenamiento de tareas

La aplicación utiliza SQLite y Firestore.

SQLite se utiliza para guardar las tareas localmente y Firestore para mantenerlas almacenadas en la nube.

Cuando una tarea queda pendiente de sincronización se guarda una acción como:

```text
create
update
delete
```

Al recuperar la conexión, las tareas pendientes pueden sincronizarse con Firestore.

---

# Organización de datos en Firestore

Cada usuario tiene sus propias tareas.

```text
users
└── uid
    └── tasks
        └── taskId
```

De esta forma, las tareas de una cuenta no se mezclan con las de otro usuario.

---

# Manejo de imágenes

Las imágenes se suben a Cloudinary.

En las tareas se puede:

- Tomar una fotografía.
- Elegir una imagen de la galería.

En el perfil se utiliza la cámara para cambiar la foto del usuario.

Después de subir la imagen, su URL se guarda junto con la información correspondiente.

---

# Flujo principal

```text
Registro / Login
       ↓
Firebase Authentication
       ↓
Lista de tareas
       ↓
Crear / Editar / Eliminar
       ↓
SQLite
       ↓
Sincronización
       ↓
Firestore
```

El usuario también puede ingresar a su perfil, cambiar su foto y utilizar el modo oscuro.

---

# Librerías utilizadas

| Librería | Uso |
| --- | --- |
| `react` | Base para trabajar con componentes. |
| `react-native` | Desarrollo de la interfaz móvil. |
| `expo` | Ejecución del proyecto. |
| `typescript` | Tipado del código. |
| `expo-router` | Navegación entre pantallas. |
| `firebase` | Autenticación y Firestore. |
| `expo-sqlite` | Guardado local de tareas. |
| `expo-image-picker` | Cámara y galería. |
| `@react-native-community/netinfo` | Detectar conexión a internet. |
| `@react-native-async-storage/async-storage` | Persistencia utilizada por Firebase. |
| `@expo/vector-icons` | Íconos de la aplicación. |

---

# Funcionalidades implementadas

- ✅ Registro de usuarios.
- ✅ Inicio de sesión.
- ✅ Cierre de sesión.
- ✅ Perfil de usuario.
- ✅ Foto de perfil.
- ✅ Crear tareas.
- ✅ Editar tareas.
- ✅ Eliminar tareas.
- ✅ Ver detalle.
- ✅ Prioridad de tareas.
- ✅ Búsqueda por nombre.
- ✅ Filtro por prioridad.
- ✅ Imágenes en tareas.
- ✅ Cámara.
- ✅ Galería.
- ✅ SQLite.
- ✅ Firebase Authentication.
- ✅ Firestore.
- ✅ Cloudinary.
- ✅ Sincronización de tareas.
- ✅ Modo oscuro.
- ✅ Validaciones.
- ✅ Expo Router.
- ✅ TypeScript.

---

# Control de versiones

El proyecto utiliza Git y GitHub.

Se trabajó con ramas para realizar cambios sin afectar directamente la versión principal.

```text
Rama de trabajo
      ↓
   develop
      ↓
    main
```

---

# Integrantes

- Yrsa Cueto
- Alessander Guillén
- Salvinia Palomino

---

# Versión

**1.0.0**