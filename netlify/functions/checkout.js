const fetch = require("node-fetch");

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const data = JSON.parse(event.body);
    const url = "https://script.google.com/macros/s/AKfycbzC-zUWzo-pK8L7Ra9pnyuU1AoPUex-ZX3bK1VyGOewFn9VA1qG-bW1b4iXsjjTE3A/exec";

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const text = await response.text();
    return {
      statusCode: 200,
      body: text
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: `Error: ${error.message}`
    };
  }
};
