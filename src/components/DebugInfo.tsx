import { useAuth } from '@/contexts/AuthContext';
import { useActivity } from '@/contexts/ActivityContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default function DebugInfo() {
  const { user, loading: authLoading } = useAuth();
  const { currentActivity } = useActivity();

  if (process.env.NODE_ENV !== 'development') {
    return null;
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 bg-card/95 backdrop-blur">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">🐛 Debug Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 text-xs">
        <div>
          <strong>Auth Loading:</strong> 
          <Badge variant={authLoading ? "destructive" : "default"} className="ml-2">
            {authLoading ? "Loading" : "Loaded"}
          </Badge>
        </div>
        
        <div>
          <strong>User:</strong> 
          <Badge variant={user ? "default" : "destructive"} className="ml-2">
            {user ? user.email : "Not connected"}
          </Badge>
        </div>
        
        <div>
          <strong>User ID:</strong> 
          <span className="text-muted-foreground ml-2">
            {user?.uid || "N/A"}
          </span>
        </div>
        
        <div>
          <strong>Activity:</strong> 
          <Badge variant={currentActivity ? "default" : "destructive"} className="ml-2">
            {currentActivity ? currentActivity.name : "Not loaded"}
          </Badge>
        </div>
        
        {currentActivity && (
          <div>
            <strong>Activity ID:</strong> 
            <span className="text-muted-foreground ml-2">
              {currentActivity.id}
            </span>
          </div>
        )}
        
        <div>
          <strong>Features:</strong> 
          <span className="text-muted-foreground ml-2">
            {currentActivity?.features?.join(', ') || "N/A"}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
