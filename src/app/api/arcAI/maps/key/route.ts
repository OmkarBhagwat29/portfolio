export async function GET() {
  const apiKey = process.env.PRIVATE_MAP_API_KEY; // Safe to use only on the server
  console.log(apiKey);
  return Response.json({ key: apiKey });
}
