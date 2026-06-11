// src/utils/uuid.ts

/**
 * Generate a UUID v4 compliant ID
 * Works in all environments (browsers, Node.js, older versions)
 */
export const generateUUID = (): string => {
  // Try to use native crypto.randomUUID if available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  
  // Fallback implementation for older environments
  // This generates RFC4122 version 4 compliant UUID
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Also create a more robust version using crypto.getRandomValues when available
export const generateSecureUUID = (): string => {
  // Use crypto.getRandomValues for better randomness when available
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    const randomValues = new Uint8Array(16);
    crypto.getRandomValues(randomValues);
    
    // Set version (4) and variant (RFC4122)
    randomValues[6] = (randomValues[6] & 0x0f) | 0x40;
    randomValues[8] = (randomValues[8] & 0x3f) | 0x80;
    
    // Convert to hex string with hyphens
    return Array.from(randomValues)
      .map((b, i) => {
        const hex = b.toString(16).padStart(2, '0');
        if (i === 4 || i === 6 || i === 8 || i === 10) {
          return '-' + hex;
        }
        return hex;
      })
      .join('');
  }
  
  // Fallback to random UUID
  return generateUUID();
};