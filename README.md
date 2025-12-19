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

| Campo                | Detalle                                    |
| -------------------- | ------------------------------------------ |
| **Nombre**           | Cotrafa Transactions System                |
| **Framework**        | Angular 19.2.19                            |
| **Arquitectura**     | Standalone Components + Clean Architecture |
| **Estilos**          | Angular Material y Tailwind CSS            |
| **Manejo de Estado** | Angular Signals                            |
| **API Pública**      | [RandomUser API](https://randomuser.me/)   |
| **Estado**           | ✅ Desarrollo completado                   |
| **Desarrollador**    | Daniel Palacio Uribe                       |

---

## 🎯 Objetivo del Proyecto

Construir un módulo frontend robusto en Angular que cumpla con los estándares modernos de la industria:

- **Buenas prácticas:** Código limpio, mantenible y modular.
- **Arquitectura Limpia:** Separación clara de responsabilidades.
- **Seguridad:** Simulación de transacciones con generación y encriptación de CUS.
- **Persistencia:** Manejo de datos locales y consumo de APIs externas.

---

## 🏗️ Arquitectura del Proyecto

Arquitectura basada en capas para garantizar escalabilidad, testabilidad y claridad:

| Capa         | Responsabilidad                                        |
| ------------ | ------------------------------------------------------ |
| **core**     | Servicios transversales, interceptores y lógica global |
| **shared**   | Componentes reutilizables, modelos de dominio y pipes  |
| **features** | Casos de uso específicos (módulo de transacciones)     |

### Principios Aplicados

- **Standalone Components:** Sin NgModules innecesarios.
- **Smart & Presentational Components:** Separación de lógica de negocio y UI.
- **Repository Pattern:** Desacoplamiento de la fuente de datos (LocalStorage/API).
- **Reactive Forms:** Formularios validados y reactivos.
- **Strict Typing:** Tipado estricto para mayor seguridad y claridad.

---

## 🧩 Funcionalidades

### 1. Listado de usuarios

- Consumo de API pública ([RandomUser API](https://randomuser.me/)).
- Búsqueda y paginación avanzada.
- Selección clara de usuario.

### 2. Simulación de transacciones

- Selección de usuario e ingreso de monto.
- Generación de CUS único basado en el usuario.

### 3. CUS (Código Único de Seguimiento)

- Generado con `CusEncryptionService`.
- Encriptado automáticamente para seguridad de la información.
- Funcionalidad para mostrar/ocultar temporalmente el CUS original.

### 4. Historial local de transacciones

- Persistencia local con `TransactionsRepository`.
- Visualización de CUS encriptado, usuario, fecha y hora.
- Opciones para eliminar o copiar datos de transacciones.

### 5. Interceptor HTTP

- Inyección automática de cabecera: `X-Frontend-Version: 1.0`.

---

## 🧪 Tests Unitarios

El proyecto cuenta con una base sólida de pruebas automatizadas ejecutadas con **Karma/Jasmine**:

- **TransactionsService**: Validación de lógica de negocio y persistencia.
- **CusEncryptionService**: Verificación de algoritmos de encriptación.
- **HistorialComponent**: Pruebas de renderizado y manejo de estados.
- ✅ **Estado**: Todos los tests están cubiertos y se ejecutan correctamente.

---

## 🎨 Bonus Implementados

- **Dark Mode:** Soporte completo de tema oscuro.
- **Diseño Responsivo:** Uso de Tailwind CSS para una experiencia óptima en cualquier dispositivo.
- **UX Mejorada:** Paginación y filtros en tiempo real en el listado de usuarios y traducción de idioma Español e Inglés.
- **Animaciones:** Transiciones fluidas entre componentes utilizando Angular Animations.

---

## 💡 Decisiones Técnicas

- **Signals + Repository:** Facilita la transición de LocalStorage a un backend real en el futuro sin romper la lógica.
- **Interceptor HTTP:** Centraliza el control de versiones de las peticiones salientes.
- **Smart/Presentational Components:** Mantiene los componentes desacoplados, facilitando el mantenimiento y el testing.
- **Encriptación:** Implementación segura mediante la librería `crypto-js`.

---

## 🔧 Estado Actual del Desarrollo

| Funcionalidad                                   | Estado |
| :---------------------------------------------- | :----: |
| Consumo de usuarios desde API pública           |   ✅   |
| Interceptor HTTP (X-Frontend-Version)           |   ✅   |
| Arquitectura base y ruteo                       |   ✅   |
| Simulación de transacciones                     |   ✅   |
| Generación y Encriptación de CUS                |   ✅   |
| Historial local de transacciones (LocalStorage) |   ✅   |
| Unit Testing de servicios clave                 |   ✅   |
| Animaciones Angular                             |   ✅   |
| Dark Mode                                       |   ✅   |
| Paginación / filtros                            |   ✅   |

---

## 💻 Tecnologías

- **Angular 19.2.19** (Signals, Control Flow, Standalone)
- **TypeScript** (Strict Mode)
- **TailwindCSS**
- **Angular Material**
- **crypto-js** (Encriptación CUS)
- **Karma/Jasmine** (Unit Testing)

---

## 📸 Demo Visual

### 🖼️ Capturas de Pantalla
<p align="center">
  <em>Interfaz limpia, adaptada a modo light.</em>
</p>
<div align="center">
<img width="48%" src="https://github.com/user-attachments/assets/79c93214-42fc-4e21-acc9-539917c66f6e" />
<img width="48%" height="641" alt="image" src="https://github.com/user-attachments/assets/04476c1b-1361-4f20-98c2-d5dc7b56f307" />
<img width="48%" height="641" alt="image" src="https://github.com/user-attachments/assets/019b74bf-028a-4885-8298-c2187bb864d1" />
<img width="48%" height="635" alt="image" src="https://github.com/user-attachments/assets/ce9e7794-1056-4d9a-8a35-f1d7ffd4cdff" />
<img width="48%" height="637" alt="image" src="https://github.com/user-attachments/assets/8d0c9329-adc6-459a-b806-2d71cf104cea" />
<img width="48%" height="634" alt="image" src="https://github.com/user-attachments/assets/f8f2cf3a-f359-4972-8921-5bc624f57a34" />
<img width="48%" height="637" alt="image" src="https://github.com/user-attachments/assets/da5a923e-6167-40c0-a742-0514fb43d258" />
<img width="1349" height="435" alt="image" src="https://github.com/user-attachments/assets/6187bbba-8c49-4dc0-9f31-b3e43bbbcdf6" />

</div>

<p align="center">
  <em>Interfaz limpia, adaptada a modo oscuro, responsive, traducción y funcionalidad extra como eliminar.</em>
</p>
<div align="center">
<img width="1348" height="630" alt="image" src="https://github.com/user-attachments/assets/b2e54383-ca78-4542-aaca-eb3d3a51d93c" />
<img width="1350" height="627" alt="image" src="https://github.com/user-attachments/assets/da0649ee-b6f4-422d-805f-d7dc9f10cb60" />
<img width="1351" height="626" alt="image" src="https://github.com/user-attachments/assets/f63036c6-9624-4994-a50d-736e14e3f5ce" />
<img width="1364" height="632" alt="image" src="https://github.com/user-attachments/assets/8b732088-4baf-4840-b9bc-ad5bb3fa08e3" />
<img width="1346" height="634" alt="image" src="https://github.com/user-attachments/assets/e23a6d44-ca11-4871-a24f-4d3550e7766e" />
<img width="302" height="544" alt="image" src="https://github.com/user-attachments/assets/67dd4648-75b4-4f6f-b72f-a19a09ec49c6" />

</div>
---

## 🚀 Instalación y ejecución

```bash
# Clonar el repositorio
git clone [https://github.com/Dpalacioo/cotrafa-transactions-system.git](https://github.com/Dpalacioo/cotrafa-transactions-system.git)
cd cotrafa-transactions-system

# Instalar dependencias
npm install

# Levantar aplicación
npm start

# Ejecutar tests
npm test
```
