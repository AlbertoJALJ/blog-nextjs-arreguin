import { getMarkdownFiles, getMarkdownFileContent } from "../../lib/blog";
import matter from "gray-matter";
import Link from "next/link";

interface BlogPost {
  slug: string;
  title: string;
  date: string;
}

export default async function Blog() {
  const files = getMarkdownFiles();
  const posts = files.map((fileName) => {
    const slug = fileName.replace(/\.md$/, "");
    const fileContent = getMarkdownFileContent(fileName);
    if (!fileContent) return null;
    const matterResult = matter(fileContent);
    return {
      slug,
      title: matterResult.data.title,
      date: matterResult.data.date,
    };
  });
  const allPosts = posts.filter((post) => post !== null) as BlogPost[];

  return (
    <div>
      <h1>Blog de la Banda</h1>
      <ul>
        {allPosts.map(({ slug, title, date }) => (
          <li key={slug}>
            <Link href={`/blog/${slug}`}>
              <h2>{title}</h2>
              <p>{date}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
