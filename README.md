# COTRAFA TRANSACTIONS SYSTEM

<p align="center">
  <a href="https://angular.io/" target="_blank">
    <img src="https://angular.io/assets/images/logos/angular/angular.svg" width="80" alt="Angular Logo" />
  </a>
  <a href="https://tailwindcss.com/" target="_blank">
    <img src="https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg" width="80" alt="Tailwind Logo" />
  </a>
</p>

<p align="center">
  💡 Para visualizar la documentación de manera óptima: <br/>
  🔹 En <strong>GitHub</strong>: usa <strong>Ctrl +</strong> / <strong>Cmd +</strong> para hacer zoom y <strong>F11</strong> para pantalla completa. <br/>
  🔹 En <strong>VS Code</strong>: presiona <strong>Ctrl+Shift+V</strong> / <strong>Cmd+Shift+V</strong> para vista previa de Markdown, <strong>Ctrl+K V</strong> / <strong>Cmd+K V</strong> para vista lado a lado.
</p>

---

## 📋 Información General

| Campo            | Detalle                                    |
| ---------------- | ------------------------------------------ |
| Nombre           | Cotrafa Transactions System                |
| Framework        | Angular 19.2.19                            |
| Arquitectura     | Standalone Components + Clean Architecture |
| Estilos          | Angular Material y Tailwind CSS            |
| Manejo de Estado | Angular Signals (Planeado)                 |
| API Pública      | [RandomUser API](https://randomuser.me/)   |
| Estado           | 🚧 En desarrollo                           |
| Desarrollador    | Daniel Palacio Uribe                       |

---

## 🎯 Objetivo del Proyecto

Construir un módulo frontend robusto en Angular, aplicando estándares modernos de la industria:

- **Buenas prácticas:** Código limpio y mantenible.
- **Arquitectura Limpia:** Separación clara de responsabilidades.
- **Seguridad:** Simulación de transacciones con generación y encriptación de CUS.
- **Persistencia:** Manejo de datos locales y consumo de servicios externos.

---

## 🏗️ Arquitectura del Proyecto

Se utiliza una arquitectura basada en capas para garantizar la escalabilidad y facilitar el testing unitario.

| Capa         | Responsabilidad                                         |
| ------------ | ------------------------------------------------------- |
| **core**     | Servicios transversales, interceptores y lógica global. |
| **shared**   | Componentes reutilizables, modelos de dominio y pipes.  |
| **features** | Casos de uso específicos (módulo de transacciones).     |

### Principios Aplicados

- **Standalone Components:** Eliminación de NgModules para un diseño más ligero.
- **Smart & Presentational:** Separación de lógica de negocio y UI.
- **Repository Pattern:** Desacoplamiento de la fuente de datos (LocalStorage/API).

---

## 🧩 Funcionalidades y Alcance

| Funcionalidad                                   | Estado          |
| ----------------------------------------------- | --------------- |
| Consumo de usuarios desde API pública           | ✅ Implementada |
| Interceptor HTTP (X-Frontend-Version)           | ✅ Implementada |
| Arquitectura base y ruteo                       | ✅ Implementada |
| Simulación de transacciones                     | ⏳ Pendiente    |
| Generación y Encriptación de CUS                | ⏳ Pendiente    |
| Historial local de transacciones (LocalStorage) | ⏳ Pendiente    |
| Unit Testing de servicios clave                 | ⏳ Pendiente    |

---
