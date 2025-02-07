import { apiBaseUrl } from "../baseUrls";

export async function GET() {
  const data = await fetch(`${apiBaseUrl}/disciplines`);
  return data;
}
