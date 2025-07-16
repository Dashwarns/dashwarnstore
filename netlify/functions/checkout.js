export const handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const { items, kodeUnik } = JSON.parse(event.body);
    const tanggal = new Date().toISOString().split("T")[0];

    const rows = items.map((item) => [
      item.name,
      item.price,
      kodeUnik,
      "Pending",
      tanggal,
    ]);

    const payload = JSON.stringify({ data: rows });

    const response = await fetch(
      "https://script.google.com/macros/s/AKfycbwykj1f56R9J9J32Kjh3iFHbbjNPsHQs3GjYPX-q5ADUusOUnU5TYeapxqUXqLYzcY/exec",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: payload,
      }
    );

    const text = await response.text();

    // Validasi manual respons dari Google Script
    if (!text.includes("OK")) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Gagal mengirim data ke Google Sheets",
          response: text,
        }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, kodeUnik }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: error.message }),
    };
  }
};
