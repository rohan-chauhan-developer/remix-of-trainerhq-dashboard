import server from "../../dist/client/server/index.js";

export const handler = async (event: any, context: any) => {
  try {
    const request = new Request(event.rawUrl, {
      method: event.httpMethod,
      headers: event.headers,
      body: event.body,
    });

    const response = await server.fetch(request);
    const body = await response.text();

    return {
      statusCode: response.status,
      headers: Object.fromEntries(response.headers),
      body,
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: "Server error: " + (error as any).message,
    };
  }
};