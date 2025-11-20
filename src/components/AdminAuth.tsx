import { useState } from 'react';
import { useAdminAuth } from '@/contexts/AdminAuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Icon from '@/components/ui/icon';

interface AdminAuthProps {
  children: React.ReactNode;
}

const AdminAuth = ({ children }: AdminAuthProps) => {
  const { isAuthenticated, login, failedAttempts, isBlocked, blockTimeLeft, hasValidKeyFile } = useAdminAuth();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [keyFile, setKeyFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setKeyFile(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isBlocked) {
      setError(`Доступ заблокирован. Попробуйте через ${blockTimeLeft} сек.`);
      return;
    }

    if (!hasValidKeyFile && !keyFile) {
      setError('Загрузите файл-ключ для входа');
      return;
    }

    if (!password.trim()) {
      setError('Введите пароль');
      return;
    }

    setIsLoading(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const success = await login(password, keyFile || undefined);
    
    if (success) {
      setError('');
      setPassword('');
      setKeyFile(null);
    } else {
      if (isBlocked) {
        setError(`Превышено количество попыток. Доступ заблокирован на 15 минут.`);
      } else {
        const attemptsLeft = 3 - failedAttempts - 1;
        if (attemptsLeft > 0) {
          if (!hasValidKeyFile && keyFile) {
            setError(`Неверный файл-ключ или пароль. Осталось попыток: ${attemptsLeft}`);
          } else {
            setError(`Неверный пароль. Осталось попыток: ${attemptsLeft}`);
          }
        } else {
          setError('Превышено количество попыток. Доступ заблокирован на 15 минут.');
        }
      }
      setPassword('');
      setKeyFile(null);
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
          {!hasValidKeyFile && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Файл-ключ доступа <span className="text-destructive">*</span>
              </label>
              <input
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                disabled={isBlocked || isLoading}
                className="w-full px-3 py-2 border border-border rounded-lg text-sm file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {keyFile && (
                <p className="text-xs text-muted-foreground mt-1 flex items-center">
                  <Icon name="FileCheck" size={14} className="mr-1" />
                  {keyFile.name}
                </p>
              )}
            </div>
          )}
          {hasValidKeyFile && (
            <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-3">
              <p className="text-green-700 dark:text-green-400 text-sm flex items-center">
                <Icon name="ShieldCheck" size={16} className="mr-2" />
                Файл-ключ подтверждён
              </p>
            </div>
          )}
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

        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <p className="text-xs text-muted-foreground text-center mb-2">
            <Icon name="Info" size={14} className="inline mr-1" />
            Для входа требуется файл-ключ
          </p>
          <p className="text-xs text-muted-foreground text-center">
            Обратитесь к администратору для получения доступа
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminAuth;