import { Router, RouterProvider, Route, RootRoute } from '@tanstack/react-router'

const rootRoute = new RootRoute({
  component: () => <div>Root Layout</div>,
})

const indexRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => <div>Home</div>,
})

const loginRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/login', 
  component: () => <div>Login</div>,
})

const conversationsRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/conversations',
  component: () => <div>Conversations</div>,
})

const conversationDetailRoute = new Route({
  getParentRoute: () => rootRoute,
  path: '/conversations/$id',
  component: () => <div>Conversation Detail</div>,
})

const routeTree = rootRoute.addChildren([
  indexRoute,
  loginRoute,
  conversationsRoute,
  conversationDetailRoute,
])

const router = new Router({ routeTree })

export default function App() {
  return <RouterProvider router={router} />
}