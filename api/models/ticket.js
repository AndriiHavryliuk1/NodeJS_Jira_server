const mongoose = require('mongoose');

const ticketSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, require: true },
    description: String,
    parent_id: mongoose.Schema.Types.ObjectId,
    children_ids: Array,
    user_id: mongoose.Schema.Types.ObjectId,
    column_id: mongoose.Schema.Types.ObjectId,
    status: String
});

module.exports = mongoose.model('Ticket', ticketSchema);