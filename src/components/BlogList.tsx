
import { useQuery } from "@tanstack/react-query";
import { fetchBlogPosts } from "@/services/github";
import { Link } from "react-router-dom";
import { Loading } from "./Loading";

export const BlogList = () => {
  const { data: posts, isLoading, error } = useQuery({
    queryKey: ["blog-posts"],
    queryFn: fetchBlogPosts,
  });

  if (isLoading) return <Loading />;

  if (error) return (
    <div className="p-4 text-red-500">
      Error loading blog posts. Please try again later.
    </div>
  );

  if (!posts?.length) return (
    <div className="p-4 text-gray-500">
      No blog posts found.
    </div>
  );

  return (
    <div className="space-y-8 max-w-2xl mx-auto p-4">
      {posts.map((post) => (
        <article key={post.sha} className="border-b border-gray-200 pb-8 last:border-0">
          <Link 
            to={`/post/${encodeURIComponent(post.path)}`}
            className="block space-y-2 hover:bg-gray-50 p-4 rounded-lg transition-colors"
          >
            <h2 className="text-2xl font-bold font-mono text-gray-900">
              {post.title}
            </h2>
            <time className="text-sm text-gray-500 font-mono">
              {new Date(post.date).toLocaleDateString()}
            </time>
          </Link>
        </article>
      ))}
    </div>
  );
};
