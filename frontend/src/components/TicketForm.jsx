import { useState } from 'react';

export default function TicketForm({ onCreate }) {
  const [titre, setTitre]           = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading]       = useState(false);
  const [erreur, setErreur]         = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!titre.trim() || !description.trim()) return;

    try {
      setLoading(true);
      setErreur(null);
      await onCreate(titre.trim(), description.trim());
      setTitre('');
      setDescription('');
    } catch (err) {
      setErreur(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="card form-card">
      <h2 className="section-title">➕ Nouveau ticket</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="form-group">
          <label htmlFor="titre">Titre *</label>
          <input
            id="titre"
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            placeholder="Ex: Problème réseau bureau 3"
            required
            maxLength={255}
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description *</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Décrivez le problème en détail…"
            required
            rows={3}
          />
        </div>
        {erreur && <p className="form-erreur">⚠️ {erreur}</p>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Création…' : 'Créer le ticket'}
        </button>
      </form>
    </section>
  );
}
