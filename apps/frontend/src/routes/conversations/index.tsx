import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/conversations/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/conversations/"!</div>
}
