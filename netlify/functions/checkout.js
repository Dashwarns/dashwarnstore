exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed"
    };
  }

  try {
    const body = JSON.parse(event.body);
    const items = body.items;
    const kodeUnik = body.kodeUnik;

    console.log("ITEMS:", items);
    console.log("KODE UNIK:", kodeUnik);

    // Validasi data
    if (!items || !Array.isArray(items) || items.length === 0 || !kodeUnik) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: "Invalid input data" })
      };
    }

    const tanggal = new Date().toISOString().split("T")[0];

    // Susun data dalam format array untuk Google Sheets
    const rows = items.map(item => [
      item.name,
      item.price,
      kodeUnik,
      "Pending",
      tanggal
    ]);

    const response = await fetch("https://script.google.com/macros/s/AKfycbyk5odODY7xZoS4yUHPvyQBdYBDWrqv2oTtk8zYeEFEwuYbV6YGofqoedVk6fwdkHs/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ data: rows })
    });

    const resultText = await response.text();

    if (response.ok && resultText === "OK") {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, kodeUnik })
      };
    } else {
      return {
        statusCode: 502,
        body: JSON.stringify({ success: false, message: "Google Script failed", detail: resultText })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};
