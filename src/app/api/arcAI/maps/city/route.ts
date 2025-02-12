export async function POST(req: Request) {
  try {
    const { city } = await req.json();
    console.log("city ->", city);
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${city}&limit=5`
    );

    if (res.ok) {
      const data = await res.json();

      //console.log(data);
      return new Response(JSON.stringify(data), { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching cities:", error);
  }
}
