import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../utils/api';

function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'low' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchTicket = async () => {
      try {
        const res = await API.get('/tickets');
        const ticket = res.data.find((t) => t._id === id);
        if (ticket) {
          setFormData({
            title: ticket.title,
            description: ticket.description,
            priority: ticket.priority.charAt(0).toUpperCase() + ticket.priority.slice(1),
          });
        }
      } catch (err) {
        setError('Failed to load ticket.');
      }
    };
    fetchTicket();
  }, [id]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.patch(`/tickets/${id}`, {
        ...formData,
        priority: formData.priority.toLowerCase(),
      });
      setSuccess('✅ Ticket updated successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      setError('Failed to update ticket.');
    }
  };

  const handleDelete = async () => {
    const confirmDelete = window.confirm('Are you sure you want to delete this ticket?');
    if (!confirmDelete) return;

    try {
      await API.delete(`/tickets/${id}`);
      setSuccess('🗑️ Ticket deleted successfully!');
      setTimeout(() => navigate('/'), 1500);
    } catch (err) {
      console.error('Delete error:', err);
      setError('Failed to delete ticket.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-lg"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Edit Ticket
        </h2>

        {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-4 text-center">{success}</p>}

        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full mb-4 px-3 py-2 border rounded"
          placeholder="Title"
        />

        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          className="w-full mb-4 px-3 py-2 border rounded"
          placeholder="Description"
        />

        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="w-full mb-4 px-3 py-2 border rounded"
        >
          <option>Low</option>
          <option>Medium</option>
          <option>High</option>
        </select>

        <div className="grid grid-cols-3 gap-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="bg-gray-300 py-2 rounded"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="bg-blue-600 text-white py-2 rounded"
          >
            Update
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-500 text-white py-2 rounded"
          >
            Delete
          </button>
        </div>
      </form>
    </div>
  );
}

export default EditTicket;
