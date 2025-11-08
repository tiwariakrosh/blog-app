import { useEffect } from 'react';
import { usePostStore, Post } from '@/store/post-store';

export const usePosts = () => {
  const { posts, loading, error, fetchPosts, addPost, updatePost, deletePost } = usePostStore();

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  return { posts, loading, error, addPost, updatePost, deletePost };
};