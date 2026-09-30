import { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <main className="fallback-page">
          <p className="eyebrow">Something went wrong</p>
          <h1>We couldn&apos;t load this view.</h1>
          <p>Refresh the page to return to your gym workspace.</p>
          <button className="button button-primary" type="button" onClick={() => window.location.reload()}>Refresh page</button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;