require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const mongoose = require('mongoose');
const Tarea = require('./models/Tarea');

const app = express();
const server = http.createServer(app);
const io = new Server(server);
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error de conexión:', err));

app.use(express.static('public'));

io.on('connection', async (socket) => {
    console.log('Cliente conectado');

    const tareas = await Tarea.find();
    socket.emit('tareasIniciales', tareas);

    socket.on('crearTarea', async (data) => {
        const nueva = new Tarea(data);
        await nueva.save();
        io.emit('tareaCreada', nueva);
    });

    socket.on('editarTarea', async (data) => {
        const actualizada = await Tarea.findByIdAndUpdate(data._id, data, { new: true });
        io.emit('tareaActualizada', actualizada);
    });

    socket.on('eliminarTarea', async (id) => {
        await Tarea.findByIdAndDelete(id);
        io.emit('tareaEliminada', id);
    });
});

server.listen(PORT, () => {
    console.log('Servidor corriendo en http://localhost:' + PORT);
});