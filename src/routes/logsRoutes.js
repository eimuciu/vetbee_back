const express = require('express');
const mysql = require('mysql2/promise');
const { dbConfig } = require('../config');

const logsRoutes = express.Router();

logsRoutes.get('/:petId', async (req, res) => {
  let connection;
  const { petId } = req.params;
  const petIdEscape = mysql.escape(petId);
  try {
    connection = await mysql.createConnection(dbConfig);
    const query = `SELECT * FROM logs LEFT JOIN pets ON pet_id=pets.id WHERE pet_id=${petIdEscape}`;
    const [data] = await connection.query(query);
    res.json(data);
  } catch (error) {
    console.log('error === in get logs', error);
    res.status(500).json('something went wrong');
  } finally {
    connection?.end();
  }
});

logsRoutes.post('/createTable', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const query =
      'CREATE TABLE logs(id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, pet_id INT, description TEXT, status TEXT)';
    const [data] = await connection.query(query);
    res.json(data);
  } catch (error) {
    console.log('error === in logs /createTable', error);
    res.status(500).json('something went wrong');
  } finally {
    connection?.end();
  }
});

logsRoutes.post('/insert', async (req, res) => {
  const { pet_id, description, status } = req.body;
  if (!pet_id || !description || !status) {
    res.json('all fields required');
    return;
  }
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const query = 'INSERT INTO logs(pet_id, description, status) VALUES(?,?,?)';
    const [data] = await connection.execute(query, [pet_id, description, status]);
    res.json(data);
  } catch (error) {
    console.log('error === in post logs', error);
    res.status(500).json('something went wrong');
  } finally {
    connection?.end();
  }
});

module.exports = logsRoutes;
