const express = require('express');
const router = express.Router();
const perfilController = require('../controllers/perfilController');

router.get('/', perfilController.verPerfil);
router.get('/editar', perfilController.editarPerfilVista); // <--- ESTA LÍNEA ES CLAVE
router.post('/editar', perfilController.editarPerfil);

module.exports = router;