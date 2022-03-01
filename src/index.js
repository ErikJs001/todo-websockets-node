import http from 'http';

import express from 'express';
import { Server as WebSocketServer } from 'socket.io';
import { v4 as uuid } from 'uuid';

// Arreglos de todas las notas
let notes = []

const app = express();
// devolvemos el módulo http como un servidor
const server = http.createServer(app);
const io = new WebSocketServer(server);

// Le mandamos toda la carpeta public para que cargue automaticamente las rutas
app.use(express.static(__dirname + '/public'));

// Si detectamos una nueva conexión
io.on('connection', (socket) => {
    console.log('Nueva conexión:', socket.id);

    socket.emit('server:load-notes', notes);

    // Recibimos la nota y la añadimos al arreglo
    socket.on('client:new-note', (newNote) => {
        const note = { ...newNote, id: uuid() };
        console.log(note);
        notes.push( note )

        // Mandamos la nota al cliente
        io.emit('server:send-note', note);
    });

    // Para borrar
    socket.on('client:delete-note', id => {
        // Recorremos y devolvemos un arreglo sin la coincidencia
        notes = notes.filter(note => note.id !== id);

        // Recargamos las notas
        io.emit('server:load-notes', notes);
    });

    // Para actualizar las notas
    socket.on('client:get-note', id => {
        const note = notes.find(note => note.id === id);
        socket.emit('server:selected-note', note);
    });

    socket.on('client:update-note', updatedNote => {
        notes = notes.map(note => {
            if (note.id === updatedNote.id) {
                note.title = updatedNote.title;
                note.description = updatedNote.description;
            }

            return note;
        });

        // Recargamos las notas
        io.emit('server:load-notes', notes);
    });

})

/* == NOTAS ==*/
/* 
    Cuando cargamos la página, se genera una sesión distinta con websockets
    Podemos diferenciarlos con el id, o en código: socket.id
    El io manda el emit a todos los clientes y el socket solo a su cliente
*/

server.listen(3000);
console.log('Server on port:', 3000);