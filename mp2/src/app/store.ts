import { create } from 'zustand'

interface NavState {
    currentList: number[]
    setList: (ids: number[]) => void
}

export const useNavStore = create<NavState>((set) => ({
    currentList: [],
    setList: (ids) => set({ currentList: ids })
}))