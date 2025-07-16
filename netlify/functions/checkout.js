exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Metode tidak diizinkan" };
  }

  const data = JSON.parse(event.body);
  const items = data.items;
  const kodeUnik = data.kodeUnik;
  const tanggal = new Date().toISOString().split("T")[0];

  const rows = items.map(item => [
    item.name,
    item.price,
    kodeUnik,
    "Pending",
    tanggal
  ]);

  const body = JSON.stringify({ data: rows });

  try {
    const response = await fetch("https://script.google.com/macros/s/PASTE-LINK-DARI-DEPLOY-DI-ATAS/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body
    });

    const text = await response.text();
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, kodeUnik })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message })
    };
  }
};
