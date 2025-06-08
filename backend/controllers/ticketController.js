const Ticket = require('../models/Ticket');

// ✅ Create a new ticket
const createTicket = async (req, res) => {
  try {
    const { title, description, priority } = req.body;

    const ticket = await Ticket.create({
      title,
      description,
      priority: priority?.toLowerCase(),
      createdBy: req.user._id,
    });

    res.status(201).json(ticket);
  } catch (err) {
    console.error('Ticket creation error:', err.message);
    res.status(500).json({ error: 'Failed to create ticket' });
  }
};

// ✅ Get all tickets created by logged-in user
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(tickets);
  } catch (err) {
    console.error('Fetch tickets error:', err.message);
    res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

// ✅ Update ticket status or priority
const updateTicketStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    if (ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { status, priority } = req.body;
    if (status) ticket.status = status.toLowerCase();
    if (priority) ticket.priority = priority.toLowerCase();

    await ticket.save();
    res.status(200).json(ticket);
  } catch (err) {
    console.error('Update status error:', err.message);
    res.status(500).json({ error: 'Failed to update ticket status' });
  }
};

// ✅ Edit ticket title, description, or priority
const editTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    if (ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    const { title, description, priority } = req.body;
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (priority) ticket.priority = priority.toLowerCase();

    await ticket.save();
    res.status(200).json(ticket);
  } catch (err) {
    console.error('Edit ticket error:', err.message);
    res.status(500).json({ error: 'Failed to update ticket' });
  }
};

// ✅ Delete a ticket
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });

    if (ticket.createdBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    await ticket.deleteOne(); // preferred over deprecated remove()
    res.status(200).json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    console.error('Delete ticket error:', err.message);
    res.status(500).json({ error: 'Failed to delete ticket' });
  }
};

module.exports = {
  createTicket,
  getTickets,
  updateTicketStatus,
  editTicket,
  deleteTicket,
};
