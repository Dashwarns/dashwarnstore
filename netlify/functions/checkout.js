// netlify/functions/checkout.js
const fetch = require('node-fetch');

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const body = JSON.parse(event.body);
    const items = body.items;
    const kodeUnik = body.kodeUnik;
    const tanggal = new Date().toISOString().split("T")[0];

    if (!items || !Array.isArray(items)) {
      return { statusCode: 400, body: "Invalid items format" };
    }

    // Buat baris-baris untuk dikirim ke Google Sheets
    const rows = items.map(item => [
      item.name,
      item.price,
      kodeUnik,
      "Pending",
      tanggal
    ]);

    const sheetPayload = JSON.stringify({ data: rows });

    const response = await fetch("https://script.google.com/macros/s/AKfycbyk5odODY7xZoS4yUHPvyQBdYBDWrqv2oTtk8zYeEFEwuYbV6YGofqoedVk6fwdkHs/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: sheetPayload
    });

    const result = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, kodeUnik, sheetResponse: result })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};
