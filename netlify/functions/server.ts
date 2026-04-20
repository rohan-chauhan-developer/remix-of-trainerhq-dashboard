// IMPORTANT: path based on your build output
import server from "../../dist/client/server/index.js";

export const handler = async (event, context) => {
    try {
        const response = await server.fetch(
            event.rawUrl,
            {
                method: event.httpMethod,
                headers: event.headers,
                body: event.body,
            }
        );

        const body = await response.text();

        return {
            statusCode: response.status,
            headers: Object.fromEntries(response.headers),
            body,
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: "Server error: " + error.message,
        };
    }
};