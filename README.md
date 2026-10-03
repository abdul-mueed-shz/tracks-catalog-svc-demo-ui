# ICE Music Frontend (`FE`)

[![Vue 3](https://img.shields.io/badge/Vue-3.5-brightgreen.svg)](https://vuejs.org/)
[![Quasar](https://img.shields.io/badge/Quasar-2.17-blue.svg)](https://quasar.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple.svg)](https://vitejs.dev/)
[![Pinia](https://img.shields.io/badge/Pinia-2.3-yellow.svg)](https://pinia.vuejs.org/)

A clean, minimalist frontend interface built with **Vue 3 (Composition API)**, **Quasar Framework**, **Pinia**, and **TypeScript**, designed to communicate directly with the **Java 21 Spring Boot `catalog-service`** running on `http://localhost:8080`.

---

## ✨ Features & Backend Integration

1. **Direct Backend Connection (`http://localhost:8080/catalog-svc`)**:
   - Zero mock data fallbacks: Displays strictly what is retrieved from your backend database.
   - Vite dev proxy forwards `/catalog-svc` directly to `http://localhost:8080`.
   - Real-time connection badge verifying actuator health and API readiness.

2. **Minimalist & Pure Data Display**:
   - No fake playback buttons, audio streaming widgets, or mock visualizers.
   - Replaces external images with clean static PNG placeholders (`/placeholder.png` and `/artist-placeholder.png`).
   - Clean, high-contrast dark UI focused on catalog management.

3. **Artist of the Day (`GET /artist-of-the-day`)**:
   - Shows current featured artist assigned by the backend's fair 24-hour circular rotation sequence.
   - Direct link to profile and track creation.

4. **Music Catalog & Keyset Pagination (`GET /tracks`)**:
   - Lists tracks with Title, Artist, Genre, Release Date, and Duration.
   - Keyset cursor pagination (`cursor`, `size`, `property`, `direction`).
   - Search by artist name or alias matching backend query joins.

5. **Artists & Historical Stage Aliases (`GET /users` & `GET /users/{id}/aliases`)**:
   - View registered artists and listeners.
   - **Update Artist Name (`PATCH /users/{id}`)**: Triggers automated archiving of previous names into historical aliases.
   - Audit trail of stage names and normalized search tokens.

6. **Catalog Modifications**:
   - Add new tracks linked to artists (`POST /tracks/user/{id}/add`).
   - Register new artists or listeners (`POST /users`).

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **Spring Boot Backend**: Running on `http://localhost:8080` (context path `/catalog-svc`)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The app will be available at `http://localhost:3000`.

### 4. Build for Production
```bash
npm run build
```
