import { Blog } from '@/types/blog'
import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { addTagToBlog, createBlog, createCategory, deleteBlog, deleteCategory, fetchBlogs, fetchCategories, removeTagFromBlog, updateBlogStatus } from '../thunks'

interface Category {
    id: string
    name: string
    userId: string
}

// Blog State Interface
interface BlogState {
    // Blog Management
    blogs: Blog[]
    filteredBlogs: Blog[]
    currentBlog: Blog | null

    // Categories
    categories: Category[]

    // UI State
    isLoading: boolean
    isCategoryLoading: boolean
    isTagLoading: boolean
    error: string | null
    categoryError: string | null
    tagError: string | null

    // Filters
    selectedCategories: string[]
    selectedTags: string[]
    searchQuery: string
    showOnlyUnread: boolean
}

const initialState: BlogState = {
    // Blog Management
    blogs: [],
    filteredBlogs: [],
    currentBlog: null,

    // Categories
    categories: [],

    // UI State
    isLoading: false,
    isCategoryLoading: false,
    isTagLoading: false,
    error: null,
    categoryError: null,
    tagError: null,

    // Filters
    selectedCategories: [],
    selectedTags: [],
    searchQuery: '',
    showOnlyUnread: false,
}
// Helper function to apply filters
const applyFilters = (
    blogs: Blog[],
    filters: {
        selectedCategories: string[]
        selectedTags: string[]
        searchQuery: string
        showOnlyUnread: boolean
    }
): Blog[] => {
    return blogs.filter(blog => {
        // Category filter
        const matchesCategory =
            filters.selectedCategories.length === 0 ||
            blog.categories.some(cat =>
                filters.selectedCategories.includes(cat.name)
            )
        console.log("matchesCategory", matchesCategory);


        // Tag filter
        const matchesTag =
            filters.selectedTags.length === 0 ||
            blog.tags.some(tag =>
                filters.selectedTags.includes(tag.name)
            )

        // Search filter
        const matchesSearch =
            filters.searchQuery === '' ||
            blog.title?.toLowerCase().includes(filters.searchQuery.toLowerCase()) ||
            blog.url.toLowerCase().includes(filters.searchQuery.toLowerCase())

        // Read status filter
        const matchesReadStatus =
            !filters.showOnlyUnread || !blog.isRead

        return matchesCategory && matchesTag && matchesSearch && matchesReadStatus
    })
}

const BlogSlice = createSlice({
    name: "blogs",
    initialState,
    reducers: {
        //filter actions
        setSelectedCategories: (state, action: PayloadAction<string[]>) => {
            state.selectedCategories = action.payload
            state.filteredBlogs = applyFilters(state.blogs, {
                selectedCategories: action.payload,
                selectedTags: state.selectedTags,
                searchQuery: state.searchQuery,
                showOnlyUnread: state.showOnlyUnread
            })
        },
        setSelectedTags: (state, action: PayloadAction<string[]>) => {
            state.selectedTags = action.payload
            state.filteredBlogs = applyFilters(state.blogs, {
                selectedCategories: state.selectedCategories,
                selectedTags: action.payload,
                searchQuery: state.searchQuery,
                showOnlyUnread: state.showOnlyUnread
            })
        },
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload
            state.filteredBlogs = applyFilters(state.blogs, {
                selectedCategories: state.selectedCategories,
                selectedTags: state.selectedTags,
                searchQuery: action.payload,
                showOnlyUnread: state.showOnlyUnread
            })
        },
        //   toggleShowOnlyUnread: (state) => {
        //     state.showOnlyUnread = !state.showOnlyUnread
        //     state.filteredBlogs = applyFilters(state.blogs, {
        //       selectedCategories: state.selectedCategories,
        //       selectedTags: state.selectedTags,
        //       searchQuery: state.searchQuery,
        //       showOnlyUnread: state.showOnlyUnread
        //     })
        //   },
        clearAllFilters: (state) => {
            state.selectedCategories = []
            state.selectedTags = []
            state.searchQuery = ''
            state.showOnlyUnread = false
            state.filteredBlogs = state.blogs
        },
        clearCurrentBlog: (state) => {
            state.currentBlog = null
        },
        clearError: (state) => {
            state.error = null
            state.categoryError = null
            state.tagError = null
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchBlogs.fulfilled, (state, action) => {
                state.isLoading = false
                state.blogs = action.payload
                state.filteredBlogs = applyFilters(action.payload, {
                    selectedCategories: state.selectedCategories,
                    selectedTags: state.selectedTags,
                    searchQuery: state.searchQuery,
                    showOnlyUnread: state.showOnlyUnread
                })
                state.error = null
            })
            .addCase(fetchBlogs.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })
            .addCase(fetchBlogs.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
        // CREATE BLOG
        builder
            .addCase(createBlog.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(createBlog.fulfilled, (state, action) => {
                state.isLoading = false
                state.blogs.unshift(action.payload)
                state.filteredBlogs = applyFilters(state.blogs, {
                    selectedCategories: state.selectedCategories,
                    selectedTags: state.selectedTags,
                    searchQuery: state.searchQuery,
                    showOnlyUnread: state.showOnlyUnread
                })
                state.error = null
            })
            .addCase(createBlog.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        //   // FETCH BLOG BY ID
        //   builder
        //     .addCase(fetchBlogById.pending, (state) => {
        //       state.isLoading = true
        //       state.error = null
        //     })
        //     .addCase(fetchBlogById.fulfilled, (state, action) => {
        //       state.isLoading = false
        //       state.currentBlog = action.payload
        //       state.error = null
        //     })
        //     .addCase(fetchBlogById.rejected, (state, action) => {
        //       state.isLoading = false
        //       state.error = action.payload as string
        //     })

        // UPDATE BLOG STATUS
        builder
            .addCase(updateBlogStatus.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(updateBlogStatus.fulfilled, (state, action) => {
                state.isLoading = false
                const updatedBlog = action.payload

                // Update in blogs array
                const blogIndex = state.blogs.findIndex(blog => blog.id === updatedBlog.id)
                if (blogIndex !== -1) {
                    state.blogs[blogIndex] = { ...state.blogs[blogIndex], ...updatedBlog }
                }

                // Update current blog if it's the same
                if (state.currentBlog && state.currentBlog.id === updatedBlog.id) {
                    state.currentBlog = { ...state.currentBlog, ...updatedBlog }
                }

                // Reapply filters
                state.filteredBlogs = applyFilters(state.blogs, {
                    selectedCategories: state.selectedCategories,
                    selectedTags: state.selectedTags,
                    searchQuery: state.searchQuery,
                    showOnlyUnread: state.showOnlyUnread
                })

                state.error = null
            })
            .addCase(updateBlogStatus.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // DELETE BLOG
        builder
            .addCase(deleteBlog.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteBlog.fulfilled, (state, action) => {
                state.isLoading = false
                const deletedBlogId = action.payload

                state.blogs = state.blogs.filter(blog => blog.id !== deletedBlogId)
                state.filteredBlogs = state.filteredBlogs.filter(blog => blog.id !== deletedBlogId)

                if (state.currentBlog && state.currentBlog.id === deletedBlogId) {
                    state.currentBlog = null
                }

                state.error = null
            })
            .addCase(deleteBlog.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload as string
            })

        // FETCH CATEGORIES
        builder
            .addCase(fetchCategories.pending, (state) => {
                state.isCategoryLoading = true
                state.categoryError = null
            })
            .addCase(fetchCategories.fulfilled, (state, action) => {
                state.isCategoryLoading = false
                state.categories = action.payload
                state.categoryError = null
            })
            .addCase(fetchCategories.rejected, (state, action) => {
                state.isCategoryLoading = false
                state.categoryError = action.payload as string
            })

        // CREATE CATEGORY
        builder
            .addCase(createCategory.pending, (state) => {
                state.isCategoryLoading = true
                state.categoryError = null
            })
            .addCase(createCategory.fulfilled, (state, action) => {
                state.isCategoryLoading = false
                state.categories.push(action.payload)
                state.categoryError = null
            })
            .addCase(createCategory.rejected, (state, action) => {
                state.isCategoryLoading = false
                state.categoryError = action.payload as string
            })

        // DELETE CATEGORY
        builder
            .addCase(deleteCategory.pending, (state) => {
                state.isCategoryLoading = true
                state.categoryError = null
            })
            .addCase(deleteCategory.fulfilled, (state, action) => {
                state.isCategoryLoading = false
                const { categoryName } = action.payload
                state.categories = state.categories.filter(cat => cat.name !== categoryName)

                // Remove from selected categories if it was selected
                state.selectedCategories = state.selectedCategories.filter(cat => cat !== categoryName)

                // Reapply filters
                state.filteredBlogs = applyFilters(state.blogs, {
                    selectedCategories: state.selectedCategories,
                    selectedTags: state.selectedTags,
                    searchQuery: state.searchQuery,
                    showOnlyUnread: state.showOnlyUnread
                })

                state.categoryError = null
            })
            .addCase(deleteCategory.rejected, (state, action) => {
                state.isCategoryLoading = false
                state.categoryError = action.payload as string
            })

        // ADD TAG TO BLOG
        builder
            .addCase(addTagToBlog.pending, (state) => {
                state.isTagLoading = true
                state.tagError = null
            })
            .addCase(addTagToBlog.fulfilled, (state, action) => {
                state.isTagLoading = false
                const { blogId, blog } = action.payload

                // Update the blog in the blogs array
                const blogIndex = state.blogs.findIndex(b => b.id === blogId)
                if (blogIndex !== -1) {
                    state.blogs[blogIndex] = blog
                }

                // Update current blog if it matches
                if (state.currentBlog && state.currentBlog.id === blogId) {
                    state.currentBlog = blog
                }

                // Reapply filters
                state.filteredBlogs = applyFilters(state.blogs, {
                    selectedCategories: state.selectedCategories,
                    selectedTags: state.selectedTags,
                    searchQuery: state.searchQuery,
                    showOnlyUnread: state.showOnlyUnread
                })

                state.tagError = null
            })
            .addCase(addTagToBlog.rejected, (state, action) => {
                state.isTagLoading = false
                state.tagError = action.payload as string
            })

        // REMOVE TAG FROM BLOG
        builder
            .addCase(removeTagFromBlog.pending, (state) => {
                state.isTagLoading = true
                state.tagError = null
            })
            .addCase(removeTagFromBlog.fulfilled, (state, action) => {
                state.isTagLoading = false
                const { blogId, tagName } = action.payload

                // Remove tag from the blog
                const blogIndex = state.blogs.findIndex(b => b.id === blogId)
                if (blogIndex !== -1) {
                    state.blogs[blogIndex].tags = state.blogs[blogIndex].tags.filter(
                        tag => tag.name !== tagName
                    )
                }

                // Update current blog if it matches
                if (state.currentBlog && state.currentBlog.id === blogId) {
                    state.currentBlog.tags = state.currentBlog.tags.filter(
                        tag => tag.name !== tagName
                    )
                }

                // Remove from selected tags if it was selected
                // state.selectedTags = state.selectedTags.filter(tag => tag !== tagName)

                // Reapply filters
                state.filteredBlogs = applyFilters(state.blogs, {
                    selectedCategories: state.selectedCategories,
                    selectedTags: state.selectedTags,
                    searchQuery: state.searchQuery,
                    showOnlyUnread: state.showOnlyUnread
                })

                state.tagError = null
            })
            .addCase(removeTagFromBlog.rejected, (state, action) => {
                state.isTagLoading = false
                state.tagError = action.payload as string
            })
    },
})

export const {
    setSelectedCategories,
    setSelectedTags,
    setSearchQuery,
    clearAllFilters,
    clearCurrentBlog,
    clearError
} = BlogSlice.actions
export default BlogSlice.reducer