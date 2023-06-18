const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;
let menores_edad = [];

// Configurar la conexión a la base de datos utilizando un pool de conexiones
const pool = mysql.createPool({
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'root1234',
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

  // Consultar la base de datos para obtener los datos de simulación del check-in
  const query = `SELECT
    f.flight_id AS flightId,
    f.takeoff_date_time AS takeoffDateTime,
    f.takeoff_airport AS takeoffAirport,
    f.landing_date_time AS landingDateTime,
    f.landing_airport AS landingAirport,
    f.airplane_id AS airplaneId,
    p.passenger_id AS passengerId,
    p.dni,
    p.name,
    p.age,
    p.country,
    bp.boarding_pass_id AS boardingPassId,
    bp.purchase_id AS purchaseId,
    bp.seat_type_id AS seatTypeId,
    bp.seat_id AS seatId
  FROM
    flight AS f
    INNER JOIN boarding_pass AS bp ON f.flight_id = bp.flight_id
    INNER JOIN passenger AS p ON bp.passenger_id = p.passenger_id
  WHERE
    f.flight_id = ?`;

  pool.query(query, [flightId], (err, results) => {
    if (err) {
      console.error('Error al consultar la base de datos:', err);
      res.status(500).json({ code: 500, error: 'Internal Server Error' });
    } else if (results.length === 0) {
      res.status(404).json({ code: 404, data: {} });
    } else {
      // Transformar los nombres de los campos de snake_case a camelCase
      const transformedResults = results.map((row) => {
        return {
          flightId: row.flightId,
          takeoffDateTime: row.takeoffDateTime,
          takeoffAirport: row.takeoffAirport,
          landingDateTime: row.landingDateTime,
          landingAirport: row.landingAirport,
          airplaneId: row.airplaneId,
          passengers: {
            passengerId: row.passengerId,
            dni: row.dni,
            name: row.name,
            age: row.age,
            country: row.country,
            boardingPassId: row.boardingPassId,
            purchaseId: row.purchaseId,
            seatTypeId: row.seatTypeId,
            seatId: row.seatId,
          },
        };
      });

      // Filtrar los pasajeros menores de edad
      menores_edad = transformedResults.filter(
        (pasajero) => pasajero.passengers.age == 10
      );



 // Agrupar los acompañantes mayores de edad
 const acompañantes = {};
 transformedResults.forEach((pasajero) => {
   const purchase_id = pasajero.passengers.purchaseId;
   if (pasajero.passengers.age >= 18) {
     if (!acompañantes[purchase_id]) {
       acompañantes[purchase_id] = [];
     }
     acompañantes[purchase_id].push(pasajero);
   }
 });

 // Asignar asientos a los pasajeros menores de edad
 menores_edad.forEach((pasajero) => {
   const purchase_id = pasajero.passengers.purchaseId;
   if (acompañantes[purchase_id]) {
     // Lógica de asignación de asientos cercanos para pasajeros menores
     // Utiliza la información de los acompañantes y asigna un asiento cercano
   }
 });

 // Asignar asientos a los pasajeros adultos
 transformedResults.forEach((pasajero) => {
   if (!menores_edad.includes(pasajero)) {
     // Lógica de asignación de asientos para pasajeros adultos
   }
 });

 // Actualizar los datos de asientos en la base de datos
 // Realiza las actualizaciones necesarias en la base de datos con los asientos asignados


      res.json({ code: 200, data: transformedResults });
    }
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
  console.log(menores_edad);
});
