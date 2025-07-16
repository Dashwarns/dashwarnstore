exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Metode tidak diizinkan" };
  }

  try {
    const data = JSON.parse(event.body);
    const items = data.items;
    const kodeUnik = data.kodeUnik;
    const tanggal = new Date().toISOString().split("T")[0];

    if (!items || !Array.isArray(items)) {
      throw new Error("Data produk tidak valid.");
    }

    const rows = items.map(item => [
      item.name,
      item.price,
      kodeUnik,
      "Pending",
      tanggal
    ]);

    const body = JSON.stringify({ data: rows });

    const response = await fetch("https://script.google.com/macros/s/AKfycbwykj1f56R9J9J32Kjh3iFHbbjNPsHQs3GjYPX-q5ADUusOUnU5TYeapxqUXqLYzcY/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body
    });

    const text = await response.text();

    if (text.includes("OK")) {
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, kodeUnik })
      };
    } else {
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: "Google Script gagal merespons OK." })
      };
    }

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};
