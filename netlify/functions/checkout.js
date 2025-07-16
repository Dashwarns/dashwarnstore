exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const data = JSON.parse(event.body);
  const rows = data.items.map(item => [
    item.name,
    item.price,
    data.kodeUnik,
    "Pending",
    new Date().toISOString().split("T")[0]
  ]);

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbwykj1f56R9J9J32Kjh3iFHbbjNPsHQs3GjYPX-q5ADUusOUnU5TYeapxqUXqLYzcY/exec", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ data: rows })
    });

    const result = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, kodeUnik: data.kodeUnik })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};
