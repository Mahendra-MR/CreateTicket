const Ticket = require('../models/Ticket');

// ✅ Create a ticket
const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      title: req.body.title,
      description: req.body.description,
      priority: req.body.priority.toLowerCase(), // enforce lowercase
      createdBy: req.user._id
    });
    res.status(201).json(ticket);
  } catch (err) {
    console.error('Ticket creation error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Get tickets for the logged-in user
const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ createdBy: req.user._id });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// ✅ Update ticket status or priority
const updateTicketStatus = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    if (ticket.createdBy.toString() !== req.user._id.toString())
      return res.status(401).json({ error: 'Not authorized' });

    // 👇 Convert inputs to lowercase
    if (req.body.status) ticket.status = req.body.status.toLowerCase();
    if (req.body.priority) ticket.priority = req.body.priority.toLowerCase();

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    console.error('Status update error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};
// DELETE a ticket
const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    if (ticket.createdBy.toString() !== req.user._id.toString())
      return res.status(401).json({ error: 'Not authorized' });

    await ticket.remove();
    res.json({ message: 'Ticket deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

// UPDATE ticket title/description/priority
const editTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    if (ticket.createdBy.toString() !== req.user._id.toString())
      return res.status(401).json({ error: 'Not authorized' });

    const { title, description, priority } = req.body;
    if (title) ticket.title = title;
    if (description) ticket.description = description;
    if (priority) ticket.priority = priority.toLowerCase();

    await ticket.save();
    res.json(ticket);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  createTicket,
  getTickets,
  updateTicketStatus,
  deleteTicket,
  editTicket,
};

