/**
 * Get the full URL for a sufgania photo
 * @param {string} photoUrl - The relative photo URL from the database (e.g., "/uploads/sufgania-123.jpg")
 * @returns {string|null} The full URL to access the image, or null if no photo
 */
export const getImageUrl = (photoUrl) => {
  if (!photoUrl) return null;

  const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';
  // Remove /api from the end since uploads are served from the root
  const baseUrl = API_BASE.replace('/api', '');

  return `${baseUrl}${photoUrl}`;
};
