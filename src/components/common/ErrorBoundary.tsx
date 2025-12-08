import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@gravity-ui/uikit';
import './ErrorBoundary.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary для перехвата ошибок рендеринга React компонентов
 * Требования: 6.4
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(_error: Error): Partial<ErrorBoundaryState> {
    // Обновляем состояние, чтобы следующий рендер показал fallback UI
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // Логируем ошибку для мониторинга
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo,
    });
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-boundary-content">
            <h1 className="error-boundary-title">Произошла ошибка</h1>
            <p className="error-boundary-message">
              Приложение столкнулось с непредвиденной ошибкой. Пожалуйста, попробуйте обновить страницу.
            </p>
            
            {this.state.error && (
              <details className="error-boundary-details">
                <summary>Детали ошибки</summary>
                <pre className="error-boundary-stack">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            
            <div className="error-boundary-actions">
              <Button
                view="action"
                size="l"
                onClick={() => window.location.reload()}
              >
                Обновить страницу
              </Button>
              <Button
                view="outlined"
                size="l"
                onClick={this.handleReset}
              >
                Попробовать снова
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
