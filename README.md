# MiPortalEstudiantil

Plataforma web para la gestión de horarios, asignaturas y evaluaciones universitarias.

---

## Requisitos

- Node.js (v18 o superior)
- npm
- PostgreSQL
- pgAdmin 4 (opcional, para administrar la base de datos)

---

## Instalación paso a paso para usuarios nuevos

1. **Instala Node.js y npm**
   - Descarga desde [https://nodejs.org/](https://nodejs.org/) (elige la versión LTS).
   - Instala y verifica en la terminal:
     ```sh
     node -v
     npm -v
     ```

2. **Instala PostgreSQL**
   - Descarga desde [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
   - Instala y recuerda el usuario, contraseña y puerto.

3. **Descarga este proyecto**
   - Descarga el ZIP o clona el repositorio:
     ```sh
     git clone <url-del-repo>
     cd proyecto-master
     ```

4. **Instala las dependencias**
   ```sh
   npm install
   ```

5. **Configura el archivo `.env`**
   - Crea un archivo `.env` en la raíz del proyecto con este contenido (ajusta los datos según tu instalación):
     ```
     DB_HOST=localhost
     DB_PORT=5432
     DB_NAME=proyectoful
     DB_USER=postgres
     DB_PASSWORD=tu_password
     SESSION_SECRET=unsecretoseguro
     JWT_SECRET=miSuperClaveSecreta2024!$%&/()
     ```

6. **Crea la base de datos y restaura el backup**
   - Abre pgAdmin 4 o usa la terminal de PostgreSQL.
   - Crea la base de datos:
     ```sql
     CREATE DATABASE proyectoful;
     ```
   - Restaura el backup:
     - En pgAdmin, clic derecho sobre la base de datos → Restore...
     - Selecciona el archivo `.backup`, `.tar` o `.sql` que te entregaron.

7. **Inicia el servidor**
   ```sh
   node index.js
   ```

8. **Abre la aplicación**
   - Ve a [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## Notas

- Si tienes problemas con la base de datos, revisa la configuración en `.env`.
- Si necesitas datos de ejemplo, pide el archivo de backup a tu compañero.
- Puedes modificar los estilos en la carpeta `public/css`.

---

## Estructura del proyecto

- `/controllers` — Lógica de negocio y conexión a la base de datos
- `/routes` — Definición de rutas de la app
- `/views` — Plantillas Handlebars para la interfaz
- `/public` — Archivos estáticos (CSS, imágenes)
- `/db` — Conexión a la base de datos

---

## Créditos

Desarrollado por GRUPO 1