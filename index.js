const express = require('express');
const mysql = require('mysql2');

const app = express();
const port = 3000;

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
  
    // Consultar la base de datos para obtener los datos de los pasajeros
    const query = `SELECT
      p.name,
      p.age,
      s.seat_column As seatColum,
      s.seat_row As seatRow,
      bp.purchase_id AS purchaseId,
      bp.seat_id AS seatId,
      bp.seat_type_id AS seatTypeId
    FROM
      passenger AS p
      INNER JOIN boarding_pass AS bp ON p.passenger_id = bp.passenger_id
      LEFT JOIN seat AS s ON bp.seat_id = s.seat_id
    WHERE
      bp.flight_id = ?`;
  
    pool.query(query, [flightId], (err, results) => {
      if (err) {
        console.error('Error al consultar la base de datos:', err);
        res.status(500).json({ code: 500, error: 'Internal Server Error' });
      } else if (results.length === 0) {
        res.status(404).json({ code: 404, data: {} });
      } else {
        results.forEach((row) => {
            console.log(`Nombre: ${row.name}, Edad: ${row.age}, ID de compra: ${row.purchaseId}, seatId: ${row.seatId !== null ? row.seatId : 'null'}, seatTypeId: ${row.seatTypeId}, seatColumn: ${row.seatColumn}, seatRow: ${row.seatRow}`);
        });
  
        res.json({ code: 200, data: results });
      }
    });
  });

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en ejecución en http://localhost:${port}`);
});
