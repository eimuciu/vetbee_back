const mysql = require('mysql2/promise');
const router = require('express').Router();

const { dbConfig } = require('../config');

router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const escapedid = mysql.escape(id);
  try {
    const conn = await mysql.createConnection(dbConfig);
    // eslint-disable-next-line operator-linebreak
    const query = `SELECT pets.name AS petName, pets.dob AS petDOB, pets.client_email AS client_email, medications.name AS medication, medications.description AS medicationDescription, prescriptions.comment AS prescription FROM prescriptions INNER JOIN medications ON prescriptions.medication_id=medications.id INNER JOIN pets ON prescriptions.pet_id=pets.id WHERE pet_id=${escapedid}`;
    const [data] = await conn.query(query);
    res.status(200).json(data);
    await conn.end();
  } catch (err) {
    console.log('prescriptions get route error', err);
    res.status(500).json('something went wrong');
  }
});

router.post('/', async (req, res) => {
  const { medicationId, petId, comment } = req.body;
  const escapedvalues = [
    mysql.escape(medicationId),
    mysql.escape(petId),
    mysql.escape(comment),
  ];
  try {
    const conn = await mysql.createConnection(dbConfig);
    // eslint-disable-next-line operator-linebreak
    const query = `INSERT INTO prescriptions(medication_id, pet_id, comment) VALUES(${escapedvalues.toString()})`;
    const [data] = await conn.query(query);
    res.status(200).json(data);
    await conn.end();
  } catch (err) {
    console.log('prescriptions post route error', err);
    res.status(500).json('something went wrong');
  }
});

module.exports = { prescriptionsRoutes: router };
