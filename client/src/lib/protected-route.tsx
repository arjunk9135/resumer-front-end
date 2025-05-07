import { Route } from "wouter";

// TEMPORARY: Authentication check bypassed for testing
export function ProtectedRoute({
  path,
  component: Component,
}) {
  // Bypassing authentication check for testing
  // In a real app, this would check if the user is authenticated
  return <Route path={path} component={Component} />
}
