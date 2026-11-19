import { useState } from 'react';

const STATUTS = ['ouvert', 'en_cours', 'résolu'];

const STATUT_CONFIG = {
  ouvert:   { label: 'Ouvert',   emoji: '🔵', classe: 'statut-ouvert' },
  en_cours: { label: 'En cours', emoji: '🟠', classe: 'statut-en_cours' },
  résolu:   { label: 'Résolu',   emoji: '🟢', classe: 'statut-resolu' },
};

export default function TicketCard({ ticket, onStatut, onDelete }) {
  const [loading, setLoading]   = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { id, titre, description, statut, created_at } = ticket;
  const config = STATUT_CONFIG[statut] || STATUT_CONFIG.ouvert;

  async function handleStatut(e) {
    const nouv = e.target.value;
    if (nouv === statut) return;
    try {
      setLoading(true);
      await onStatut(id, nouv);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    if (!window.confirm('Supprimer ce ticket ?')) return;
    try {
      setDeleting(true);
      await onDelete(id);
    } catch (err) {
      alert(err.message);
      setDeleting(false);
    }
  }

  const dateFormatee = created_at
    ? new Date(created_at).toLocaleString('fr-FR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
      })
    : '—';

  return (
    <article className={`card ticket-card ${deleting ? 'deleting' : ''}`}>
      {/* ── Badge statut ── */}
      <div className={`statut-badge ${config.classe}`}>
        {config.emoji} {config.label}
      </div>

      {/* ── Contenu ── */}
      <h3 className="ticket-titre">#{id} — {titre}</h3>
      <p className="ticket-description">{description}</p>
      <p className="ticket-date">🕐 {dateFormatee}</p>

      {/* ── Actions ── */}
      <div className="ticket-actions">
        <div className="select-wrapper">
          <select
            value={statut}
            onChange={handleStatut}
            disabled={loading}
            className="statut-select"
            aria-label="Changer le statut"
          >
            {STATUTS.map((s) => (
              <option key={s} value={s}>
                {STATUT_CONFIG[s].label}
              </option>
            ))}
          </select>
          {loading && <span className="select-loading">…</span>}
        </div>

        <button
          className="btn btn-danger"
          onClick={handleDelete}
          disabled={deleting}
          aria-label="Supprimer le ticket"
        >
          🗑️
        </button>
      </div>
    </article>
  );
}
