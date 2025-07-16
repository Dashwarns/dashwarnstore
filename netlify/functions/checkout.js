const fetch = require("node-fetch"); // Netlify environment sudah mendukung ini

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Metode tidak diizinkan" };
  }

  try {
    const bodyData = JSON.parse(event.body);
    const items = bodyData.items;
    const kodeUnik = bodyData.kodeUnik;
    const tanggal = new Date().toISOString().split("T")[0];

    const rows = items.map(item => [
      item.name,
      item.price,
      kodeUnik,
      "Pending",
      tanggal
    ]);

    const response = await fetch("https://script.google.com/macros/s/AKfycbwykj1f56R9J9J32Kjh3iFHbbjNPsHQs3GjYPX-q5ADUusOUnU5TYeapxqUXqLYzcY/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: rows })
    });

    const resultText = await response.text();

    if (resultText.includes("OK")) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, kodeUnik })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: resultText })
      };
    }
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};
