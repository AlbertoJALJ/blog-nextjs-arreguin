import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();
  console.log(title);

  if (!title || !content) {
    return NextResponse.json(
      { message: "Título y contenido son requeridos" },
      { status: 400 }
    );
  }

  const fileName = `${title.toLowerCase().replace(/\s+/g, "-")}.md`;
  const fileContent = `---
title: "${title}"
date: "${new Date().toISOString()}"
---

${content}`;

  try {
    const filePath = path.join(process.cwd(), "content", fileName);
    fs.writeFileSync(filePath, fileContent, "utf8");
    return NextResponse.json({ message: "Blog subido con éxito" });
  } catch (error) {
    console.error("Error al guardar el archivo:", error);
    return NextResponse.json(
      { message: "Error al guardar el archivo" },
      { status: 500 }
    );
  }
}
