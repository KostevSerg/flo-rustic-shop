import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

const SEOBlocker = () => {
  const location = useLocation();
  
  const spamParams = [
    'etext',
    'ybaip',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'utm_content',
    'utm_term',
    'fbclid',
    'gclid',
    'yclid',
    'from',
    'openstat',
    '_openstat',
    'yadro'
  ];
  
  const searchParams = new URLSearchParams(location.search);
  const hasSpamParams = spamParams.some(param => searchParams.has(param));
  
  if (!hasSpamParams) {
    return null;
  }
  
  return (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
  );
};

export default SEOBlocker;
