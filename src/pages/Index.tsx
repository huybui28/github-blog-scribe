
import { BlogList } from "@/components/BlogList";

const Index = () => {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b border-gray-200 mb-8">
        <div className="max-w-2xl mx-auto p-4">
          <h1 className="text-4xl font-bold font-mono text-gray-900">
            The Monospace Blog
          </h1>
        </div>
      </header>
      <main>
        <BlogList />
      </main>
    </div>
  );
};

export default Index;
