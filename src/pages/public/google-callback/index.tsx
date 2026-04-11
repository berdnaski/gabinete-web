import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { Loader2 } from 'lucide-react';

export function GoogleCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { handleGoogleLogin } = useAuth();
  const isProcessing = useRef(false);

  useEffect(() => {
    const token = searchParams.get('token');
    const refreshToken = searchParams.get('refreshToken');

    if (token && refreshToken && !isProcessing.current) {
      isProcessing.current = true;
      handleGoogleLogin(token, refreshToken).catch(() => {
        navigate('/login');
      });
    } else if (!token || !refreshToken) {
      if (!isProcessing.current) {
        navigate('/login');
      }
    }
  }, [searchParams, navigate, handleGoogleLogin]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground text-sm font-medium">
          Concluindo autenticação...
        </p>
      </div>
    </div>
  );
}
