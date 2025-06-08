import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import API from '../utils/api';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const { user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusUpdatedId, setStatusUpdatedId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const navigate = useNavigate();

  const fetchTickets = async () => {
    try {
      const res = await API.get('/tickets');
      setTickets(res.data || []);  // fallback to [] if undefined/null
    } catch (err) {
      console.error('Failed to fetch tickets', err);
      setError('Error loading tickets');
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleStatusChange = async (ticketId, newStatus) => {
    try {
      await API.put(`/tickets/${ticketId}`, { status: newStatus });
      fetchTickets(); // Refresh entire list to ensure accurate data
      setStatusUpdatedId(ticketId);
      setTimeout(() => setStatusUpdatedId(null), 2000);
    } catch (err) {
      console.error('Error updating status', err);
      setError('Could not update status.');
    }
  };

  const handleDelete = async (ticketId) => {
    const confirm = window.confirm('Are you sure you want to delete this ticket?');
    if (!confirm) return;

    try {
      await API.delete(`/tickets/${ticketId}`);
      fetchTickets(); // Refresh after deletion
      setSuccess('✅ Ticket deleted successfully.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error('Error deleting ticket', err);
      alert('❌ Could not delete ticket.');
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusBorderColor = (status) => {
    switch (status) {
      case 'open':
        return 'border-blue-500';
      case 'pending':
        return 'border-yellow-500';
      case 'closed':
        return 'border-green-500';
      default:
        return 'border-gray-300';
    }
  };

  const ticketStats = {
    total: tickets.length || 0,
    open: tickets.filter((t) => t.status === 'open').length,
    closed: tickets.filter((t) => t.status === 'closed').length,
    pending: tickets.filter((t) => t.status === 'pending').length,
  };

  const statusSections = ['open', 'pending', 'closed'];

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">
          Welcome, {user?.name} 👋
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-10">
          {Object.entries(ticketStats).map(([key, value]) => (
            <div key={key} className="bg-white p-5 shadow rounded text-center border">
              <h2 className="text-lg font-medium text-gray-600 capitalize">{key}</h2>
              <p className="text-3xl font-bold text-blue-700">{value}</p>
            </div>
          ))}
        </div>

        <div className="bg-white/80 shadow-sm border border-gray-200 rounded p-4 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-700">Your Tickets</h2>
            <button
              onClick={() => navigate('/create-ticket')}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              + Create Ticket
            </button>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          {success && <p className="text-green-600 text-sm mb-4">{success}</p>}

          {statusSections.map((section) => (
            <div key={section} className="mb-10">
              <h3 className="text-xl font-semibold capitalize mb-4 text-gray-700 border-b pb-1">
                {section} Tickets
              </h3>
              {tickets.filter((t) => t.status === section).length === 0 ? (
                <p className="text-gray-500 italic">No {section} tickets</p>
              ) : (
                <div className="grid gap-4">
                  {tickets
                    .filter((ticket) => ticket.status === section)
                    .map((ticket) => (
                      <div
                        key={ticket._id}
                        className={`relative bg-white p-4 rounded shadow-md border-l-4 ${getStatusBorderColor(ticket.status)}`}
                      >
                        <div className="absolute top-2 right-2 text-sm text-gray-600 cursor-pointer">
                          <span
                            onClick={() =>
                              setActiveMenu(activeMenu === ticket._id ? null : ticket._id)
                            }
                          >
                            ⋮
                          </span>
                          {activeMenu === ticket._id && (
                            <div className="absolute right-0 mt-2 w-28 bg-white shadow border rounded text-sm z-20">
                              <div
                                onClick={() => navigate(`/edit-ticket/${ticket._id}`)}
                                className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                              >
                                ✏️ Edit
                              </div>
                              <div
                                onClick={() => handleDelete(ticket._id)}
                                className="px-3 py-2 hover:bg-red-100 text-red-600 cursor-pointer"
                              >
                                🗑️ Delete
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="flex justify-between items-start md:items-center flex-col md:flex-row gap-4">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800">{ticket.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{ticket.description}</p>
                          </div>

                          <div className="flex flex-col gap-2 md:items-end">
                            <span
                              className={`px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(
                                ticket.priority
                              )}`}
                            >
                              {ticket.priority.toUpperCase()}
                            </span>

                            <select
                              value={ticket.status}
                              onChange={(e) => handleStatusChange(ticket._id, e.target.value)}
                              className="border border-gray-300 rounded px-3 py-1 text-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            >
                              <option value="open">Open</option>
                              <option value="pending">Pending</option>
                              <option value="closed">Closed</option>
                            </select>

                            {statusUpdatedId === ticket._id && (
                              <span className="text-green-600 text-xs">Status updated ✔</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
