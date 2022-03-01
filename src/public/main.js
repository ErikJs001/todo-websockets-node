
const noteForm = document.querySelector("#noteForm");
const title = document.querySelector('#title');
const description = document.querySelector("#description")

// Botón de submit
noteForm.addEventListener('submit', e => {

    // Evitamos que se reinicie la página
    e.preventDefault();

    if (noteID) {
        // Se actualiza la nota
        updateNote(noteID, title.value, description.value);

        noteID = "";
    }
    else {
        // Se añade la nota
        saveNote(title.value, description.value);   
    };

    title.value = '';
    description.value = '';

    title.focus();

});