import { useEffect } from 'react';

interface SEOConfig {
  title?: string;
  description?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonical?: string;
  noIndex?: boolean;
}

export function useSEO(config: SEOConfig) {
  useEffect(() => {
    const baseTitle = "Ministerio AI";
    const baseDescription = "Herramientas especializadas de Inteligencia Artificial para pastores, ministros y líderes de iglesia.";
    const baseUrl = "https://ministerioai.com";
    
    // Update document title
    if (config.title) {
      document.title = config.title.includes(baseTitle) ? config.title : `${config.title} | ${baseTitle}`;
    }
    
    // Helper function to update or create meta tag
    const updateMetaTag = (selector: string, attribute: string, content: string) => {
      let tag = document.querySelector(selector);
      if (tag) {
        tag.setAttribute(attribute, content);
      } else {
        tag = document.createElement('meta');
        tag.setAttribute(selector.includes('property') ? 'property' : 'name', selector.replace(/.*["']([^"']+)["'].*/, '$1'));
        tag.setAttribute(attribute, content);
        document.head.appendChild(tag);
      }
    };
    
    // Update description
    if (config.description) {
      updateMetaTag('meta[name="description"]', 'content', config.description);
      updateMetaTag('meta[property="og:description"]', 'content', config.description);
      updateMetaTag('meta[property="twitter:description"]', 'content', config.description);
    }
    
    // Update keywords
    if (config.keywords) {
      updateMetaTag('meta[name="keywords"]', 'content', config.keywords);
    }
    
    // Update Open Graph title
    const ogTitle = config.ogTitle || config.title;
    if (ogTitle) {
      updateMetaTag('meta[property="og:title"]', 'content', ogTitle.includes(baseTitle) ? ogTitle : `${ogTitle} | ${baseTitle}`);
      updateMetaTag('meta[property="twitter:title"]', 'content', ogTitle.includes(baseTitle) ? ogTitle : `${ogTitle} | ${baseTitle}`);
    }
    
    // Update Open Graph image
    if (config.ogImage) {
      updateMetaTag('meta[property="og:image"]', 'content', config.ogImage);
      updateMetaTag('meta[property="twitter:image"]', 'content', config.ogImage);
    }
    
    // Update canonical URL
    if (config.canonical) {
      let canonicalLink = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
      if (canonicalLink) {
        canonicalLink.href = `${baseUrl}${config.canonical}`;
      } else {
        canonicalLink = document.createElement('link');
        canonicalLink.rel = 'canonical';
        canonicalLink.href = `${baseUrl}${config.canonical}`;
        document.head.appendChild(canonicalLink);
      }
    }
    
    // Update robots meta tag
    if (config.noIndex) {
      updateMetaTag('meta[name="robots"]', 'content', 'noindex, nofollow');
    }
    
    // Update OG URL
    updateMetaTag('meta[property="og:url"]', 'content', `${baseUrl}${config.canonical || ''}`);
    updateMetaTag('meta[property="twitter:url"]', 'content', `${baseUrl}${config.canonical || ''}`);
    
  }, [config]);
}