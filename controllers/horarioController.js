const pool = require('../db/db');
const { DateTime } = require('luxon');

function getDiasSemana(fechaBase) {
  const diasNombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
  // Asegura que fechaBase sea válida
  let base = new Date(fechaBase);
  if (isNaN(base.getTime())) base = new Date();
  // Calcula el lunes de la semana
  base.setDate(base.getDate() - ((base.getDay() + 6) % 7));
  const dias = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(base);
    d.setDate(base.getDate() + i);
    // Ajusta a zona horaria local igual que en evaluaciones
    const fechaLocal = new Date(d.getTime() - (d.getTimezoneOffset() * 60000));
    dias.push({
      nombre: diasNombres[i],
      fecha: fechaLocal.toISOString().slice(0, 10),
      label: `${diasNombres[i]} ${fechaLocal.getDate()}/${fechaLocal.getMonth() + 1}`
    });
  }
  return dias;
}

const mostrarHorarioDiario = async (req, res) => {
  try {
    const bloques = [
      '08:30 - 09:50',
      '10:00 - 11:20',
      '11:30 - 12:50',
      '13:00 - 14:20',
      '14:30 - 15:50',
      '16:00 - 17:20',
      '17:30 - 18:50'
    ];

    const semanaBase = req.query.semana ? new Date(req.query.semana) : new Date();
    const dias = getDiasSemana(semanaBase);

    // Consulta SIN la columna sala
    const result = await pool.query(`
      SELECT a.id, a.nombre, a.codigo, h.dia, 
        to_char(h.hora_inicio, 'HH24:MI') as hora_inicio, 
        to_char(h.hora_fin, 'HH24:MI') as hora_fin,
        u.username as profesor
      FROM inscripcion i
      JOIN asignatura a ON a.id = i.asignatura_id
      JOIN asignatura_horario h ON h.asignatura_id = a.id
      LEFT JOIN usuario u ON u.id = a.profesor_id AND u.role = 'profesor'
      WHERE i.usuario_id = $1
    `, [req.session.userId]);

    // Mapear días a nombres para comparación robusta
    const diasNombres = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];

    // Inicializar estructura de horario
    const horario = {};
    for (const bloque of bloques) {
      horario[bloque] = {};
      for (const dia of dias) {
        horario[bloque][dia.fecha] = null;
      }
    }

    // Llenar el horario con las asignaturas inscritas
    result.rows.forEach(asig => {
      const hora_inicio = asig.hora_inicio.padStart(5, '0');
      const hora_fin = asig.hora_fin.padStart(5, '0');
      const bloque = `${hora_inicio} - ${hora_fin}`;
      // Normalizar el nombre del día para evitar problemas de tildes
      const diaAsignatura = asig.dia.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      const diaObj = dias.find(d => 
        d.nombre.normalize('NFD').replace(/[\u0300-\u036f]/g, '') === diaAsignatura
      );
      if (diaObj && horario[bloque] && horario[bloque][diaObj.fecha] !== undefined) {
        horario[bloque][diaObj.fecha] = {
          nombre: asig.nombre,
          codigo: asig.codigo,
          profesor: asig.profesor || 'No asignado',
          id: asig.id // <-- ¡Esto es clave!
        };
      }
    });

    // Obtener evaluaciones de la base de datos
    const usuario_id = req.session.userId;
    const semanaInicio = dias[0].fecha;
    const semanaFin = dias[dias.length - 1].fecha;
    const evaluacionesRes = await pool.query(
      `SELECT * FROM evaluacion WHERE usuario_id = $1 AND fecha BETWEEN $2 AND $3`,
      [usuario_id, semanaInicio, semanaFin]
    );
    const evaluaciones = evaluacionesRes.rows;

    // Agrega esto para depurar:
    console.log('Evaluaciones encontradas:', evaluaciones);

    // Formatea la fecha para mostrarla legible
    evaluaciones.forEach(ev => {
      ev.asignatura_id = String(ev.asignatura_id);
      // Usa zona horaria de Chile
      const dt = DateTime.fromJSDate(new Date(ev.fecha), { zone: 'utc' }).setZone('America/Santiago');
      ev.fechaISO = dt.toISODate(); // YYYY-MM-DD en Chile
      ev.fechaString = dt.setLocale('es-CL').toLocaleString({ year: 'numeric', month: 'short', day: 'numeric' });
    });

    res.render('horario', {
      username: req.session.username,
      dias,
      bloques,
      horario,
      semanaBase: req.query.semana ? req.query.semana : dias[0].fecha,
      isDashboard: true,
      evaluaciones
    });
  } catch (err) {
    console.error('Error al mostrar horario diario:', err);
    res.render('horario', { username: req.session.username, dias: [], bloques: [], horario: {}, semanaBase: '', isDashboard: true });
  }
};

module.exports = { mostrarHorarioDiario };