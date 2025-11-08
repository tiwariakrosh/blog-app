"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { TiptapEditor } from "@/components/tiptap-editor";
import { usePosts } from "@/store/post-store";

export default function CreatePostPage() {
  const router = useRouter();
  const { createPost, isLoading } = usePosts();
  const { user } = useAuth();
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
  });

  const categories = ["Tutorial", "News", "Tips", "Review", "Other"];

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

    if (!formData.category) {
      setError("Category is required");
      return;
    }

    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter((t) => t);

      await createPost({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags,
        author: user?.name || "Anonymous",
        authorId: user?.id || "",
      });

      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    }
  };

  return (
    <ProtectedRoute>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Create New Post
          </h1>
          <p className="text-muted-foreground mt-1">
            Share your thoughts with the world
          </p>
        </div>

        {/* {error && (
          <Alert variant="destructive" className="mb-6">
            {error}
          </Alert>
        )} */}

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
              placeholder="Start writing your post..."
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
              Publish Post
            </Button>
          </div>
        </form>
      </main>
    </ProtectedRoute>
  );
}
