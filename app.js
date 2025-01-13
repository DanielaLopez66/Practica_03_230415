const express = require('express');
const session = require('express-session');

const app = express();

// Middleware para parsear los datos de los formularios
app.use(express.urlencoded({ extended: true }));

// Configuración de la sesión
app.use(session({
    secret: 'mi-clave-secreta', // Secreto para firmar la cookie de sesión
    resave: false,  // No resguardar la sesión si no ha sido modificada
    saveUninitialized: false,  // Guardar la sesión aunque no haya sido inicializada
    cookie: { secure: false }  // Usar secure:true solo si usas HTTPS
}));

// Ruta para mostrar la información de la sesión
app.get('/session', (req, res) => {
    if (req.session.username) {
        const sessionId = req.session.id;
        const createdAt = req.session.createdAt;
        req.session.lastAccess = new Date(); // Actualizamos el último acceso en el servidor
        const lastAccess = req.session.lastAccess;
        const username = req.session.username;

        // Calculamos el tiempo que lleva viendo la sesión (en segundos desde el último acceso)
        const viewingDuration = Math.floor((new Date() - lastAccess) / 1000);

        res.send(`
            <h1>Detalles de la sesión</h1>
            <p><strong>ID de sesión:</strong> ${sessionId}</p>
            <p><strong>Nombre de usuario:</strong> ${username}</p>
            <p><strong>Fecha de creación de la sesión:</strong> ${createdAt}</p>
            <p><strong>Último acceso:</strong> ${lastAccess}</p>
            <p><strong>Duración en la sesión (en segundos):</strong> <span id="viewing-time">${viewingDuration}</span></p>

            <script>
                // Función para actualizar el tiempo que lleva viendo la sesión
                let viewingTime = ${viewingDuration}; // Tiempo en segundos desde el último acceso

                function updateTime() {
                    viewingTime++;
                    document.getElementById('viewing-time').innerText = viewingTime;
                }

                // Actualizar el tiempo cada segundo
                setInterval(updateTime, 1000);
            </script>
        `);
    } else {
        // Si no hay nombre de usuario, pedimos que lo ingrese
        res.send(`
            <h1>Ingresa tu nombre</h1>
            <form action="/set-name" method="POST">
                <label for="username">Nombre de usuario:</label>
                <input type="text" id="username" name="username" required>
                <button type="submit">Guardar nombre</button>
            </form>
        `);
    }
});

// Ruta para guardar el nombre en la sesión
app.post('/set-name', (req, res) => {
    const { username } = req.body;
    req.session.username = username; // Guardamos el nombre en la sesión
    req.session.createdAt = new Date(); // Guardamos la fecha de creación de la sesión
    req.session.lastAccess = new Date(); // Establecemos el último acceso en el momento de creación
    res.redirect('/session'); // Redirigimos a la página de detalles de la sesión
});

// Ruta para cerrar la sesión
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.send('Error al cerrar sesión.');
        }
        res.send('<h1>Sesión cerrada exitosamente.</h1>');
    });
});

// Iniciar el servidor en el puerto 3000
app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000');
});
