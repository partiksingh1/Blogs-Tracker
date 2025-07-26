import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface AuthState {
    token: string | null
    userId: string | null
    isAuthenticated: boolean
    isLoading: boolean
}

import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (credentials: { email: string; password: string }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(loginStart())

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, credentials)
            console.log("response", response);

            if (response.status == 200) {
                console.log("reached");
                dispatch(loginSuccess({
                    token: response.data.token,
                    userId: response.data.user.id
                }))
                return response.data
            } else {
                dispatch(loginFailure())
                return rejectWithValue('Invalid response format')
            }
        } catch (error) {
            console.error(error);
            dispatch(loginFailure())
            return rejectWithValue('Login failed')
        }
    }
)

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email: string, { dispatch, rejectWithValue }) => {
        try {
            dispatch(loginStart())

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/forgot-password`, { email })

            if (response.status === 200) {
                dispatch(loginSuccess({ token: '', userId: '' })) // No need to store token or userId
                return response.data
            } else {
                dispatch(loginFailure())
                return rejectWithValue('Failed to send reset email')
            }
        } catch (error) {
            console.error(error);
            dispatch(loginFailure())
            return rejectWithValue('Forgot password failed')
        }
    }
)

export const signupUser = createAsyncThunk(
    'auth/signupUser',
    async (userData: { email: string; password: string; username: string }, { dispatch, rejectWithValue }) => {
        try {
            dispatch(loginStart())

            const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/signup`, userData)

            if (response.status == 201) {
                dispatch(loginSuccess({
                    token: response.data.token,
                    userId: response.data.user.id
                }))
                return response.data
            } else {
                dispatch(loginFailure())
                return rejectWithValue('Invalid response format')
            }
        } catch (error) {
            console.error(error);
            dispatch(loginFailure())
            return rejectWithValue('Signup failed')
        }
    }
)

const initialState: AuthState = {
    token: localStorage.getItem('token'),
    userId: localStorage.getItem('userId'),
    isAuthenticated: !!localStorage.getItem('token'),
    isLoading: false,
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        loginStart: (state) => {
            state.isLoading = true
        },
        loginSuccess: (state, action: PayloadAction<{ token: string; userId: string }>) => {
            state.token = action.payload.token
            state.userId = action.payload.userId
            state.isAuthenticated = true
            state.isLoading = false

            // Still sync with localStorage
            localStorage.setItem('token', action.payload.token)
            localStorage.setItem('userId', action.payload.userId)
        },
        loginFailure: (state) => {
            state.token = null
            state.userId = null
            state.isAuthenticated = false
            state.isLoading = false
        },
        logout: (state) => {
            state.token = null
            state.userId = null
            state.isAuthenticated = false
            state.isLoading = false

            // Clear localStorage
            localStorage.removeItem('token')
            localStorage.removeItem('userId')
        },
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload
        }
    },
})

export const { loginStart, loginSuccess, loginFailure, logout, setLoading } = authSlice.actions
export default authSlice.reducer