const mongoose = require('mongoose');

const tareaSchema = new mongoose.Schema({
  texto: String,
  completada: Boolean
});

module.exports = mongoose.model('Tarea', tareaSchema);
