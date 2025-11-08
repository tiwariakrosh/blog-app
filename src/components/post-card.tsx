import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Calendar, Loader2, Pencil, Trash2 } from "lucide-react";

interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
}

interface PostCardProps {
  post: Post;
}
export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const format = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {};
    return new Intl.DateTimeFormat("en-US", options).format(date);
  };

  const handleDelete = (id: number) => {
    console.log("Delete post with id:", id);
  };

  const [deletingId, setDeletingId] = React.useState<number | null>(null);
  return (
    <div
      key={post.id}
      className="bg-card border border-border rounded-lg p-6 hover:shadow-lg transition-shadow"
    >
      <h2 className="text-xl font-bold mb-3 line-clamp-2">{post.title}</h2>

      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <Calendar className="h-4 w-4" />
        {/* {format(new Date(post.createdAt), "MMM d, yyyy")} */}
      </div>

      <p className="text-muted-foreground mb-6 line-clamp-3">
        {post.description}
      </p>

      <div className="flex gap-2">
        <Link href={`/edit/${post.id}`} className="flex-1">
          <Button variant="secondary" className="w-full gap-2">
            <Pencil className="h-4 w-4" />
            Edit
          </Button>
        </Link>
        <Button
          variant="danger"
          onClick={() => handleDelete(post.id)}
          disabled={deletingId === post.id}
          className="gap-2"
        >
          {deletingId === post.id ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash2 className="h-4 w-4" />
          )}
          Delete
        </Button>
      </div>
    </div>
  );
};
