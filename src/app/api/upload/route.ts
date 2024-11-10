import { NextRequest, NextResponse } from "next/server";
import { getMarkdownFileSignedUrl, s3Client } from "../../../lib/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";

export async function POST(req: NextRequest) {
  const { title, content } = await req.json();

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

  const params = {
    Bucket: process.env.AWS_S3_BUCKET!,
    Key: fileName,
    Body: fileContent,
    ContentType: "text/markdown",
  };

  try {
    const res = await s3Client.send(new PutObjectCommand(params));
    console.log(res);

    return NextResponse.json({ message: "Post subido con éxito" });
  } catch (error) {
    console.error("Error al subir archivo a S3:", error);
    return NextResponse.json(
      { message: "Error al subir archivo" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const fileName = searchParams.get("fileName");

  if (!fileName) {
    return NextResponse.json(
      { message: "Nombre del archivo es requerido" },
      { status: 400 }
    );
  }

  const signedUrl = await getMarkdownFileSignedUrl(fileName);
  if (!signedUrl) {
    return NextResponse.json(
      { message: "Error al generar la URL firmada" },
      { status: 500 }
    );
  }

  return NextResponse.json({ signedUrl });
}
