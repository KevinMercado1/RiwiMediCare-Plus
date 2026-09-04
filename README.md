# 🏥 RiwiMediCare Plus

API REST para la gestión de información de una plataforma de servicios médicos, desarrollada como proyecto de software utilizando Node.js, TypeScript, Express y PostgreSQL.

El sistema permite administrar usuarios, clínicas, ciudades, medicamentos, inventarios, almacenes y solicitudes de medicamentos, incorporando autenticación, autorización por roles, validación de datos y documentación de la API mediante Swagger.

---

## 📌 Tabla de contenidos

- [Descripción](#-descripción)
- [Características](#-características)
- [Tecnologías](#-tecnologías)
- [Arquitectura](#-arquitectura)
- [Estructura del proyecto](#-estructura-del-proyecto)
- [Módulos principales](#-módulos-principales)
- [Requisitos](#-requisitos)
- [Instalación](#-instalación)
- [Configuración](#-configuración)
- [Ejecución](#-ejecución)
- [Seeder](#-seeder)
- [Documentación de la API](#-documentación-de-la-api)
- [Autenticación y seguridad](#-autenticación-y-seguridad)
- [Validación de datos](#-validación-de-datos)
- [Base de datos](#-base-de-datos)
- [Pruebas](#-pruebas)
- [Autor](#-autor)

---

# 📖 Descripción

**RiwiMediCare Plus** es una aplicación backend desarrollada para gestionar diferentes procesos relacionados con la administración de medicamentos y servicios médicos.

La aplicación proporciona una API REST que permite realizar operaciones de creación, consulta, actualización y eliminación de diferentes recursos del sistema.

Entre los principales recursos se encuentran:

- Usuarios
- Clínicas
- Ciudades
- NIT
- Teléfonos
- Almacenes
- Medicamentos
- Inventarios
- Solicitudes
- Detalles de solicitudes

El sistema también implementa mecanismos de autenticación y autorización para controlar el acceso a los diferentes recursos.

---

# 🚀 Características

- ✅ API REST.
- ✅ Desarrollo utilizando TypeScript.
- ✅ Framework Express.
- ✅ Base de datos PostgreSQL.
- ✅ ORM Sequelize.
- ✅ Autenticación mediante JWT.
- ✅ Autorización mediante roles.
- ✅ Hashing de contraseñas.
- ✅ Validación de solicitudes.
- ✅ Validación mediante DTOs.
- ✅ Gestión de inventarios.
- ✅ Gestión de medicamentos.
- ✅ Gestión de solicitudes.
- ✅ Gestión de clínicas.
- ✅ Gestión de usuarios.
- ✅ Documentación mediante Swagger.
- ✅ Seeder para datos iniciales.
- ✅ Identificadores UUID.
- ✅ Variables de entorno.

---

# 🛠️ Tecnologías

| Tecnología        | Uso                       |
| ----------------- | ------------------------- |
| Node.js           | Entorno de ejecución      |
| TypeScript        | Lenguaje de programación  |
| Express           | Framework para API REST   |
| PostgreSQL        | Base de datos             |
| Sequelize         | ORM                       |
| JWT               | Autenticación             |
| bcrypt            | Protección de contraseñas |
| Zod               | Validación de datos       |
| express-validator | Validación de solicitudes |
| Swagger           | Documentación de API      |
| Jest              | Pruebas                   |
| Supertest         | Pruebas HTTP              |
| UUID              | Identificadores únicos    |
| dotenv            | Variables de entorno      |
| Multer            | Manejo de archivos        |
| tsx               | Ejecución de TypeScript   |

---

# 🏗️ Arquitectura

El proyecto utiliza una arquitectura organizada por responsabilidades.

```text
Cliente
   │
   ▼
┌──────────────────────┐
│       Express        │
│       API REST       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│        Routes        │
│       Rutas API      │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Middlewares      │
│ Auth / Role /        │
│ Validaciones         │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│     Controllers      │
│ Lógica de solicitudes│
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│        Models        │
│      Sequelize       │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│      PostgreSQL      │
│      Base de datos   │
└──────────────────────┘
```
