-- Script d'initialisation de la base de données
-- À exécuter une seule fois sur Supabase (SQL Editor)

CREATE TABLE IF NOT EXISTS tickets (
  id          SERIAL PRIMARY KEY,
  titre       VARCHAR(255) NOT NULL,
  description TEXT        NOT NULL,
  statut      VARCHAR(50) NOT NULL DEFAULT 'ouvert'
              CHECK (statut IN ('ouvert', 'en_cours', 'résolu')),
  created_at  TIMESTAMP   NOT NULL DEFAULT NOW()
);

-- Données de test (optionnel)
INSERT INTO tickets (titre, description, statut) VALUES
  ('Problème réseau bureau 3', 'Le switch du bureau 3 ne répond plus depuis ce matin.', 'ouvert'),
  ('Mise à jour antivirus', 'Déployer la dernière version sur tous les postes.', 'en_cours'),
  ('Imprimante hors service', 'L''imprimante du couloir ne s''allume plus.', 'résolu');
