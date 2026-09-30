export function LoadingState({ label = 'Loading...' }) {
  return <div className="page-state">{label}</div>;
}

export function EmptyState({ children }) {
  return <div className="page-state page-state-empty">{children}</div>;
}

export function ErrorMessage({ message }) {
  if (!message) {
    return null;
  }

  return <div className="form-error" role="alert">{message}</div>;
}

export function getErrorMessage(error, fallback) {
  return error.response?.data?.message || fallback;
}