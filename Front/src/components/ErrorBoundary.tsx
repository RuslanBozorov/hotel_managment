import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0D1B2A 0%, #1B2D45 100%)',
          color: '#fff',
          fontFamily: "'Inter', sans-serif",
          padding: '40px',
        }}>
          <div style={{
            maxWidth: '520px',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '20px',
            padding: '48px 40px',
            backdropFilter: 'blur(20px)',
          }}>
            <div style={{
              width: '64px', height: '64px',
              background: 'rgba(239, 68, 68, 0.15)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              fontSize: '28px',
            }}>
              ⚠️
            </div>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '12px',
              color: '#f8fafc',
            }}>
              Something went wrong
            </h2>
            <p style={{
              fontSize: '0.9rem',
              color: 'rgba(255,255,255,0.6)',
              lineHeight: 1.6,
              marginBottom: '8px',
            }}>
              An unexpected error occurred. Please try again.
            </p>
            {this.state.error && (
              <pre style={{
                fontSize: '0.75rem',
                color: '#ef4444',
                background: 'rgba(239, 68, 68, 0.08)',
                padding: '12px',
                borderRadius: '8px',
                marginBottom: '24px',
                textAlign: 'left',
                overflow: 'auto',
                maxHeight: '120px',
              }}>
                {this.state.error.message}
              </pre>
            )}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={this.handleReset}
                style={{
                  padding: '12px 28px',
                  background: '#C9A84C',
                  color: '#0D1B2A',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  transition: 'transform 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                style={{
                  padding: '12px 28px',
                  background: 'transparent',
                  color: '#C9A84C',
                  border: '1px solid rgba(201, 168, 76, 0.4)',
                  borderRadius: '10px',
                  fontWeight: 600,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                Go Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
