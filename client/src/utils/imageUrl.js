const BACKEND = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"

// Resolve absolute or legacy relative URLs
export const resolveImageUrl = (path, fallback = "") => {
  if (!path) return fallback
  return path.startsWith("http") ? path : `${BACKEND}${path}`
}
