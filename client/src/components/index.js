/**
 * @file index.js
 * @description Central exports for reusable client UI components.
 * @layer Client UI
 * @interacts Page and layout imports.
 * @futureWork Export additional shared components as the design system grows.
 * @nonGoal Do not define component implementations here.
 */
export { default as Navbar } from './Navbar';
export { default as Sidebar } from './Sidebar';
export { default as PageContainer } from './PageContainer';
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as StatusBadge } from './StatusBadge';
export { default as LoadingState } from './LoadingState';
export { default as ErrorState } from './ErrorState';
export { default as Input } from './Input';
export { default as Badge } from './Badge';
export { default as Modal } from './Modal';
export { default as EmptyState } from './EmptyState';
export { default as ProtectedRoute } from './ProtectedRoute';
