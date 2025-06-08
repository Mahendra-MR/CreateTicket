const express = require('express');
const {
  createTicket,
  getTickets,
  updateTicketStatus,
  editTicket,
  deleteTicket
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Create a new ticket & Get all tickets
router.route('/')
  .post(protect, createTicket)
  .get(protect, getTickets);

// Update status (PUT), edit details (PATCH), delete ticket (DELETE)
router.route('/:id')
  .put(protect, updateTicketStatus)   // Only for status change
  .patch(protect, editTicket)         // Edit title, description, priority
  .delete(protect, deleteTicket);     // Delete the ticket

module.exports = router;
