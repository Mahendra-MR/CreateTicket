import React, { useState } from 'react';
import API from '../utils/api';

export default function TicketForm({ onTicketCreated }) {
  const [ticket, setTicket] = useState({ title: '', description: '', priority: 'Low' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.post('/tickets', ticket);
    onTicketCreated(); // Refresh list
    setTicket({ title: '', description: '', priority: 'Low' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Ticket</h2>
      <input placeholder="Title" value={ticket.title} onChange={(e) => setTicket({ ...ticket, title: e.target.value })} />
      <textarea placeholder="Description" value={ticket.description} onChange={(e) => setTicket({ ...ticket, description: e.target.value })}></textarea>
      <select value={ticket.priority} onChange={(e) => setTicket({ ...ticket, priority: e.target.value })}>
        <option>Low</option>
        <option>Medium</option>
        <option>High</option>
      </select>
      <button type="submit">Create</button>
    </form>
  );
}
