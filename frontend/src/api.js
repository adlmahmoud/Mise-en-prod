// Toutes les requêtes vers le backend passent par ce fichier.
// L'URL est nettoyée pour éviter tout problème de slash final.
const rawUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000';
const API_URL = rawUrl.replace(/\/+$/, '');

console.log('📡 [API] Connecté à :', API_URL);

/**
 * Récupère la liste de tous les tickets.
 * @returns {Promise<Array>}
 */
export async function getTickets() {
  try {
    const res = await fetch(`${API_URL}/api/tickets`);
    if (!res.ok) {
      const errData = await res.json().catch(() => ({}));
      throw new Error(errData.error || `Erreur serveur (${res.status})`);
    }
    return res.json();
  } catch (err) {
    console.error('Erreur getTickets :', err);
    throw new Error(
      `Impossible de joindre l'API (${API_URL}) : ${err.message}`
    );
  }
}

/**
 * Crée un nouveau ticket.
 * @param {string} titre
 * @param {string} description
 * @returns {Promise<Object>}
 */
export async function createTicket(titre, description) {
  const res = await fetch(`${API_URL}/api/tickets`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titre, description }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erreur lors de la création du ticket.');
  }
  return res.json();
}

/**
 * Met à jour le statut d'un ticket.
 * @param {number} id
 * @param {string} statut  "ouvert" | "en_cours" | "résolu"
 * @returns {Promise<Object>}
 */
export async function updateStatut(id, statut) {
  const res = await fetch(`${API_URL}/api/tickets/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ statut }),
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erreur lors de la mise à jour.');
  }
  return res.json();
}

/**
 * Supprime un ticket.
 * @param {number} id
 * @returns {Promise<Object>}
 */
export async function deleteTicket(id) {
  const res = await fetch(`${API_URL}/api/tickets/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.error || 'Erreur lors de la suppression.');
  }
  return res.json();
}
