import { configureStore } from '@reduxjs/toolkit'

import projectsUiReducer from '@/features/projects/uiSlice'

export const store = configureStore({
  reducer: {
    projectsUi: projectsUiReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
