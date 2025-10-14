import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface SiteText {
  id: number;
  page: string;
  key: string;
  value: string;
  description: string;
}

interface SiteTextsContextType {
  texts: Record<string, Record<string, string>>;
  loading: boolean;
  getText: (page: string, key: string, defaultValue?: string) => string;
  refreshTexts: () => Promise<void>;
}

const SiteTextsContext = createContext<SiteTextsContextType | undefined>(undefined);

export const SiteTextsProvider = ({ children }: { children: ReactNode }) => {
  const [texts, setTexts] = useState<Record<string, Record<string, string>>>({});
  const [loading, setLoading] = useState(true);

  const fetchTexts = async () => {
    try {
      const response = await fetch('https://functions.poehali.dev/9659db56-006e-4dec-892b-23c00b3eefeb');
      const data = await response.json();
      
      const textsMap: Record<string, Record<string, string>> = {};
      
      (data.texts || []).forEach((text: SiteText) => {
        if (!textsMap[text.page]) {
          textsMap[text.page] = {};
        }
        textsMap[text.page][text.key] = text.value;
      });
      
      setTexts(textsMap);
    } catch (error) {
      console.error('Failed to fetch site texts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTexts();
  }, []);

  const getText = (page: string, key: string, defaultValue: string = ''): string => {
    return texts[page]?.[key] || defaultValue;
  };

  const refreshTexts = async () => {
    setLoading(true);
    await fetchTexts();
  };

  return (
    <SiteTextsContext.Provider
      value={{
        texts,
        loading,
        getText,
        refreshTexts,
      }}
    >
      {children}
    </SiteTextsContext.Provider>
  );
};

export const useSiteTexts = () => {
  const context = useContext(SiteTextsContext);
  if (context === undefined) {
    throw new Error('useSiteTexts must be used within a SiteTextsProvider');
  }
  return context;
};
