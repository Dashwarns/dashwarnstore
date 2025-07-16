export const handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    const body = JSON.parse(event.body);
    const items = body.items;
    const kodeUnik = body.kodeUnik;

    console.log("ITEMS:", items);
    console.log("KODE UNIK:", kodeUnik);

    const tanggal = new Date().toISOString().split("T")[0];

    const rows = items.map((item) => [
      item.name,
      item.price,
      kodeUnik,
      "Pending",
      tanggal,
    ]);

    const payload = JSON.stringify({ data: rows });
    console.log("PAYLOAD:", payload);

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
    console.log("RESPONS DARI SCRIPT:", text);

    if (!text.includes("OK")) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          message: "Gagal mengirim ke Google Sheets",
          response: text,
        }),
      };
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
