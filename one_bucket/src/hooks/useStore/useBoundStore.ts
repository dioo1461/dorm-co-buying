import { create } from 'zustand'
import { AppSlice, createAppSlice } from './appSlice'
import { AuthSlice, createAuthSlice } from './authSlice'
import { createProfileSlice, ProfileSlice } from './profileSlice'

export const useBoundStore = create<AppSlice & AuthSlice & ProfileSlice>()(
    (...a) => ({
        ...createAppSlice(...a),
        ...createAuthSlice(...a),
        ...createProfileSlice(...a),
    }),
)
