const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

// Configurar la conexión a la base de datos utilizando un pool de conexiones
const pool = mysql.createPool({
  host: 'mdb-test.c6vunyturrl6.us-west-1.rds.amazonaws.com',
  user: 'bsale_test',
  password: 'bsale_test',
  database: 'airline',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('Error al obtener la conexión de la base de datos:', err);
  } else {
    console.log('Conexión a la base de datos establecida');
  }
});

// Ruta para el endpoint /flights/:id/passengers
app.get('/flights/:id/passengers', (req, res) => {
  const flightId = req.params.id;

  // implementar la lógica para consultar la base de datos y realizar la simulación del check-in
  // Recuerda transformar los nombres de los campos de snake_case a camelCase

  // Ejemplo de respuesta de prueba
  const data = {
    flightId: flightId,
    takeoffDateTime: Date.now(),
    takeoffAirport: 'Aeropuerto Internacional Arturo Merino Benitez, Chile',
    landingDateTime: Date.now() + 3600000,
    landingAirport: 'Aeropuerto Internacional Jorge Chávez, Perú',
    airplaneId: 1,
    passengers: [
      {
        passengerId: 90,
        dni: 983834822,
        name: 'Marisol',
        age: 44,
        country: 'México',
        boardingPassId: 24,
        purchaseId: 47,
        seatTypeId: 1,
        seatId: 1,
      },
      // Otros pasajeros...
    ],
  };

  res.json({ code: 200, data });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
