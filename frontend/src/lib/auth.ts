import { store } from '../store/store'
import { logout } from '../store/slices/authSlice'
import toast from 'react-hot-toast'

export const getAuthFromStore = () => {
    const state = store.getState()
    return {
        token: state.auth.token,
        userId: state.auth.userId,
        isAuthenticated: state.auth.isAuthenticated
    }
}

export const logoutUser = () => {
    store.dispatch(logout())
    toast.success('Logged out successfully')
}