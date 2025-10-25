import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { getCachedImage } from '../../utils/imageCache';

const CachedImage = ({ productId, imagenUrl, alt, className, fallbackName }) => {
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Generar URL de fallback
  const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fallbackName || alt)}&background=random&color=fff&size=400`;

  useEffect(() => {
    let isMounted = true;
    let objectURL = null;

    const loadImage = async () => {
      setLoading(true);
      setError(false);

      try {
        // Intentar obtener del caché primero
        const cachedUrl = await getCachedImage(productId);
        
        if (isMounted) {
          if (cachedUrl) {
            objectURL = cachedUrl;
            setImageSrc(cachedUrl);
          } else if (imagenUrl && !imagenUrl.includes('ui-avatars.com')) {
            // Si no está en caché, usar la URL original
            setImageSrc(imagenUrl);
          } else {
            // Usar fallback si no hay imagen
            setImageSrc(fallbackUrl);
          }
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setImageSrc(fallbackUrl);
          setError(true);
          setLoading(false);
        }
      }
    };

    loadImage();

    // Cleanup: revocar object URL si se creó
    return () => {
      isMounted = false;
      if (objectURL) {
        URL.revokeObjectURL(objectURL);
      }
    };
  }, [productId, imagenUrl, fallbackUrl, fallbackName, alt]);

  const handleError = () => {
    if (!error) {
      setError(true);
      setImageSrc(fallbackUrl);
    }
  };

  return (
    <>
      {loading && (
        <div className={`${className} flex items-center justify-center bg-[#1a1a1a] animate-pulse`}>
          <svg className="w-8 h-8 text-[#d4af37]/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      <img
        src={imageSrc || fallbackUrl}
        alt={alt}
        className={`${className} ${loading ? 'hidden' : ''}`}
        onLoad={() => setLoading(false)}
        onError={handleError}
      />
    </>
  );
};

CachedImage.propTypes = {
  productId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  imagenUrl: PropTypes.string,
  alt: PropTypes.string.isRequired,
  className: PropTypes.string,
  fallbackName: PropTypes.string,
};

CachedImage.defaultProps = {
  imagenUrl: null,
  className: '',
  fallbackName: '',
};

export default CachedImage;
