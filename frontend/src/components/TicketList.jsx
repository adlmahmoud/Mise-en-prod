import TicketCard from './TicketCard';

export default function TicketList({ tickets, onStatut, onDelete }) {
  if (tickets.length === 0) {
    return (
      <div className="etat-centre">
        <span style={{ fontSize: '3rem' }}>📭</span>
        <p>Aucun ticket à afficher.</p>
      </div>
    );
  }

  return (
    <section>
      <h2 className="section-title">📋 Tickets ({tickets.length})</h2>
      <div className="ticket-grid">
        {tickets.map((ticket) => (
          <TicketCard
            key={ticket.id}
            ticket={ticket}
            onStatut={onStatut}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
