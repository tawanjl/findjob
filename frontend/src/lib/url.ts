export const getImageUrl = (path: string | undefined): string => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    // For local uploads or paths without http, prefix with backend URL
    return `http://localhost:3000${path}`;
};
