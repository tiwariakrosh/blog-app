"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ProtectedRoute } from "@/components/protected-route";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { TiptapEditor } from "@/components/tiptap-editor";
import { usePosts } from "@/hooks/use-posts";
import { useAuth } from "@/hooks/use-auth";

export default function CreatePostPage() {
  const router = useRouter();
  const { createPost, isLoading: storeLoading } = usePosts();
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
    tags: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    excerpt: "",
    content: "",
    category: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Tutorial", "News", "Tips", "Review", "Other"];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleContentChange = (content: string) => {
    setFormData((prev) => ({ ...prev, content }));
    if (errors.content) setErrors((prev) => ({ ...prev, content: "" }));
  };

  const validateForm = () => {
    const newErrors = { title: "", excerpt: "", content: "", category: "" };
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formData.excerpt.trim()) {
      newErrors.excerpt = "Excerpt is required";
      isValid = false;
    }

    if (!formData.content.trim()) {
      newErrors.content = "Content is required";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);
    const toastId = toast.loading("Creating post...");

    try {
      const tags = formData.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await createPost({
        title: formData.title,
        excerpt: formData.excerpt,
        content: formData.content,
        category: formData.category,
        tags,
        author: user?.name || "Anonymous",
        authorId: user?.id || "",
      });

      toast.success("Post created successfully!", { id: toastId });
      router.push("/dashboard");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to create post";
      toast.error(message, { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isLoading = storeLoading || isSubmitting;

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

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Post Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter post title"
              error={errors.title}
              disabled={isLoading}
            />
            <Select
              label="Category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              options={categories.map((cat) => ({ value: cat, label: cat }))}
              error={errors.category}
              disabled={isLoading}
            />
          </div>

          <Textarea
            label="Excerpt"
            name="excerpt"
            value={formData.excerpt}
            onChange={handleChange}
            placeholder="Brief summary of your post"
            error={errors.excerpt}
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
            {errors.content && (
              <p className="text-sm text-destructive mt-1">{errors.content}</p>
            )}
          </div>

          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" isLoading={isLoading}>
              Publish Post
            </Button>
          </div>
        </form>
      </main>
    </ProtectedRoute>
  );
}
