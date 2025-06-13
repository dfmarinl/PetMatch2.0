const express = require('express');
const router = express.Router();
const { Pet } = require('../models');

// GET /api/pets
router.get('/', async (req, res) => {
  const pets = await Pet.findAll();
  res.json(pets);
});

module.exports = router;
