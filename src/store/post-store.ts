import { create } from "zustand"

export interface Post {
  id: string
  title: string
  content: string
  excerpt: string
  author: string
  authorId: string
  category: string
  tags: string[]
  createdAt: string
  updatedAt: string
}

interface PostsState {
  posts: Post[]
  isLoading: boolean
  error: string | null
  currentPost: Post | null
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  fetchPosts: () => Promise<void>
  createPost: (post: Omit<Post, "id" | "createdAt" | "updatedAt">) => Promise<Post>
  updatePost: (id: string, post: Partial<Post>) => Promise<Post>
  deletePost: (id: string) => Promise<void>
  getPostById: (id: string) => Post | undefined
}

export const usePostsStore = create<PostsState>((set, get) => ({
  posts: [],
  isLoading: false,
  error: null,
  currentPost: null,

  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  fetchPosts: async () => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      const mockPosts: Post[] = [
        {
          id: "1",
          title: "Getting Started with Next.js",
          content: "<p>Next.js is a powerful React framework...</p>",
          excerpt: "Learn the basics of Next.js and start building modern web applications.",
          author: "John Doe",
          authorId: "user_1",
          category: "Tutorial",
          tags: ["nextjs", "react", "javascript"],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        },
      ]
      set({ posts: mockPosts, isLoading: false })
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to fetch posts",
        isLoading: false,
      })
    }
  },

  createPost: async (postData) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      const newPost: Post = {
        ...postData,
        id: `post_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      set((state) => ({
        posts: [newPost, ...state.posts],
        isLoading: false,
      }))
      return newPost
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to create post",
        isLoading: false,
      })
      throw error
    }
  },

  updatePost: async (id, updates) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      const updatedPost: Post = {
        ...get().posts.find((p) => p.id === id)!,
        ...updates,
        updatedAt: new Date().toISOString(),
      }
      set((state) => ({
        posts: state.posts.map((p) => (p.id === id ? updatedPost : p)),
        isLoading: false,
      }))
      return updatedPost
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to update post",
        isLoading: false,
      })
      throw error
    }
  },

  deletePost: async (id) => {
    set({ isLoading: true, error: null })
    try {
      await new Promise((resolve) => setTimeout(resolve, 600))
      set((state) => ({
        posts: state.posts.filter((p) => p.id !== id),
        isLoading: false,
      }))
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "Failed to delete post",
        isLoading: false,
      })
      throw error
    }
  },

  getPostById: (id) => get().posts.find((p) => p.id === id),
}))

export const usePosts = () => usePostsStore()
