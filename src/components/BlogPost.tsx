
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPost } from "@/services/github";
import { useParams, Link } from "react-router-dom";
import { Loading } from "./Loading";
import { ArrowLeft } from "lucide-react";

export const BlogPost = () => {
  const { path } = useParams<{ path: string }>();
  const decodedPath = decodeURIComponent(path || "");

  const { data: post, isLoading, error } = useQuery({
    queryKey: ["blog-post", decodedPath],
    queryFn: () => fetchBlogPost(decodedPath),
    enabled: !!decodedPath,
  });

  if (isLoading) return <Loading />;

  if (error || !post) return (
    <div className="p-4 text-red-500">
      Error loading blog post. Please try again later.
    </div>
  );

  return (
    <article className="max-w-2xl mx-auto p-4">
      <Link 
        to="/"
        className="inline-flex items-center space-x-2 text-blue-500 hover:text-blue-600 mb-8"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>Back to posts</span>
      </Link>

      <h1 className="text-3xl font-bold font-mono text-gray-900 mb-4">
        {post.title}
      </h1>
      
      <time className="block text-sm text-gray-500 font-mono mb-8">
        {new Date(post.date).toLocaleDateString()}
      </time>

      <div 
        className="prose prose-gray max-w-none font-mono"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />
    </article>
  );
};
