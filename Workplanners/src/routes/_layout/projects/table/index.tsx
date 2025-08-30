import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_layout/projects/table/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/_layout/projects/table/"!</div>
}
