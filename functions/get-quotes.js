// functions/get-quotes.js
// Esta función se conecta a la API de Toursys para obtener la lista general de cotizaciones.
// Es el punto de entrada principal para la vista de cotizaciones.

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // Obtener las credenciales de forma segura desde las variables de entorno de Netlify.
    const USERNAME = process.env.TOURSYS_API_USER;
    const PASSWORD = process.env.TOURSYS_API_PASSWORD;
    const API_URL = 'http://k8s-cloud1.toursys.net/api/v2/quotes';

    // Verificación de seguridad: si las credenciales no están configuradas, la función falla.
    if (!USERNAME || !PASSWORD) {
        console.error("Error: Las variables de entorno de la API no están configuradas.");
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error de configuración del servidor. Contacte al administrador.' }),
        };
    }

    try {
        // Codificar las credenciales para la autenticación Básica.
        const credentials = Buffer.from(`${USERNAME}:${PASSWORD}`).toString('base64');

        const response = await fetch(API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Basic ${credentials}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.error(`Error de la API de Toursys: ${response.status} ${response.statusText}`, errorBody);
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Error al contactar la API de Toursys: ${response.statusText}` }),
            };
        }

        const data = await response.json();

        // Devolvemos una respuesta exitosa al frontend con los datos obtenidos.
        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("Error inesperado en la función serverless:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Ha ocurrido un error inesperado al procesar su solicitud.' }),
        };
    }
};
