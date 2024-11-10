import fs from "fs";
import path from "path";

const postsDirectory = path.join(process.cwd(), "content");

export function getMarkdownFiles(): string[] {
  return fs.readdirSync(postsDirectory).filter((file) => file.endsWith(".md"));
}

export function getMarkdownFileContent(fileName: string): string | null {
  const fullPath = path.join(postsDirectory, fileName);
  try {
    const fileContents = fs.readFileSync(fullPath, "utf8");
    return fileContents;
  } catch (error) {
    console.error("Error al obtener contenido del archivo:", error);
    return null;
  }
}
