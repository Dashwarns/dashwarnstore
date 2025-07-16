const fetch = require("node-fetch");

exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Metode tidak diizinkan",
    };
  }

  try {
    const data = JSON.parse(event.body);
    const items = data.items || [];
    const kodeUnik = data.kodeUnik || "TANPAKODE";
    const tanggal = new Date().toISOString().split("T")[0];

    if (!Array.isArray(items) || items.length === 0) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Data checkout kosong atau tidak valid." }),
      };
    }

    const rows = items.map((item) => [
      item.name,
      item.price,
      kodeUnik,
      "Pending",
      tanggal,
    ]);

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbyk5odODY7xZoS4yUHPvyQBdYBDWrqv2oTtk8zYeEFEwuYbV6YGofqoedVk6fwdkHs/exec",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: rows }),
      }
    );

    const text = await response.text();
    if (text !== "OK") {
      throw new Error("Gagal simpan ke Google Sheets: " + text);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, kodeUnik }),
    };
  } catch (error) {
    console.error("ERROR:", error.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
