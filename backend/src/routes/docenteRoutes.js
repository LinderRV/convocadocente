const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/auth');

// Placeholder para rutas de docentes
router.get('/', authenticate, async (req, res) => {
    res.json({
        success: true,
        message: 'Endpoint de docentes - En desarrollo',
        user: req.user
    });
});

module.exports = router;
