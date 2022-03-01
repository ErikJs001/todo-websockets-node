"use strict";

var _http = _interopRequireDefault(require("http"));

var _express = _interopRequireDefault(require("express"));

var _socket = require("socket.io");

var _uuid = require("uuid");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); enumerableOnly && (symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; })), keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = null != arguments[i] ? arguments[i] : {}; i % 2 ? ownKeys(Object(source), !0).forEach(function (key) { _defineProperty(target, key, source[key]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)) : ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Arreglos de todas las notas
var notes = [];
var app = (0, _express["default"])(); // devolvemos el módulo http como un servidor

var server = _http["default"].createServer(app);

var io = new _socket.Server(server); // Le mandamos toda la carpeta public para que cargue automaticamente las rutas

app.use(_express["default"]["static"](__dirname + '/public')); // Si detectamos una nueva conexión

io.on('connection', function (socket) {
  console.log('Nueva conexión:', socket.id);
  socket.emit('server:load-notes', notes); // Recibimos la nota y la añadimos al arreglo

  socket.on('client:new-note', function (newNote) {
    var note = _objectSpread(_objectSpread({}, newNote), {}, {
      id: (0, _uuid.v4)()
    });

    console.log(note);
    notes.push(note); // Mandamos la nota al cliente

    io.emit('server:send-note', note);
  }); // Para borrar

  socket.on('client:delete-note', function (id) {
    // Recorremos y devolvemos un arreglo sin la coincidencia
    notes = notes.filter(function (note) {
      return note.id !== id;
    }); // Recargamos las notas

    io.emit('server:load-notes', notes);
  }); // Para actualizar las notas

  socket.on('client:get-note', function (id) {
    var note = notes.find(function (note) {
      return note.id === id;
    });
    socket.emit('server:selected-note', note);
  });
  socket.on('client:update-note', function (updatedNote) {
    notes = notes.map(function (note) {
      if (note.id === updatedNote.id) {
        note.title = updatedNote.title;
        note.description = updatedNote.description;
      }

      return note;
    }); // Recargamos las notas

    io.emit('server:load-notes', notes);
  });
});
/* == NOTAS ==*/

/* 
    Cuando cargamos la página, se genera una sesión distinta con websockets
    Podemos diferenciarlos con el id, o en código: socket.id
    El io manda el emit a todos los clientes y el socket solo a su cliente
*/

server.listen(3000);
console.log('Server on port:', 3000);