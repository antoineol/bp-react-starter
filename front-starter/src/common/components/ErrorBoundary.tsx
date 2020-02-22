import React, { Component } from 'react';
import { handleError } from '../services/error.service';

export class ErrorBoundary extends Component {
  static getDerivedStateFromError(error: any) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  state = { hasError: false };

  componentDidCatch(error: any, errorInfo: any) {
    // You can also log the error to an error reporting service
    handleError(errorInfo);
    handleError(error);
  }

  render() {
    if (this.state.hasError) {
      return <h2>An error occurred while rendering the component. Please ask your development team
        to review this error with, ideally, a scenario to reproduce it.</h2>;
    }

    return this.props.children;
  }
}
