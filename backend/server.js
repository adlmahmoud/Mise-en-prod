require('dotenv').config();
const express = require('express');
const cors = require('cors');
const ticketsRouter = require('./routes/tickets');

const app = express();
const PORT = process.env.PORT || 3000;

// ─── Middlewares ───────────────────────────────────────────────────────────────
const allowedOrigin = process.env.FRONTEND_URL ? process.env.FRONTEND_URL.replace(/\/+$/, '') : '*';

app.use(
  cors({
    origin: (origin, callback) => {
      // Autorise les requêtes sans origine (comme curl, navigateurs directs)
      if (!origin) return callback(null, true);
      // Autorise localhost, l'URL frontend configurée, ou n'importe quel domaine vercel
      if (
        allowedOrigin === '*' ||
        origin === allowedOrigin ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, true);
      }
      return callback(null, true); // Fallback tolérant pour éviter les blocages de TP
    },
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json());

// ─── Accueil API ──────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({
    message: 'API Gestion de Tickets — TP YNOV',
    status: 'en ligne',
    endpoints: {
      health: '/health',
      tickets: '/api/tickets',
    },
  });
});

// ─── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use('/api/tickets', ticketsRouter);

// ─── 404 ──────────────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// ─── Démarrage ────────────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur le port ${PORT}`);
});
