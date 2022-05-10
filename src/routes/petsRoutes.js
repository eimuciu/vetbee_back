const router = require('express').Router();
const mysql = require('mysql2/promise');
const { dbConfig } = require('../config');

router.get('/', async (req, res) => {
  try {
    const conn = await mysql.createConnection(dbConfig);
    // eslint-disable-next-line operator-linebreak
    const query = 'SELECT * FROM pets WHERE archived = 0';
    const [data] = await conn.query(query);
    res.status(200).json(data);
    await conn.end();
  } catch (err) {
    console.log('createtable route error', err);
    res.status(500).json('something went wrong');
  }
});

router.post('/', async (req, res) => {
  const { name, dob, clientEmail } = req.body;
  const escapedvalues = [
    mysql.escape(name),
    mysql.escape(dob),
    mysql.escape(clientEmail),
  ];
  try {
    const conn = await mysql.createConnection(dbConfig);
    // eslint-disable-next-line operator-linebreak
    const query = `INSERT INTO pets(name, dob, client_email) VALUES(${escapedvalues.toString()})`;
    const [data] = await conn.query(query);
    res.status(200).json(data);
    await conn.end();
  } catch (err) {
    console.log('createtable route error', err);
    res.status(500).json('something went wrong');
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  const escapedid = mysql.escape(id);
  try {
    const conn = await mysql.createConnection(dbConfig);
    // eslint-disable-next-line operator-linebreak
    const query = `UPDATE pets SET archived=1 WHERE id=${escapedid}`;
    const [data] = await conn.query(query);
    res.status(200).json(data);
    await conn.end();
  } catch (err) {
    console.log('createtable route error', err);
    res.status(500).json('something went wrong');
  }
});

module.exports = { petsRoutes: router };
