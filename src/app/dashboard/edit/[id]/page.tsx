"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { LoadingSpinner } from "@/components/ui/loader";
import { usePosts } from "@/store/post-store";
import { TiptapEditor } from "@/components/tiptap-editor";
import { Alert } from "@/components/ui/alert";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.id as string;
  const { getPostById, updatePost, isLoading } = usePosts();
  const [error, setError] = useState("");
  const [pageLoading, setPageLoading] = useState(true);

  const post = getPostById(postId);

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
  });

  const categories = ["Tutorial", "News", "Tips", "Review", "Other"];

  useEffect(() => {
    if (post) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setFormData({
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        category: post.category,
        tags: post.tags.join(", "),
      });
    }
    setPageLoading(false);
  }, [post]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.title.trim()) {
      setError("Title is required");
      return;
    }

    if (!formData.excerpt.trim()) {
      setError("Excerpt is required");
      return;
    }

    if (!formData.content.trim()) {
      setError("Content is required");
      return;
    }

    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      await updatePost(postId, {
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags,
      });

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update post");
    }
  };

  if (pageLoading || !post) {
    return (
      <ProtectedRoute>
        <LoadingSpinner message="Loading post..." />
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Edit Post</h1>
          <p className="text-muted-foreground mt-1">Update your post details</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Post Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              disabled={isLoading}
            />
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories.map((cat) => ({ value: cat, label: cat }))}
              disabled={isLoading}
            />
          </div>

          <Textarea
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Brief summary of your post"
            disabled={isLoading}
            rows={3}
          />

          <Input
            label="Tags (comma-separated)"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            placeholder="e.g., nextjs, react, javascript"
            disabled={isLoading}
          />

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content
            </label>
            <TiptapEditor
              value={formData.content}
              onChange={handleContentChange}
              placeholder="Update your post content..."
              readOnly={isLoading}
            />
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" isLoading={isLoading}>
              Save Changes
            </Button>
          </div>
        </form>
      </main>
    </ProtectedRoute>
  );
}
