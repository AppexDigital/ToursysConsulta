// functions/get-quote-details.js
// Esta función obtiene los detalles de UNA cotización específica por su ID.
// Recibe el ID como un parámetro en la URL de la solicitud.

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // El ID de la cotización se pasa como un query parameter, ej: ?id=QT-12345
    const quoteId = event.queryStringParameters.id;

    if (!quoteId) {
        return {
            statusCode: 400,
            body: JSON.stringify({ error: 'No se proporcionó un ID de cotización.' }),
        };
    }

    const USERNAME = process.env.TOURSYS_API_USER;
    const PASSWORD = process.env.TOURSYS_API_PASSWORD;
    // El endpoint para una cotización específica suele incluir el ID en la ruta.
    const API_URL = `http://k8s-cloud1.toursys.net/api/v2/quotes/${quoteId}`;

    if (!USERNAME || !PASSWORD) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error de configuración del servidor.' }),
        };
    }

    try {
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
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: `Error de la API de Toursys para el ID ${quoteId}: ${response.statusText}`, details: errorBody }),
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error(`Error en la función get-quote-details para el ID ${quoteId}:`, error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno al obtener los detalles de la cotización.' }),
        };
    }
};

