import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Post } from "@/types";

interface PostsState {
  posts: Post[];
  allPosts: Post[];
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;
  hasMore: boolean;
  currentPage: number;
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'title';
  initialized: boolean;
  
  setLoading: (loading: boolean) => void;
  setLoadingMore: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sort: 'newest' | 'oldest' | 'title') => void;
  fetchPosts: () => Promise<void>;
  loadMore: () => void;
  createPost: (post: Omit<Post, "id" | "createdAt" | "updatedAt">) => Promise<Post>;
  updatePost: (id: string, post: Partial<Post>) => Promise<Post>;
  deletePost: (id: string) => Promise<void>;
  getPostById: (id: string) => Post | undefined;
  applyFilters: () => void;
}

const POSTS_PER_PAGE = 9;

const transformPost = (apiPost: any, existingPost?: Post): Post => {
  return {
    id: String(apiPost.id),
    title: apiPost.title,
    content: `<p>${apiPost.body}</p>`,
    excerpt: apiPost.body.substring(0, 100) + "...",
    author: existingPost?.author || "John Doe",
    authorId: existingPost?.authorId || "user_1",
    category: existingPost?.category || "Other",
    tags: existingPost?.tags || ["blog"],
    createdAt: existingPost?.createdAt || new Date().toISOString(),
    updatedAt: existingPost?.updatedAt || new Date().toISOString(),
  };
};

export const usePostsStore = create<PostsState>()(
  persist(
    (set, get) => ({
      posts: [],
      allPosts: [],
      isLoading: false,
      isLoadingMore: false,
      error: null,
      hasMore: true,
      currentPage: 1,
      searchQuery: '',
      sortBy: 'newest',
      initialized: false,

      setLoading: (loading) => set({ isLoading: loading }),
      setLoadingMore: (loading) => set({ isLoadingMore: loading }),
      setError: (error) => set({ error }),
      
      setSearchQuery: (query) => {
        set({ searchQuery: query, currentPage: 1 });
        get().applyFilters();
      },
      
      setSortBy: (sort) => {
        set({ sortBy: sort, currentPage: 1 });
        get().applyFilters();
      },

      applyFilters: () => {
        const { allPosts, searchQuery, sortBy, currentPage } = get();
        
        let filtered = allPosts.filter(post => {
          if (!searchQuery) return true;
          const query = searchQuery.toLowerCase();
          return (
            post.title.toLowerCase().includes(query) ||
            post.content.toLowerCase().includes(query) ||
            post.excerpt.toLowerCase().includes(query) ||
            post.tags.some(tag => tag.toLowerCase().includes(query))
          );
        });

        // Sort
        filtered = [...filtered].sort((a, b) => {
          switch (sortBy) {
            case 'newest':
              return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            case 'oldest':
              return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            case 'title':
              return a.title.localeCompare(b.title);
            default:
              return 0;
          }
        });

        // Paginate
        const paginatedPosts = filtered.slice(0, currentPage * POSTS_PER_PAGE);
        const hasMore = filtered.length > paginatedPosts.length;

        set({ posts: paginatedPosts, hasMore });
      },

      loadMore: () => {
        const { hasMore, isLoadingMore } = get();
        if (!hasMore || isLoadingMore) return;

        set({ isLoadingMore: true });
        
        // Simulate loading delay
        setTimeout(() => {
          set(state => ({ currentPage: state.currentPage + 1 }));
          get().applyFilters();
          set({ isLoadingMore: false });
        }, 500);
      },

      fetchPosts: async () => {
        const { initialized, allPosts } = get();
        if (initialized && allPosts.length > 0) return;
        
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("https://jsonplaceholder.typicode.com/posts");
          
          if (!response.ok) {
            throw new Error("Failed to fetch posts");
          }

          const apiPosts = await response.json();
          
          const posts: Post[] = apiPosts.map((apiPost: any) => 
            transformPost(apiPost)
          );
          
          set({ 
            allPosts: posts, 
            initialized: true,
            currentPage: 1 
          });
          
          get().applyFilters();
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : "Failed to fetch posts",
            isLoading: false,
          });
        }
      },

      createPost: async (postData) => {
        set({ isLoading: true, error: null });
        try {
          const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              title: postData.title,
              body: postData.content.replace(/<[^>]*>/g, ""),
              userId: 1,
            }),
          });

          if (!response.ok) {
            throw new Error("Failed to create post");
          }

          const newPost: Post = {
            ...postData,
            id: `local_${Date.now()}`,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            allPosts: [newPost, ...state.allPosts],
            isLoading: false,
          }));
          
          get().applyFilters();

          return newPost;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to create post";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      updatePost: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
          const post = get().allPosts.find((p) => p.id === id);
          if (!post) throw new Error("Post not found");

          if (!id.startsWith("local_")) {
            const response = await fetch(
              `https://jsonplaceholder.typicode.com/posts/${id}`,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: updates.title || post.title,
                  body: updates.content?.replace(/<[^>]*>/g, "") || post.content,
                  userId: 1,
                }),
              }
            );

            if (!response.ok) {
              throw new Error("Failed to update post");
            }
          }

          const updatedPost: Post = {
            ...post,
            ...updates,
            updatedAt: new Date().toISOString(),
          };

          set((state) => ({
            allPosts: state.allPosts.map((p) => (p.id === id ? updatedPost : p)),
            isLoading: false,
          }));
          
          get().applyFilters();

          return updatedPost;
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to update post";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      deletePost: async (id) => {
        set({ isLoading: true, error: null });
        try {
          if (!id.startsWith("local_")) {
            const response = await fetch(
              `https://jsonplaceholder.typicode.com/posts/${id}`,
              {
                method: "DELETE",
              }
            );

            if (!response.ok) {
              throw new Error("Failed to delete post");
            }
          }

          set((state) => ({
            allPosts: state.allPosts.filter((p) => p.id !== id),
            isLoading: false,
          }));
          
          get().applyFilters();
        } catch (error) {
          const message = error instanceof Error ? error.message : "Failed to delete post";
          set({ error: message, isLoading: false });
          throw new Error(message);
        }
      },

      getPostById: (id) => get().allPosts.find((p) => p.id === id),
    }),
    {
      name: "posts-storage",
      partialize: (state) => ({ 
        allPosts: state.allPosts, 
        initialized: state.initialized 
      }),
    }
  )
);