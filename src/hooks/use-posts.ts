import { useEffect } from "react";
import { usePostsStore } from "@/store/post-store";

export const usePosts = () => {
  const posts = usePostsStore((s) => s.posts);
  const isLoading = usePostsStore((s) => s.isLoading);
  const isLoadingMore = usePostsStore((s) => s.isLoadingMore);
  const error = usePostsStore((s) => s.error);
  const hasMore = usePostsStore((s) => s.hasMore);
  const searchQuery = usePostsStore((s) => s.searchQuery);
  const sortBy = usePostsStore((s) => s.sortBy);
  const initialized = usePostsStore((s) => s.initialized);
  
  const fetchPosts = usePostsStore((s) => s.fetchPosts);
  const loadMore = usePostsStore((s) => s.loadMore);
  const createPost = usePostsStore((s) => s.createPost);
  const updatePost = usePostsStore((s) => s.updatePost);
  const deletePost = usePostsStore((s) => s.deletePost);
  const getPostById = usePostsStore((s) => s.getPostById);
  const setSearchQuery = usePostsStore((s) => s.setSearchQuery);
  const setSortBy = usePostsStore((s) => s.setSortBy);

  // Only fetch once when not initialized
  useEffect(() => {
    if (!initialized) {
      fetchPosts();
    }
  }, [initialized, fetchPosts]);

  return {
    posts,
    isLoading,
    isLoadingMore,
    error,
    hasMore,
    searchQuery,
    sortBy,
    setSearchQuery,
    setSortBy,
    loadMore,
    createPost,
    updatePost,
    deletePost,
    getPostById,
  };
};