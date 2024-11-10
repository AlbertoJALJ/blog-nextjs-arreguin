import { getMarkdownFileContent, getMarkdownFiles } from "../../../lib/blog";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

interface BlogPostProps {
  postData: {
    title: string;
    date: string;
    contentHtml: string;
  };
}

export async function generateStaticParams() {
  const files = getMarkdownFiles();
  return files.map((fileName) => ({ slug: fileName.replace(/\.md$/, "") }));
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const fileContent = getMarkdownFileContent(`${params.slug}.md`);

  if (!fileContent) {
    return {
      notFound: true,
    };
  }
  const matterResult = matter(fileContent);

  return {
    title: matterResult.data.title,
    description: matterResult.data.description || "",
  };
}

export async function getStaticProps({ params }: { params: { slug: string } }) {
  console.log("generateStaticProps params:", params);

  const fileContent = getMarkdownFileContent(`${params.slug}.md`);

  if (!fileContent) {
    return {
      props: {},
      notFound: true,
    };
  }
  const matterResult = matter(fileContent);
  const processedContent = await remark()
    .use(html)
    .process(matterResult.content);
  const contentHtml = processedContent.toString();

  return {
    props: {
      postData: {
        title: matterResult.data.title,
        date: matterResult.data.date,
        contentHtml,
      },
    },
  };
}

export default function BlogPost({ postData }: BlogPostProps) {
  console.log("postData", postData);

  // if (!postData) {
  //   console.log(postData);

  //   return <div>Post no encontrado</div>;
  // }
  return (
    <div>
      {/* <h1>{postData.title}</h1> */}
      {/* <p>{postData.date}</p> */}
      {/* <div dangerouslySetInnerHTML={{ __html: postData.contentHtml }} /> */}
    </div>
  );
}
