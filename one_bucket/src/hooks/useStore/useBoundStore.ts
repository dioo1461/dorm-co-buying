import { create } from 'zustand'
import { AppSlice, createAppSlice } from './appSlice'
import { AuthSlice, createAuthSlice } from './authSlice'
import { createProfileSlice, ProfileSlice } from './profileSlice'
import { BoardSlice, createBoardSlice } from './boardSlice'

export const useBoundStore = create<
    AppSlice & AuthSlice & ProfileSlice & BoardSlice
>()((...a) => ({
    ...createAppSlice(...a),
    ...createAuthSlice(...a),
    ...createProfileSlice(...a),
    ...createBoardSlice(...a),
}))
