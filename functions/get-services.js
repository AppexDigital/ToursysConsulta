// functions/get-services.js
// Esta función se conecta a la API de Toursys para obtener la lista completa de productos/servicios.
// Poblará la vista del "Catálogo de Servicios".

const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    const USERNAME = process.env.TOURSYS_API_USER;
    const PASSWORD = process.env.TOURSYS_API_PASSWORD;
    // Asumiendo el endpoint de productos basado en la documentación.
    const API_URL = 'http://k8s-cloud1.toursys.net/api/v2/products';

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
                body: JSON.stringify({ error: `Error al obtener el catálogo de servicios: ${response.statusText}`, details: errorBody }),
            };
        }

        const data = await response.json();

        return {
            statusCode: 200,
            body: JSON.stringify(data),
        };

    } catch (error) {
        console.error("Error en la función get-services:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Error interno al obtener el catálogo de servicios.' }),
        };
    }
};

