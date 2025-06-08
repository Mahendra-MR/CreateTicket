const express = require('express');
const {
  createTicket,
  getTickets,
  updateTicketStatus,
  editTicket,
  deleteTicket,
} = require('../controllers/ticketController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Routes for creating and fetching tickets
router
  .route('/')
  .post(protect, createTicket)  // Create a new ticket
  .get(protect, getTickets);    // Get all tickets for the user

// Routes for single ticket: update status, edit, delete
router
  .route('/:id')
  .put(protect, updateTicketStatus)  // Change only the status
  .patch(protect, editTicket)        // Edit title, description, priority
  .delete(protect, deleteTicket);    // Delete a ticket

module.exports = router;
