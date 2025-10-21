const INDEXNOW_API = 'https://functions.poehali.dev/f9051455-576c-4094-8413-8c03926b2370';
const SITE_URL = 'https://florustic.ru';

export interface IndexNowResponse {
  success: boolean;
  indexnow_status?: number;
  urls_submitted?: number;
  message?: string;
  error?: string;
}

export const submitToIndexNow = async (urls: string[]): Promise<IndexNowResponse> => {
  try {
    const fullUrls = urls.map(url => url.startsWith('http') ? url : `${SITE_URL}${url}`);
    
    const response = await fetch(INDEXNOW_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ urls: fullUrls })
    });

    if (!response.ok) {
      throw new Error(`IndexNow API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('IndexNow submission error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const submitProductToIndexNow = async (productId: number): Promise<IndexNowResponse> => {
  return submitToIndexNow([`/product/${productId}`]);
};

export const submitCategoryToIndexNow = async (categorySlug: string): Promise<IndexNowResponse> => {
  return submitToIndexNow([`/category/${categorySlug}`, '/catalog']);
};

export const submitMultipleToIndexNow = async (urls: string[]): Promise<IndexNowResponse> => {
  return submitToIndexNow(urls);
};
