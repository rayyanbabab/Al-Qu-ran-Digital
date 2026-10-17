const STORAGE_KEY = 'quran_saved_verses';

export const getBookmarks = () => {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Error reading bookmarks:', e);
    return [];
  }
};

export const isAyahBookmarked = (surahId, ayahNumber) => {
  const bookmarks = getBookmarks();
  const id = `${surahId}:${ayahNumber}`;
  return bookmarks.some((item) => item.id === id);
};

export const toggleBookmark = (verseData) => {
  if (typeof window === 'undefined') return false;
  try {
    const bookmarks = getBookmarks();
    const id = `${verseData.surahId}:${verseData.ayahNumber}`;
    const existsIndex = bookmarks.findIndex((item) => item.id === id);

    let updated;
    let isAdded = false;

    if (existsIndex > -1) {
      updated = bookmarks.filter((item) => item.id !== id);
      isAdded = false;
    } else {
      const newItem = {
        id,
        surahId: verseData.surahId,
        surahName: verseData.surahName,
        ayahNumber: verseData.ayahNumber,
        arabicText: verseData.arabicText,
        translation: verseData.translation,
        savedAt: new Date().toISOString(),
      };
      updated = [newItem, ...bookmarks];
      isAdded = true;
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('quran_bookmarks_updated'));
    return isAdded;
  } catch (e) {
    console.error('Error toggling bookmark:', e);
    return false;
  }
};

export const removeBookmarkById = (id) => {
  if (typeof window === 'undefined') return;
  try {
    const bookmarks = getBookmarks();
    const updated = bookmarks.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('quran_bookmarks_updated'));
  } catch (e) {
    console.error('Error removing bookmark:', e);
  }
};

export const clearAllBookmarks = () => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new Event('quran_bookmarks_updated'));
  } catch (e) {
    console.error('Error clearing bookmarks:', e);
  }
};
