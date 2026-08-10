# 📋 Gestor de Tareas

Aplicación móvil desarrollada con React Native, Expo y TypeScript para organizar tareas personales.

La aplicación permite registrar usuarios, crear, editar y eliminar tareas, asignar prioridades, buscar tareas, filtrarlas, agregar imágenes y seleccionar una categoría obtenida desde una API REST.

También cuenta con almacenamiento local mediante SQLite y sincronización de tareas con Firebase Firestore.

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
- API REST
- Expo Image Picker
- NetInfo
- Context API
- Expo Vector Icons
- EAS Build

---

# Características

- Registro e inicio de sesión.
- Cierre de sesión.
- Acceso solo para usuarios autenticados.
- Perfil de usuario.
- Nombre, apellido y género.
- Foto de perfil.
- Crear tareas.
- Editar tareas.
- Eliminar tareas.
- Ver detalle de una tarea.
- Prioridad baja, media y alta.
- Categorías obtenidas mediante API REST.
- Búsqueda de tareas por nombre.
- Filtro por prioridad.
- Agregar imágenes a las tareas.
- Tomar fotografías.
- Seleccionar imágenes de la galería para las tareas.
- Guardado local con SQLite.
- Sincronización con Firestore.
- Manejo de tareas pendientes cuando no hay conexión.
- Detección de conexión a internet.
- Manejo de estados de carga y error.
- Modo claro y modo oscuro.
- Navegación con Expo Router y Bottom Tabs.
- Validaciones en los formularios.

---

# Configuración del entorno

Para ejecutar el proyecto se necesita:

- Node.js.
- npm.
- Expo Go en un dispositivo móvil.
- Una cuenta de Firebase.
- Una cuenta de Cloudinary.
- Una cuenta de Expo para generar el APK.

Después de clonar el repositorio se deben instalar las dependencias:

```bash
npm install
```

Luego se puede iniciar el proyecto con:

```bash
npx expo start
```

También se puede utilizar:

```bash
npx expo start --tunnel
```

si existen problemas para conectar Expo Go desde la red local.

---

# Variables de entorno

El proyecto utiliza Firebase para la autenticación y Firestore.

Las variables de configuración pueden colocarse en un archivo `.env` en la raíz del proyecto.

Ejemplo:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=tu_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=tu_auth_domain
EXPO_PUBLIC_FIREBASE_PROJECT_ID=tu_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=tu_storage_bucket
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=tu_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=tu_app_id
```

El archivo `.env` no debe contenerse en el repositorio si se utilizan datos que no se desean compartir.

Se puede utilizar un archivo `.env.example` para mostrar únicamente los nombres de las variables necesarias.

---

# Comandos para ejecutar el proyecto

## 1. Instalar dependencias

```bash
npm install
```

---

## 2. Iniciar Expo

```bash
npx expo start
```

---

## 3. Ejecutar usando tunnel

```bash
npx expo start --tunnel
```

---

## 4. Revisar errores de TypeScript

```bash
npx tsc --noEmit
```

Este comando permite comprobar que el proyecto no tenga errores de TypeScript.

---

# Generar el APK

El proyecto utiliza EAS Build para generar una versión instalable en Android.

Primero se debe iniciar sesión en Expo:

```bash
npx eas-cli@latest login
```

Después se configura EAS:

```bash
npx eas-cli@latest build:configure
```

El archivo `eas.json` contiene un perfil `preview` preparado para generar un APK.

```json
{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    }
  }
}
```

Para generar el APK se utiliza:

```bash
npx eas-cli@latest build -p android --profile preview
```

Cuando termina el proceso, EAS muestra un enlace y un código QR desde donde se puede obtener el APK.

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
│           │   ├── data-sources
│           │   ├── models
│           │   ├── repositories
│           │   └── services
│           ├── di
│           ├── domain
│           └── presentation
│
├── app.json
├── eas.json
├── package.json
├── package-lock.json
├── tsconfig.json
└── README.md
```

---

# Descripción de la estructura

## app

Contiene las rutas de la aplicación.

Se utiliza Expo Router para manejar la navegación entre login, registro, tareas, creación, edición, detalle y perfil.

---

## config

Contiene configuraciones generales del proyecto.

### database

Contiene la configuración de SQLite utilizada para guardar las tareas localmente.

### firebase

Contiene la configuración necesaria para trabajar con Firebase Authentication y Cloud Firestore.

---

## core

Contiene elementos que se reutilizan en diferentes partes de la aplicación.

### components

Incluye componentes como:

- Botones.
- Inputs.
- Fondos.
- Modales.

### contexts

Contiene el contexto utilizado para manejar el modo claro y oscuro.

---

# Módulo auth

Contiene las funciones relacionadas con las cuentas y el perfil.

Entre ellas:

- Registro.
- Inicio de sesión.
- Cierre de sesión.
- Nombre.
- Apellido.
- Género.
- Correo.
- Foto de perfil.

Firebase Authentication se utiliza para las cuentas de usuario.

Los datos adicionales del perfil se guardan en Firestore.

---

# Módulo Tasks

Contiene todo lo relacionado con las tareas.

Se encuentra separado en diferentes carpetas.

## data

Trabaja con la información local y remota.

Aquí se encuentran:

- SQLite.
- Firestore.
- Modelos.
- Repositorios.
- Sincronización.
- Servicio de imágenes.
- Servicio para consumir categorías desde una API REST.

## domain

Contiene:

- Entidad de tarea.
- Repositorio de tareas.
- Casos de uso.

## presentation

Contiene:

- Pantallas.
- Componentes.
- Hooks.

## di

Contiene las dependencias utilizadas para conectar los repositorios con los casos de uso.

---

# Datos de una tarea

Cada tarea puede guardar:

- Título.
- Descripción.
- Prioridad.
- Categoría.
- Imagen.

Las prioridades disponibles son:

- Baja.
- Media.
- Alta.

---

# Consumo de API REST

La aplicación consume una API REST para obtener las categorías disponibles al crear o editar una tarea.

El flujo es:

```text
API REST
   ↓
Categorías
   ↓
Formulario de tarea
   ↓
Categoría seleccionada
```

Entre las categorías utilizadas se encuentran:

- Personal.
- Estudio.
- Actividad.
- Compras.
- Familia.

Mientras se consulta el servicio se muestra un estado de carga.

Si ocurre un error al consultar la API, la aplicación muestra un mensaje y permite volver a intentar la carga.

La API REST solo se utiliza para obtener las categorías. Las tareas continúan almacenándose mediante SQLite y Firestore.

---

# Almacenamiento de tareas

La aplicación utiliza SQLite y Cloud Firestore.

SQLite permite guardar las tareas localmente en el dispositivo.

Firestore permite mantener las tareas almacenadas de forma remota.

```text
Aplicación
   │
   ├── SQLite
   │
   └── Firestore
```

Cuando una operación todavía no se ha sincronizado, SQLite guarda una acción pendiente.

Los valores utilizados son:

```text
create
update
delete
```

Cuando vuelve la conexión a internet, las operaciones pendientes pueden enviarse a Firestore.

---

# Organización de datos en Firestore

Cada usuario tiene sus propias tareas.

```text
users
└── uid
    └── tasks
        └── taskId
```

Esto permite que cada cuenta trabaje solamente con sus propias tareas.

---

# Manejo de imágenes

Las imágenes son almacenadas mediante Cloudinary.

En las tareas se puede:

- Tomar una fotografía.
- Seleccionar una imagen de la galería.

En el perfil se utiliza la cámara para cambiar la foto del usuario.

Después de subir una imagen a Cloudinary, su URL se guarda junto con los datos correspondientes.

---

# Autenticación

Firebase Authentication se utiliza para:

- Registrar usuarios.
- Iniciar sesión.
- Cerrar sesión.
- Controlar el acceso a la aplicación.

El flujo principal es:

```text
Login / Registro
       ↓
Firebase Authentication
       ↓
Aplicación
```

Las pantallas principales solo pueden ser utilizadas cuando existe una sesión iniciada.

---

# Flujo principal

```text
Login / Registro
       ↓
Firebase Authentication
       ↓
Listado de tareas
       ↓
Crear / Editar / Eliminar
       ↓
SQLite
       ↓
Sincronización
       ↓
Firestore
```

Para crear o editar una tarea también se consultan las categorías mediante la API REST.

```text
API REST
   ↓
Categorías
   ↓
Formulario
```

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
| `@react-native-community/netinfo` | Detectar el estado de conexión. |
| `@react-native-async-storage/async-storage` | Persistencia utilizada por Firebase. |
| `@expo/vector-icons` | Íconos utilizados en la aplicación. |

---

# Funcionalidades implementadas

- ✅ Registro de usuarios.
- ✅ Inicio de sesión.
- ✅ Cierre de sesión.
- ✅ Acceso protegido.
- ✅ Perfil de usuario.
- ✅ Nombre y apellido.
- ✅ Género.
- ✅ Foto de perfil.
- ✅ Crear tareas.
- ✅ Editar tareas.
- ✅ Eliminar tareas.
- ✅ Ver detalle.
- ✅ Prioridad de tareas.
- ✅ Categorías mediante API REST.
- ✅ Estado de carga del servicio REST.
- ✅ Manejo de errores del servicio REST.
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
- ✅ Detección de conexión.
- ✅ Modo oscuro.
- ✅ Validaciones.
- ✅ Expo Router.
- ✅ TypeScript.

---

# Control de versiones

El proyecto utiliza Git y GitHub.

Durante el desarrollo se utilizaron diferentes ramas para trabajar las funcionalidades antes de integrarlas a la versión principal.

```text
Rama de trabajo
      ↓
   develop
      ↓
    main
```

El repositorio mantiene commits realizados por los integrantes del grupo.

---

# Integrantes

- Yrsa Cueto
- Alessander Guillén
- Salvinia Palomino

---

# Versión

**1.0.0**