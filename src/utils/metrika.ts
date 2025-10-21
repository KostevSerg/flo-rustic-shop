declare global {
  interface Window {
    ym?: (id: number, method: string, ...args: any[]) => void;
  }
}

export const sendMetrikaPageView = (url: string) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(104746725, 'hit', url);
  }
};

export const sendMetrikaEvent = (eventName: string, params?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.ym) {
    window.ym(104746725, 'reachGoal', eventName, params);
  }
};
