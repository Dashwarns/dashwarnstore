// .netlify/functions/checkout.js
const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const body = JSON.parse(event.body);
    const items = body.items;
    const kodeUnik = body.kodeUnik || "UNKNOWN";
    const tanggal = new Date().toISOString().split("T")[0];

    if (!Array.isArray(items)) {
      throw new Error("Items tidak valid atau kosong.");
    }

    const rows = items.map(item => [
      item.name,
      item.price,
      kodeUnik,
      "Pending",
      tanggal
    ]);

    const response = await fetch("https://script.google.com/macros/s/AKfycbyk5odODY7xZoS4yUHPvyQBdYBDWrqv2oTtk8zYeEFEwuYbV6YGofqoedVk6fwdkHs/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: rows })
    });

    const resultText = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        message: "Berhasil dikirim ke Google Sheets",
        kodeUnik,
        result: resultText
      })
    };

  } catch (err) {
    console.error("ERROR:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: err.message })
    };
  }
};
