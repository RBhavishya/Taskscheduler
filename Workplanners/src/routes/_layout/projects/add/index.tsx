import AddProjectForm from '@/components/AddProjectForm'
import { createFileRoute } from '@tanstack/react-router'

const AddProjectFormWrapper = () => {
  const nextId = 1;
  return <AddProjectForm nextId={nextId} />;
};

export const Route = createFileRoute('/_layout/projects/add/')({
  component: AddProjectFormWrapper,
})