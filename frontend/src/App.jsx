import { useState, useEffect } from 'react';
import TicketForm from './components/TicketForm';
import TicketList from './components/TicketList';
import { getTickets, createTicket, updateStatut, deleteTicket } from './api';

export default function App() {
  const [tickets, setTickets]     = useState([]);
  const [filtre, setFiltre]       = useState('tous');
  const [loading, setLoading]     = useState(true);
  const [erreur, setErreur]       = useState(null);

  // ─── Chargement initial ───────────────────────────────────────────────────
  useEffect(() => {
    chargerTickets();
  }, []);

  async function chargerTickets() {
    try {
      setLoading(true);
      setErreur(null);
      const data = await getTickets();
      setTickets(data);
    } catch (e) {
      setErreur(e.message);
    } finally {
      setLoading(false);
    }
  }

  // ─── Créer un ticket ──────────────────────────────────────────────────────
  async function handleCreate(titre, description) {
    const nouveau = await createTicket(titre, description);
    setTickets((prev) => [nouveau, ...prev]);
  }

  // ─── Modifier le statut ───────────────────────────────────────────────────
  async function handleStatut(id, statut) {
    const mis_a_jour = await updateStatut(id, statut);
    setTickets((prev) =>
      prev.map((t) => (t.id === id ? mis_a_jour : t))
    );
  }

  // ─── Supprimer un ticket ──────────────────────────────────────────────────
  async function handleDelete(id) {
    await deleteTicket(id);
    setTickets((prev) => prev.filter((t) => t.id !== id));
  }

  // ─── Filtrage ─────────────────────────────────────────────────────────────
  const ticketsFiltres =
    filtre === 'tous' ? tickets : tickets.filter((t) => t.statut === filtre);

  return (
    <div className="app">
      {/* ── Header ── */}
      <header className="header">
        <div className="header-inner">
          <span className="header-icon">🎫</span>
          <div>
            <h1>Gestion de Tickets</h1>
            <p>Suivi des demandes informatiques</p>
          </div>
        </div>
      </header>

      <main className="main">
        {/* ── Formulaire de création ── */}
        <TicketForm onCreate={handleCreate} />

        {/* ── Filtres ── */}
        <div className="filtres">
          {['tous', 'ouvert', 'en_cours', 'résolu'].map((f) => (
            <button
              key={f}
              className={`filtre-btn ${filtre === f ? 'actif' : ''}`}
              onClick={() => setFiltre(f)}
            >
              {f === 'tous' ? 'Tous' : f === 'en_cours' ? 'En cours' : f.charAt(0).toUpperCase() + f.slice(1)}
              {' '}
              <span className="badge">
                {f === 'tous'
                  ? tickets.length
                  : tickets.filter((t) => t.statut === f).length}
              </span>
            </button>
          ))}
        </div>

        {/* ── États ── */}
        {loading && (
          <div className="etat-centre">
            <div className="spinner" />
            <p>Chargement des tickets…</p>
          </div>
        )}
        {erreur && (
          <div className="etat-erreur">
            ⚠️ {erreur}
            <button onClick={chargerTickets} className="btn-retry">
              Réessayer
            </button>
          </div>
        )}
        {!loading && !erreur && (
          <TicketList
            tickets={ticketsFiltres}
            onStatut={handleStatut}
            onDelete={handleDelete}
          />
        )}
      </main>

      <footer className="footer">
        <p>TP Mise en production — YNOV 2026</p>
      </footer>
    </div>
  );
}
