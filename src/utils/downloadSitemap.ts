// Utility to download and display sitemap
export async function downloadCompleteSitemap() {
  const url = 'https://functions.poehali.dev/de3079a4-121e-4551-98e0-d684282f9f85';
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data.success) {
      throw new Error('Failed to fetch sitemap');
    }
    
    // Save the full XML to a file (download)
    const blob = new Blob([data.full_content], { type: 'application/xml' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = 'sitemap-complete.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
    
    return {
      success: true,
      stats: {
        totalChars: data.total_chars,
        totalLines: data.total_lines,
        totalUrls: data.total_urls,
      },
      preview: {
        first100Lines: data.first_100_lines,
        last20Lines: data.last_20_lines,
      },
      fullContent: data.full_content
    };
    
  } catch (error) {
    console.error('Error downloading sitemap:', error);
    throw error;
  }
}
