"use strict";

// io() --> Devuelve la conexión al servidor
var socket = io();
/**
 * Save a new note
 * @param {string} title note title
 * @param {string} description note description
 */

var saveNote = function saveNote(title, description) {
  // Envíamos la nota
  socket.emit("client:new-note", {
    title: title,
    description: description
  });
};

var deleteNote = function deleteNote(id) {
  socket.emit("client:delete-note", id);
};

var getNote = function getNote(id) {
  socket.emit("client:get-note", id);
};
/**
 * Update a note
 * @param {string} id note id
 * @param {string} title note title
 * @param {string} description note description
 */


var updateNote = function updateNote(id, title, description) {
  socket.emit('client:update-note', {
    id: id,
    title: title,
    description: description
  });
}; // Recibimos la nota


socket.on("server:send-note", function (note) {
  appendNote(note);
}); // Cargamos las notas

socket.on("server:load-notes", renderNotes); // Para actualizar

socket.on("server:selected-note", function (note) {
  var title = document.querySelector("#title");
  var description = document.querySelector("#description");
  title.value = note.title;
  description.value = note.description;
  noteID = note.id;
});