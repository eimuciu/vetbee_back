const express = require('express');
const mysql = require('mysql2/promise');
const { dbConfig } = require('../config');

const medicationRoutes = express.Router();

medicationRoutes.get('/', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const query = 'SELECT * FROM medications';
    const [data] = await connection.query(query);
    res.json(data);
  } catch (error) {
    console.log('error === in post create table', error);
    res.status(500).json('something went wrong');
  } finally {
    connection?.end();
  }
});

medicationRoutes.post('/createTable', async (req, res) => {
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const query =
      'CREATE TABLE medications (id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), description TEXT)';
    const [data] = await connection.query(query);
    res.json(data);
  } catch (error) {
    console.log('error === in post create table', error);
    res.status(500).json('something went wrong');
  } finally {
    connection?.end();
  }
});

medicationRoutes.post('/insert', async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    console.log('all good');
    res.json('all fields required');
    return;
  }
  let connection;
  try {
    connection = await mysql.createConnection(dbConfig);
    const query = 'INSERT INTO medications(name, description) VALUES(?, ?)';
    const [data] = await connection.execute(query, [name, description]);
    res.json(data);
  } catch (error) {
    console.log('error === in post create table', error);
    res.status(500).json('something went wrong');
  } finally {
    connection?.end();
  }
});

module.exports = medicationRoutes;
