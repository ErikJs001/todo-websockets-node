// io() --> Devuelve la conexión al servidor
const socket = io();

/**
 * Save a new note
 * @param {string} title note title
 * @param {string} description note description
 */

const saveNote = (title, description) => {
    // Envíamos la nota
    socket.emit("client:new-note", {
        title,
        description,
    });
};

const deleteNote = (id) => {
    socket.emit("client:delete-note", id);
};

const getNote = (id) => {
    socket.emit("client:get-note", id);
};


/**
 * Update a note
 * @param {string} id note id
 * @param {string} title note title
 * @param {string} description note description
 */
const updateNote = (id, title, description) => { 
    socket.emit('client:update-note', {
        id,
        title, 
        description
    });
};

// Recibimos la nota
socket.on("server:send-note", (note) => {
    appendNote(note);
});

// Cargamos las notas
socket.on("server:load-notes", renderNotes);

// Para actualizar
socket.on("server:selected-note", (note) => {
    const title = document.querySelector("#title");
    const description = document.querySelector("#description");

    title.value = note.title;
    description.value = note.description;

    noteID = note.id;
});
