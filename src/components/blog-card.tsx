"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import type { Post } from "@/types";
import { ConfirmDeleteDialog } from "@/components/confirm-dialog";

interface BlogCardProps {
  post: Post;
  onDelete: (id: string, title: string) => void;
  isDeleting?: boolean;
}

export function BlogCard({
  post,
  onDelete,
  isDeleting = false,
}: BlogCardProps) {
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const handleDelete = () => {
    onDelete(post.id, post.title);
    setShowDeleteDialog(false);
  };

  return (
    <>
      <Card
        className="hover:shadow-lg transition-shadow cursor-pointer"
        onClick={() => router.push(`/posts/${post.id}`)}
      >
        <CardContent className="p-6">
          <h2 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>

          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Calendar className="h-4 w-4" />
            {format(new Date(post.createdAt), "MMM d, yyyy")}
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded"
              >
                #{tag}
              </span>
            ))}
          </div>

          <p className="text-muted-foreground mb-6 line-clamp-3">
            {post.excerpt}
          </p>

          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Link href={`/dashboard/edit/${post.id}`} className="flex-1">
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                icon={<Pencil className="h-4 w-4" />}
              >
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              className="gap-2"
              icon={<Trash2 className="h-4 w-4" />}
              onClick={() => setShowDeleteDialog(true)}
              disabled={isDeleting}
            >
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="Delete Post"
        description={
          <>
            Are you sure you want to delete <strong>{post.title}</strong>? This
            action cannot be undone.
          </>
        }
        isLoading={isDeleting}
        onConfirm={handleDelete}
      />
    </>
  );
}
