const oracledb = require('oracledb');

// Asegúrate de tener Oracle Instant Client instalado y configurado en tu sistema
// Establece las credenciales y la configuración de tu base de datos Oracle aquí
const poolConfig = {
    user: 'C##NODO', // Reemplaza 'usuario_oracle' con tu usuario real
    password: 'DATOS', // Reemplaza 'mi-contraseña-secreta' con tu contraseña real
    connectString: 'localhost:1521/XE', // Reemplaza 'localhost:1521/miBD' con tu cadena de conexión real
    poolMin: 10,
    poolMax: 10,
    poolIncrement: 0
};

// Crear el pool de conexiones
async function init() {
    try {
        await oracledb.createPool(poolConfig);
        console.log('Pool de conexiones creado');
    } catch (err) {
        console.error('Error al crear el pool de conexiones', err);
    }
}

// Función para realizar consultas
function q(sql, parameters) {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await oracledb.getConnection();
            const result = await connection.execute(sql, parameters, { outFormat: oracledb.OUT_FORMAT_OBJECT });
            await connection.commit();
            resolve(result);
        } catch (err) {
            reject(err);
        } finally {
            if (connection) {
                try {
                    await connection.close();
                } catch (err) {
                    console.error(err);
                }
            }
        }
    });
}

module.exports = {
    q,
    init // Asegúrate de llamar a init() al iniciar tu aplicación para crear el pool
};
