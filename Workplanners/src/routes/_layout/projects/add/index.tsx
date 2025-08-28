import AddProjectForm from '@/components/AddProjectForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/projects/add/')({
  component: AddProjectForm,
})