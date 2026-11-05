// Uploaded article images: /media/{id}/{name}. Image MongoDB me hai (API), yahan se same domain par serve hoti hai
// taaki og:image, sitemap aur <img> sab apne domain ka URL use karein.
// Image kabhi badalti nahi (naya upload = naya id), isliye browser + CDN 1 saal tak cache karte hain.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string; name: string }> }) {
  const { id } = await params;
  const api = process.env.API_URL;
  if (!api || !/^[a-f0-9]{24}$/i.test(id)) return new Response("Not found", { status: 404 });

  const res = await fetch(`${api}/api/public/images/${id}`, { cache: "no-store" });
  if (!res.ok) return new Response("Not found", { status: 404 });

  const type = res.headers.get("content-type") ?? "application/octet-stream";
  const data = await res.arrayBuffer();
  return new Response(data, {
    headers: {
      "Content-Type": type,
      "Content-Length": String(data.byteLength),
      "Cache-Control": "public, max-age=31536000, s-maxage=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
      ...(type.includes("svg") ? { "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; img-src data:; sandbox" } : {}),
    },
  });
}
