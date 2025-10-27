import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth = ({ children }: AdminAuthProps) => {
  const { isAuthenticated, login } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(password);
    
    if (success) {
      setError('');
      setPassword('');
    } else {
      setError('Неверный пароль');
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
      <div className="w-full max-w-md p-8 bg-card border rounded-xl shadow-lg">
        <div className="text-center mb-6">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <Icon name="Lock" size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Вход в админ-панель</h1>
          <p className="text-muted-foreground">Введите пароль для доступа</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              type="password"
              placeholder="Пароль"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError('');
              }}
              className={error ? 'border-destructive' : ''}
              autoFocus
            />
            {error && (
              <p className="text-destructive text-sm mt-2 flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-1" />
                {error}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg">
            <Icon name="LogIn" size={18} className="mr-2" />
            Войти
          </Button>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Забыли пароль? Обратитесь к администратору
        </p>
      </div>
    </div>
  );
};

export default AdminAuth;