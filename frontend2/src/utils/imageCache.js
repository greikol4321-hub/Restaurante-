// Servicio de caché de imágenes usando IndexedDB

const DB_NAME = 'MenuDigitalCache';
const STORE_NAME = 'imageCache';
const DB_VERSION = 1;

// Abrir/crear la base de datos IndexedDB
const openDatabase = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

// Convertir imagen URL a Blob
const urlToBlob = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Error al descargar imagen');
    return await response.blob();
  } catch (error) {
    console.error('Error convirtiendo URL a Blob:', error);
    return null;
  }
};

// Guardar imagen en IndexedDB
export const cacheImage = async (productId, imageUrl) => {
  if (!imageUrl || imageUrl.includes('ui-avatars.com')) {
    return null; // No cachear imágenes de placeholder
  }

  try {
    const db = await openDatabase();
    const blob = await urlToBlob(imageUrl);
    
    if (!blob) return null;

    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const imageData = {
      id: productId,
      blob: blob,
      url: imageUrl,
      cachedAt: Date.now()
    };

    await new Promise((resolve, reject) => {
      const request = store.put(imageData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    return URL.createObjectURL(blob);
  } catch (error) {
    console.error('Error cacheando imagen:', error);
    return imageUrl; // Retornar URL original si falla
  }
};

// Obtener imagen del caché
export const getCachedImage = async (productId) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return await new Promise((resolve, reject) => {
      const request = store.get(productId);
      
      request.onsuccess = () => {
        if (request.result && request.result.blob) {
          const objectURL = URL.createObjectURL(request.result.blob);
          resolve(objectURL);
        } else {
          resolve(null);
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error obteniendo imagen del caché:', error);
    return null;
  }
};

// Cachear múltiples productos
export const cacheProductImages = async (products) => {
  const cachePromises = products
    .filter(product => product.imagenUrl && !product.imagenUrl.includes('ui-avatars.com'))
    .map(product => cacheImage(product.id, product.imagenUrl));

  try {
    await Promise.all(cachePromises);
    console.log(`✅ ${cachePromises.length} imágenes cacheadas exitosamente`);
  } catch (error) {
    console.error('Error cacheando múltiples imágenes:', error);
  }
};

// Eliminar imagen del caché
export const removeCachedImage = async (productId) => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise((resolve, reject) => {
      const request = store.delete(productId);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    console.log(`🗑️ Imagen del producto ${productId} eliminada del caché`);
  } catch (error) {
    console.error('Error eliminando imagen del caché:', error);
  }
};

// Eliminar múltiples imágenes del caché
export const removeCachedImages = async (productIds) => {
  const removePromises = productIds.map(id => removeCachedImage(id));
  
  try {
    await Promise.all(removePromises);
    console.log(`🗑️ ${productIds.length} imágenes eliminadas del caché`);
  } catch (error) {
    console.error('Error eliminando múltiples imágenes:', error);
  }
};

// Limpiar todo el caché
export const clearImageCache = async () => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORE_NAME], 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    await new Promise((resolve, reject) => {
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });

    console.log('🗑️ Caché de imágenes completamente limpiado');
  } catch (error) {
    console.error('Error limpiando caché:', error);
  }
};

// Obtener estadísticas del caché
export const getCacheStats = async () => {
  try {
    const db = await openDatabase();
    const transaction = db.transaction([STORE_NAME], 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    return await new Promise((resolve, reject) => {
      const request = store.count();
      
      request.onsuccess = () => {
        resolve({
          totalImages: request.result,
          dbName: DB_NAME
        });
      };
      
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error obteniendo estadísticas del caché:', error);
    return { totalImages: 0, dbName: DB_NAME };
  }
};
