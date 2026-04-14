/**
 * Frontend Smoke Tests for HotelPro
 * Run with: npx vitest run
 */
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { I18nProvider } from '../i18n';
import ErrorBoundary from '../components/ErrorBoundary';
import { ToastProvider } from '../components/ToastProvider';

// Helper wrapper with all providers
function TestWrapper({ children }: { children: React.ReactNode }) {
  return (
    <BrowserRouter>
      <I18nProvider>
        <ToastProvider>
          {children}
        </ToastProvider>
      </I18nProvider>
    </BrowserRouter>
  );
}

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Hello</div>
      </ErrorBoundary>
    );
    expect(screen.getByTestId('child')).toBeInTheDocument();
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });

  it('renders fallback UI when error occurs', () => {
    const ThrowError = () => {
      throw new Error('Test error');
    };
    // Suppress console.error for this test
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Try Again')).toBeInTheDocument();
    spy.mockRestore();
  });
});

describe('API module structure', () => {
  it('exports required API services', async () => {
    const api = await import('../services/api');
    expect(api.servicesApi).toBeDefined();
    expect(api.projectsApi).toBeDefined();
    expect(api.categoriesApi).toBeDefined();
    expect(api.applicationsApi).toBeDefined();
    expect(api.settingsApi).toBeDefined();
  });

  it('has correct API method signatures', async () => {
    const api = await import('../services/api');
    expect(typeof api.servicesApi.getAll).toBe('function');
    expect(typeof api.servicesApi.create).toBe('function');
    expect(typeof api.servicesApi.delete).toBe('function');
    expect(typeof api.categoriesApi.getAll).toBe('function');
    expect(typeof api.categoriesApi.create).toBe('function');
    expect(typeof api.categoriesApi.delete).toBe('function');
  });
});

describe('ToastProvider', () => {
  it('renders without crashing', () => {
    render(
      <ToastProvider>
        <div data-testid="toast-child">Content</div>
      </ToastProvider>
    );
    expect(screen.getByTestId('toast-child')).toBeInTheDocument();
  });
});
