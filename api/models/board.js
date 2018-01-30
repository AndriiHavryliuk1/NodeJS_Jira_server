const mongoose = require('mongoose');

const boardSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: String,
    column_ids: Array,
    ticket_ids: Array
});

module.exports = mongoose.model('Board', boardSchema);