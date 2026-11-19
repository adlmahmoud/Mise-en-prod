# Compte rendu technique — TP Mise en production YNOV

## 1. Choix d'hébergement

| Composant | Service choisi | Raison |
|-----------|---------------|--------|
| Frontend | **Vercel** | Déploiement Vite/React natif, CI/CD automatique via GitHub, offre gratuite |
| Backend | **Render** | Support Node.js, variables d'environnement, déploiement depuis GitHub |
| BDD | **Supabase** | PostgreSQL managé, interface SQL, offre gratuite généreuse |
| Code source | **GitHub** | Versionnement standard, intégration native Vercel & Render |

## 2. Principales configurations

### Backend (Render)
- **Build Command** : `npm install`
- **Start Command** : `npm start`
- **Variables d'environnement** : `DATABASE_URL`, `FRONTEND_URL`, `NODE_ENV=production`
- SSL activé pour la connexion PostgreSQL (`rejectUnauthorized: false` sur Render)

### Frontend (Vercel)
- **Framework** : Vite détecté automatiquement
- **Variable d'environnement** : `VITE_API_URL` pointant vers l'URL Render

### Base de données (Supabase)
- Table `tickets` créée via le SQL Editor
- Contrainte CHECK sur le champ `statut` pour garantir la cohérence des données

## 3. Problème rencontré et résolution

**Problème** : Erreur CORS lors des appels du frontend vers le backend.

**Cause** : Le middleware `cors` n'était pas configuré avec l'URL exacte du frontend déployé sur Vercel.

**Solution** : Ajouter la variable d'environnement `FRONTEND_URL` sur Render avec l'URL Vercel, puis configurer `cors({ origin: process.env.FRONTEND_URL })` dans `server.js`.

## 4. CI/CD

Chaque `git push` sur la branche `main` déclenche automatiquement :
- Un redéploiement du frontend sur Vercel
- Un redéploiement du backend sur Render

Le redéploiement est vérifié en observant les logs dans les dashboards respectifs.
