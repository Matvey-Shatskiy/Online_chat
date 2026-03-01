export const formatTime = (dateString: string | undefined) => {
  if (!dateString) return 'давно';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'давно';
    return date.toLocaleTimeString([], { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'давно';
  }
};

export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://192.168.1.16:8000${path}`;
};