export const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${path}`;
};
