const pool = require('../db/db');
const bcrypt = require('bcrypt');

exports.verPerfil = async (req, res) => {
  const userId = req.session.userId;
  const userResult = await pool.query('SELECT username, email, role FROM usuario WHERE id = $1', [userId]);
  const asignaturasResult = await pool.query(`
    SELECT a.nombre, a.codigo
    FROM inscripcion i
    JOIN asignatura a ON a.id = i.asignatura_id
    WHERE i.usuario_id = $1
  `, [userId]);
  const usuario = userResult.rows[0];
  usuario.asignaturas = asignaturasResult.rows;
  res.render('perfil', { usuario, isDashboard: true });
};

exports.editarPerfilVista = async (req, res) => {
  const userId = req.session.userId;
  const userResult = await pool.query('SELECT username, email FROM usuario WHERE id = $1', [userId]);
  res.render('editarPerfil', { usuario: userResult.rows[0], isDashboard: true });
};

exports.editarPerfil = async (req, res) => {
  const userId = req.session.userId;
  const { username, email, password } = req.body;
  if (password && password.trim() !== '') {
    const hash = await bcrypt.hash(password, 10);
    await pool.query('UPDATE usuario SET username = $1, email = $2, password = $3 WHERE id = $4', [username, email, hash, userId]);
  } else {
    await pool.query('UPDATE usuario SET username = $1, email = $2 WHERE id = $3', [username, email, userId]);
  }
  req.session.username = username;
  res.redirect('/perfil');
};