const express = require('express');
const router = express.Router();
const { authenticate, authorize, optionalAuth } = require('../middleware/auth');

// Rutas públicas para convocatorias
router.get('/', optionalAuth, async (req, res) => {
    res.json({
        success: true,
        message: 'Endpoint de convocatorias - En desarrollo',
        user: req.user
    });
});

// Rutas protegidas
router.use(authenticate);

router.get('/:id', async (req, res) => {
    res.json({
        success: true,
        message: `Convocatoria ${req.params.id} - En desarrollo`
    });
});

router.post('/', authorize('admin', 'coordinador'), async (req, res) => {
    res.json({
        success: true,
        message: 'Crear convocatoria - En desarrollo'
    });
});

module.exports = router;
