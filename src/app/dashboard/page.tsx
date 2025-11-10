"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { usePosts } from "@/hooks/use-posts";
import { useDebounce } from "@/hooks/use-debounce";
import { useInfiniteScroll } from "@/hooks/use-infinite-scroll";
import { toast } from "sonner";
import { Plus, Loader2, Search, Filter } from "lucide-react";
import { BlogCard } from "@/components/blog-card";

export default function DashboardPage() {
  const {
    posts,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    sortBy,
    setSearchQuery,
    setSortBy,
    loadMore,
    searchQuery,
    deletePost,
  } = usePosts();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const debouncedSearch = useDebounce(localSearchQuery, 300);

  const sentinelRef = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading: isLoadingMore,
  });

  useEffect(() => {
    setSearchQuery(debouncedSearch);
  }, [debouncedSearch, setSearchQuery]);

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;

    setDeletingId(id);
    try {
      await deletePost(id);
      toast.success("Post deleted successfully");
    } catch (error) {
      toast.error("Failed to delete post");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <div className="flex items-center flex-col md:flex-row gap-4 justify-between mb-6">
              <div>
                <h1 className="text-4xl font-bold mb-2">My Blog Posts</h1>
                <p className="text-muted-foreground">
                  Manage your content • {posts.length} posts
                </p>
              </div>
              <Link href="/dashboard/create">
                <Button size="md" icon={<Plus className="h-5 w-5" />}>
                  Create Post
                </Button>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search posts by title or content..."
                  value={localSearchQuery}
                  onChange={(e) => setLocalSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "newest" | "oldest" | "title")
                  }
                  className="h-10 px-3 rounded-md border border-input bg-background text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="title">Title (A-Z)</option>
                </select>
              </div>
            </div>
          </div>

          {isLoading && (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-3 text-muted-foreground">
                Loading posts...
              </span>
            </div>
          )}

          {error && (
            <div className="bg-destructive/10 border border-destructive text-destructive px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {!isLoading && !error && posts.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {searchQuery
                    ? "No posts match your search."
                    : "No posts yet. Create your first post!"}
                </p>
                <Link href="/dashboard/create">
                  <Button
                    size="md"
                    variant="primary"
                    icon={<Plus className="h-4 w-4" />}
                  >
                    Create Post
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard
                key={post.id}
                post={post}
                onDelete={handleDelete}
                isDeleting={deletingId === post.id}
              />
            ))}
          </div>

          {isLoadingMore && (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">
                Loading more...
              </span>
            </div>
          )}

          {hasMore && !isLoadingMore && (
            <div ref={sentinelRef} className="h-4" />
          )}

          {!hasMore && posts.length > 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              No more posts to load
            </p>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
