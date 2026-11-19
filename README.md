# 🎫 Gestion de Tickets — TP Mise en production YNOV

Application web de suivi des demandes informatiques, déployée en ligne selon une architecture **trois tiers**.

---

## 🏗️ Architecture

```
┌─────────────────┐     HTTP/HTTPS      ┌─────────────────┐     SQL      ┌─────────────────┐
│    Frontend     │ ──────────────────► │    Backend      │ ──────────► │  Base de données│
│  React + Vite   │                     │ Node.js+Express │            │   PostgreSQL     │
│    (Vercel)     │                     │    (Render)     │            │   (Supabase)     │
└─────────────────┘                     └─────────────────┘            └─────────────────┘
         ▲                                       ▲
         │               GitHub                  │
         └──────────── CI/CD auto ───────────────┘
```

---

## ✅ Fonctionnalités

### Obligatoires
- **F1** — Afficher la liste des tickets (titre, description, statut)
- **F2** — Créer un ticket via un formulaire
- **F3** — Modifier le statut d'un ticket : `ouvert` → `en_cours` → `résolu`
- **F4** — Persistance des données en base PostgreSQL
- **F5** — Application accessible en ligne (URLs publiques)

### Facultatives (implémentées)
- 🗑️ Supprimer un ticket
- 🔍 Filtrer les tickets par statut

---

## 🗃️ Modèle de données

```sql
CREATE TABLE tickets (
  id          SERIAL PRIMARY KEY,
  titre       VARCHAR(255) NOT NULL,
  description TEXT        NOT NULL,
  statut      VARCHAR(50) NOT NULL DEFAULT 'ouvert'
              CHECK (statut IN ('ouvert', 'en_cours', 'résolu')),
  created_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);
```

---

## 🔌 API

| Méthode  | Route                | Description               |
|----------|----------------------|---------------------------|
| `GET`    | `/health`            | Vérifie que l'API répond  |
| `GET`    | `/api/tickets`       | Liste tous les tickets    |
| `POST`   | `/api/tickets`       | Crée un ticket            |
| `PATCH`  | `/api/tickets/:id`   | Modifie le statut         |
| `DELETE` | `/api/tickets/:id`   | Supprime un ticket        |

---

## ⚙️ Installation locale

### Prérequis
- Node.js >= 18
- Un compte [Supabase](https://supabase.com) (ou PostgreSQL local)

### 1. Cloner le dépôt

```bash
git clone https://github.com/<votre-username>/TP-prod.git
cd TP-prod
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env
# Renseigner DATABASE_URL, FRONTEND_URL dans .env
# Exécuter backend/init.sql dans Supabase SQL Editor
npm run dev
# API sur http://localhost:3000
```

### 3. Frontend

```bash
cd frontend
npm install
cp .env.example .env
# Renseigner VITE_API_URL=http://localhost:3000
npm run dev
# Interface sur http://localhost:5173
```

---

## 🚀 Déploiement en production

### Base de données — Supabase
1. Créer un projet sur [supabase.com](https://supabase.com)
2. Aller dans **SQL Editor** et coller le contenu de `backend/init.sql`
3. Récupérer la **Connection String** (Settings → Database → URI)

### Backend — Render
1. Créer un **Web Service** sur [render.com](https://render.com)
2. Connecter le dépôt GitHub
3. Root Directory : `backend` | Build : `npm install` | Start : `npm start`
4. Variables d'environnement : `DATABASE_URL`, `FRONTEND_URL`, `NODE_ENV=production`

### Frontend — Vercel
1. Importer le projet sur [vercel.com](https://vercel.com)
2. Root Directory : `frontend` | Framework : Vite
3. Variable d'environnement : `VITE_API_URL` = URL publique Render

---

## 🔐 Sécurité

- Aucun secret dans le code source ou Git
- Paramètres sensibles dans les variables d'environnement uniquement
- Credentials BDD exclusivement côté backend
- HTTPS assuré par Render et Vercel

---

## 📦 Livrables

| # | Livrable | Lien |
|---|----------|------|
| 1 | Code source + README | Ce dépôt GitHub |
| 2 | Frontend déployé | `https://<projet>.vercel.app` |
| 3 | API déployée | `https://<projet>.onrender.com` |
| 4 | Schéma d'architecture | Voir section Architecture |
| 5 | Compte rendu | Voir [COMPTE_RENDU.md](./COMPTE_RENDU.md) |
