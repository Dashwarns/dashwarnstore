exports.handler = async function (event, context) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let data;

  try {
    data = JSON.parse(event.body);
  } catch (error) {
    return {
      statusCode: 400,
      body: "Invalid JSON",
    };
  }

  if (!data.items || !Array.isArray(data.items)) {
    return {
      statusCode: 400,
      body: "Missing or invalid 'items'",
    };
  }

  const items = data.items;
  const kodeUnik = data.kodeUnik || "UNKNOWN";
  const tanggal = new Date().toISOString().split("T")[0];

  const rows = items.map(item => [
    item.name,
    item.price,
    kodeUnik,
    "Pending",
    tanggal,
  ]);

  const body = JSON.stringify({ data: rows });

  try {
    const response = await fetch("https://script.google.com/macros/s/AKfycbyk5odODY7xZoS4yUHPvyQBdYBDWrqv2oTtk8zYeEFEwuYbV6YGofqoedVk6fwdkHs/exec", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });

    const text = await response.text();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, kodeUnik }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};
