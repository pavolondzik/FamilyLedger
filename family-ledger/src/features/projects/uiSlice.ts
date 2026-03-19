import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Project } from '@/features/projects/types/project'

interface ProjectsUiState {
  selectedProject: Project | null
}

const initialState: ProjectsUiState = {
  selectedProject: null,
}

const uiSlice = createSlice({
  name: 'projectsUi',
  initialState,
  reducers: {
    selectProject: (state, action: PayloadAction<Project>) => {
      state.selectedProject = action.payload
    },
    clearSelection: (state) => {
      state.selectedProject = null
    },
  },
})

export const { selectProject, clearSelection } = uiSlice.actions
export default uiSlice.reducer
