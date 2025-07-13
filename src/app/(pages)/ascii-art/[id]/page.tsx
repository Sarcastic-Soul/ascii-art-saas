import { db } from "@/db/drizzle";
import { asciiArt } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AsciiArtPage({ params }: Props) {
  const { id } = await params;
  const artId = Number(id);
  const result = await db
    .select()
    .from(asciiArt)
    .where(eq(asciiArt.id, artId))
    .limit(1);

  if (!result.length) return notFound();

  const art = result[0];

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-2xl font-bold mb-2">{art.imageName}</h1>
      <p className="text-xs text-gray-400 mb-6">
        {art.createdAt ? new Date(art.createdAt).toLocaleString() : "Unknown date"}
      </p>
      <div className="bg-zinc-900 p-4 rounded-lg overflow-x-auto text-sm whitespace-pre-wrap">
        <pre>{art.asciiText}</pre>
      </div>
    </div>
  );
}
