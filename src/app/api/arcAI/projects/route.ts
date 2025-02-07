import { apiBaseUrl } from "../baseUrls";

export async function GET() {
  const data = await fetch(`${apiBaseUrl}/projects`);
  return data;
}

export async function DELETE(req: Request) {
  const { id } = await req.json();

  if (!id) {
    return Response.json({ error: "ID is required" }, { status: 400 });
  }

  const res = await fetch(`${apiBaseUrl}/projects/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    return Response.json(
      { error: "Failed to delete project" },
      { status: res.status }
    );
  }

  return Response.json({ message: "Project deleted successfully" });
}

export async function POST(req: Request) {
  const data = await req.json();

  const res = await fetch(`${apiBaseUrl}/projects`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json", // Add this header for JSON content
    },
  });

  return res;
}

export async function PUT(req: Request) {
  const data = await req.json();
  const res = await fetch(`${apiBaseUrl}/projects/${data.id}`, {
    method: "PUT",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
  });

  return res;
}
