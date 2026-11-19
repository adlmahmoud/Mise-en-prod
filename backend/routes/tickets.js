const express = require('express');
const router = express.Router();
const pool = require('../db');

const STATUTS_VALIDES = ['ouvert', 'en_cours', 'résolu'];

// ─── GET /api/tickets ─────────────────────────────────────────────────────────
// Récupère tous les tickets (tri du plus récent au plus ancien)
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tickets ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('GET /api/tickets :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── POST /api/tickets ────────────────────────────────────────────────────────
// Crée un nouveau ticket (statut initial : "ouvert")
router.post('/', async (req, res) => {
  const { titre, description } = req.body;

  if (!titre || typeof titre !== 'string' || titre.trim() === '') {
    return res.status(400).json({ error: 'Le champ "titre" est requis.' });
  }
  if (!description || typeof description !== 'string' || description.trim() === '') {
    return res.status(400).json({ error: 'Le champ "description" est requis.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tickets (titre, description, statut)
       VALUES ($1, $2, 'ouvert')
       RETURNING *`,
      [titre.trim(), description.trim()]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('POST /api/tickets :', err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── PATCH /api/tickets/:id ───────────────────────────────────────────────────
// Modifie le statut d'un ticket existant
router.patch('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { statut } = req.body;

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID invalide.' });
  }
  if (!statut || !STATUTS_VALIDES.includes(statut)) {
    return res.status(400).json({
      error: `Statut invalide. Valeurs acceptées : ${STATUTS_VALIDES.join(', ')}`,
    });
  }

  try {
    const result = await pool.query(
      'UPDATE tickets SET statut = $1 WHERE id = $2 RETURNING *',
      [statut, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket non trouvé.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(`PATCH /api/tickets/${id} :`, err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// ─── DELETE /api/tickets/:id ──────────────────────────────────────────────────
// Supprime un ticket (fonctionnalité facultative)
router.delete('/:id', async (req, res) => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    return res.status(400).json({ error: 'ID invalide.' });
  }

  try {
    const result = await pool.query(
      'DELETE FROM tickets WHERE id = $1 RETURNING *',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Ticket non trouvé.' });
    }
    res.json({ message: 'Ticket supprimé.', ticket: result.rows[0] });
  } catch (err) {
    console.error(`DELETE /api/tickets/${id} :`, err.message);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

module.exports = router;
