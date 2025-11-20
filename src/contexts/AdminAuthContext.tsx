import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  login: (password: string, file?: File) => Promise<boolean>;
  logout: () => void;
  failedAttempts: number;
  isBlocked: boolean;
  blockTimeLeft: number;
  hasValidKeyFile: boolean;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

const ADMIN_PASSWORD = 'MaKs10151996!';
const AUTH_KEY = 'admin_authenticated';
const AUTH_TOKEN_KEY = 'admin_token';
const ATTEMPTS_KEY = 'admin_attempts';
const BLOCK_UNTIL_KEY = 'admin_block_until';
const KEY_FILE_HASH_KEY = 'admin_key_hash';
const MAX_ATTEMPTS = 3;
const BLOCK_DURATION = 15 * 60 * 1000;
const EXPECTED_KEY_CONTENT = 'FLORUSTIC_ADMIN_KEY_2024_SECURE';

const generateToken = () => {
  return `${Date.now()}_${Math.random().toString(36).substring(2, 15)}_${btoa(ADMIN_PASSWORD).substring(0, 10)}`;
};

const validateToken = (token: string | null): boolean => {
  if (!token) return false;
  const parts = token.split('_');
  if (parts.length !== 3) return false;
  const timestamp = parseInt(parts[0]);
  if (isNaN(timestamp)) return false;
  const age = Date.now() - timestamp;
  const maxAge = 24 * 60 * 60 * 1000;
  return age < maxAge;
};

export const AdminAuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    return validateToken(token);
  });

  const [failedAttempts, setFailedAttempts] = useState<number>(() => {
    return parseInt(localStorage.getItem(ATTEMPTS_KEY) || '0');
  });

  const [blockUntil, setBlockUntil] = useState<number>(() => {
    return parseInt(localStorage.getItem(BLOCK_UNTIL_KEY) || '0');
  });

  const [blockTimeLeft, setBlockTimeLeft] = useState<number>(0);
  const [isBlocked, setIsBlocked] = useState<boolean>(false);
  const [hasValidKeyFile, setHasValidKeyFile] = useState<boolean>(() => {
    return localStorage.getItem(KEY_FILE_HASH_KEY) !== null;
  });

  useEffect(() => {
    const checkBlockStatus = () => {
      const now = Date.now();
      if (blockUntil > now) {
        setIsBlocked(true);
        setBlockTimeLeft(Math.ceil((blockUntil - now) / 1000));
      } else {
        setIsBlocked(false);
        setBlockTimeLeft(0);
        if (blockUntil > 0) {
          setBlockUntil(0);
          setFailedAttempts(0);
          localStorage.removeItem(BLOCK_UNTIL_KEY);
          localStorage.removeItem(ATTEMPTS_KEY);
        }
      }
    };

    checkBlockStatus();
    const interval = setInterval(checkBlockStatus, 1000);
    return () => clearInterval(interval);
  }, [blockUntil]);

  useEffect(() => {
    if (isAuthenticated) {
      const token = generateToken();
      localStorage.setItem(AUTH_TOKEN_KEY, token);
      localStorage.removeItem(AUTH_KEY);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [isAuthenticated]);

  const login = async (password: string, file?: File): Promise<boolean> => {
    if (isBlocked) {
      return false;
    }

    let keyFileValid = hasValidKeyFile;

    if (file) {
      try {
        const fileContent = await file.text();
        const trimmedContent = fileContent.trim();
        
        if (trimmedContent === EXPECTED_KEY_CONTENT) {
          const hash = btoa(trimmedContent + Date.now());
          localStorage.setItem(KEY_FILE_HASH_KEY, hash);
          setHasValidKeyFile(true);
          keyFileValid = true;
        } else {
          keyFileValid = false;
        }
      } catch (error) {
        keyFileValid = false;
      }
    }

    if (!keyFileValid) {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem(ATTEMPTS_KEY, newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        const blockTime = Date.now() + BLOCK_DURATION;
        setBlockUntil(blockTime);
        localStorage.setItem(BLOCK_UNTIL_KEY, blockTime.toString());
      }

      return false;
    }

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setFailedAttempts(0);
      localStorage.removeItem(ATTEMPTS_KEY);
      localStorage.removeItem(BLOCK_UNTIL_KEY);
      return true;
    } else {
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      localStorage.setItem(ATTEMPTS_KEY, newAttempts.toString());

      if (newAttempts >= MAX_ATTEMPTS) {
        const blockTime = Date.now() + BLOCK_DURATION;
        setBlockUntil(blockTime);
        localStorage.setItem(BLOCK_UNTIL_KEY, blockTime.toString());
      }

      return false;
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, failedAttempts, isBlocked, blockTimeLeft, hasValidKeyFile }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within AdminAuthProvider');
  }
  return context;
};