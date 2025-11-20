import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth = ({ children }: AdminAuthProps) => {
  const { isAuthenticated, login, failedAttempts, isBlocked, blockTimeLeft } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError(`Доступ заблокирован. Попробуйте через ${blockTimeLeft} сек.`);
      return;
    }

    if (!password.trim()) {
      setError('Введите пароль');
      return;
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = login(password);
    
    if (success) {
      setError('');
      setPassword('');
    } else {
      if (isBlocked) {
        setError(`Превышено количество попыток. Доступ заблокирован на 15 минут.`);
      } else {
        const attemptsLeft = 3 - failedAttempts - 1;
        if (attemptsLeft > 0) {
          setError(`Неверный пароль. Осталось попыток: ${attemptsLeft}`);
        } else {
          setError('Превышено количество попыток. Доступ заблокирован на 15 минут.');
        }
      }
      setPassword('');
    }
    
    setIsLoading(false);
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
              disabled={isBlocked || isLoading}
            />
            {error && (
              <p className="text-destructive text-sm mt-2 flex items-center">
                <Icon name="AlertCircle" size={16} className="mr-1" />
                {error}
              </p>
            )}
            {isBlocked && (
              <p className="text-yellow-600 dark:text-yellow-500 text-sm mt-2 flex items-center">
                <Icon name="Clock" size={16} className="mr-1" />
                Повторите попытку через {Math.floor(blockTimeLeft / 60)}:{String(blockTimeLeft % 60).padStart(2, '0')}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isBlocked || isLoading}>
            {isLoading ? (
              <>
                <Icon name="Loader2" size={18} className="mr-2 animate-spin" />
                Проверка...
              </>
            ) : (
              <>
                <Icon name="LogIn" size={18} className="mr-2" />
                Войти
              </>
            )}
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