import React, { useEffect, useState } from 'react';
import API from '../utils/api';

export default function TicketList() {
  const [tickets, setTickets] = useState([]);

  const fetchTickets = async () => {
    const res = await API.get('/tickets');
    setTickets(res.data);
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  return (
    <div>
      <h2>All Tickets</h2>
      <ul>
        {tickets.map(ticket => (
          <li key={ticket._id}>
            <strong>{ticket.title}</strong> [{ticket.status}] - {ticket.priority}
            <p>{ticket.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
