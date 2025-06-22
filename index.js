const path = require('path');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
require('dotenv').config();

const pool = require('./db/db');

const asignaturasRoutes = require('./routes/asignaturas');
const authRoutes = require('./routes/authRoutes');
const bloquesRoutes = require('./routes/bloques');
const dashboardRoutes = require('./routes/dashboard');
const horarioRoutes = require('./routes/horario');
const recordatorioRoutes = require('./routes/recordatorio');
const perfilRoutes = require('./routes/perfil');
const misAsignaturasRoutes = require('./routes/mis-asignaturas'); // <-- Agrega esta línea
const exphbs = require('express-handlebars');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar motor de vistas Handlebars con helpers eq, json y capitalize
const hbs = exphbs.create({
  extname: '.hbs',
  helpers: {
    eq: (a, b) => a === b,
    json: context => JSON.stringify(context, null, 2),
    capitalize: str => str ? str.charAt(0).toUpperCase() + str.slice(1) : '',
    hasEvaluacion: function(asigId, evaluaciones, options) {
      if (!evaluaciones) return '';
      return evaluaciones.some(e => String(e.asignatura_id) === String(asigId)) ? options.fn(this) : '';
    }
  },
  partialsDir: path.join(__dirname, 'views', 'partials')
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar sesión
app.use(session({
  secret: process.env.SESSION_SECRET || 'mi_clave_secreta',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 2 * 60 * 60 * 1000 } // 2 horas
}));

// Servir archivos estáticos desde 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Landing page (home)
app.get('/', (req, res) => {
  res.render('home', { title: 'Inicio', isHome: true });
});

// Rutas principales
app.use('/asignaturas', asignaturasRoutes);
app.use('/mis-asignaturas', misAsignaturasRoutes); // <-- Agrega esta línea
app.use('/dashboard', dashboardRoutes);
app.use('/recordatorio', recordatorioRoutes);
app.use('/perfil', perfilRoutes);
app.use('/auth', authRoutes);
app.use('/bloques', bloquesRoutes);
app.use('/horario', horarioRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});