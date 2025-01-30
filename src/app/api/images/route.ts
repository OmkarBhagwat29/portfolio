// app/api/images/route.ts
import fs from 'fs';
import path from 'path';

export async function GET() {
  const directory = 'images/kia';
  const publicDirectory = path.join(process.cwd(), 'public', directory);

  try {
    const images = fs
      .readdirSync(publicDirectory)
      .filter((file) =>
        ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(file).toLowerCase())
      );

    return new Response(JSON.stringify(images), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: 'Failed to read image files' }),
      { status: 500 }
    );
  }
}
