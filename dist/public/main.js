"use strict";

var noteForm = document.querySelector("#noteForm");
var title = document.querySelector('#title');
var description = document.querySelector("#description"); // Botón de submit

noteForm.addEventListener('submit', function (e) {
  // Evitamos que se reinicie la página
  e.preventDefault();

  if (noteID) {
    // Se actualiza la nota
    updateNote(noteID, title.value, description.value);
    noteID = "";
  } else {
    // Se añade la nota
    saveNote(title.value, description.value);
  }

  ;
  title.value = '';
  description.value = '';
  title.focus();
});