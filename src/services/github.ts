
import { Octokit } from "@octokit/rest";
import { marked } from "marked";
import { BlogPost, GitHubFile } from "@/types/blog";

const octokit = new Octokit();
const OWNER = "owickstrom";
const REPO = "the-monospace-web";
const CONTENT_PATH = "posts";

type GitHubContent = {
  type: "file";
  encoding: string;
  size: number;
  name: string;
  path: string;
  content: string;
  sha: string;
};

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    const { data: files } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: CONTENT_PATH,
    });

    if (!Array.isArray(files)) {
      throw new Error("Expected an array of files");
    }

    const posts = await Promise.all(
      (files as GitHubFile[])
        .filter((file) => file.name.endsWith(".md"))
        .map(async (file) => {
          const { data } = await octokit.repos.getContent({
            owner: OWNER,
            repo: REPO,
            path: file.path,
          });

          if (Array.isArray(data) || !('content' in data)) {
            throw new Error("Invalid file data");
          }

          const content = Buffer.from(data.content, "base64").toString();
          const [, frontMatter, markdown] = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) || [];
          
          const titleMatch = frontMatter?.match(/title:\s*(.+)/);
          const dateMatch = frontMatter?.match(/date:\s*(.+)/);

          const parsedContent = await Promise.resolve(marked.parse(markdown || content));

          return {
            title: titleMatch?.[1] || file.name,
            date: dateMatch?.[1] || "Unknown date",
            content: parsedContent,
            path: file.path,
            sha: file.sha,
          };
        })
    );

    return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

export async function fetchBlogPost(path: string): Promise<BlogPost | null> {
  try {
    const { data } = await octokit.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path,
    });

    if (Array.isArray(data) || !('content' in data)) {
      throw new Error("Invalid file data");
    }

    const content = Buffer.from(data.content, "base64").toString();
    const [, frontMatter, markdown] = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/) || [];
    
    const titleMatch = frontMatter?.match(/title:\s*(.+)/);
    const dateMatch = frontMatter?.match(/date:\s*(.+)/);

    const parsedContent = await Promise.resolve(marked.parse(markdown || content));

    return {
      title: titleMatch?.[1] || data.name,
      date: dateMatch?.[1] || "Unknown date",
      content: parsedContent,
      path: data.path,
      sha: data.sha,
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}
