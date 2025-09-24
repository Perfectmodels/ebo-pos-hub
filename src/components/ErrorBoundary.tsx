import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return <ErrorFallback error={this.state.error} />;
    }

    return this.props.children;
  }
}

const ErrorFallback: React.FC<{ error?: Error }> = ({ error }) => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-bg flex items-center justify-center p-4">
      <Card className="w-full max-w-md card-stats animate-fade-in text-center">
        <CardHeader className="space-y-4">
          <div className="flex justify-center">
            <AlertTriangle className="w-16 h-16 text-destructive" />
          </div>
          <CardTitle className="text-3xl font-bold text-destructive">
            Oups ! Une erreur s'est produite
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-destructive/10 border border-destructive/30 text-destructive p-4 rounded-lg">
            <p className="font-medium mb-2">Détails de l'erreur :</p>
            <p className="text-sm">{error?.message || 'Erreur inconnue'}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Button onClick={handleRefresh} className="btn-gradient">
              <RefreshCw className="w-4 h-4 mr-2" />
              Recharger la page
            </Button>
            <Button variant="outline" onClick={handleGoHome}>
              <Home className="w-4 h-4 mr-2" />
              Retour à l'accueil
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ErrorBoundary;
