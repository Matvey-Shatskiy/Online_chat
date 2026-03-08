export const formatTime = (dateString: string | undefined) => {
  if (!dateString) return 'recently';
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'recently';
    return date.toLocaleTimeString([], { day: 'numeric', month: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'recently';
  }
};

export const getImageUrl = (path: string) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `http://192.168.1.16:8000${path}`;
};