// Global Live Likes Service for Vercel & Cloud Sync

const CLOUD_OBJECT_ID = 'ff808181a09d98f701a0c40fa5dc617d';
const DIRECT_CLOUD_URL = `https://api.restful-api.dev/objects/${CLOUD_OBJECT_ID}`;
const LOCAL_STORAGE_COUNT_KEY = 'still_alive_likes_count';
const LOCAL_STORAGE_LIKED_KEY = 'still_alive_user_liked';

export const getStoredLikedState = () => {
  try {
    return localStorage.getItem(LOCAL_STORAGE_LIKED_KEY) === 'true';
  } catch (e) {
    return false;
  }
};

export const setStoredLikedState = (liked) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_LIKED_KEY, String(liked));
  } catch (e) {}
};

// Fetch the global count from Vercel API or Cloud API
export const fetchGlobalLikes = async () => {
  // 1. Try Vercel Serverless API
  try {
    const res = await fetch('/api/likes', { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.count === 'number') {
        localStorage.setItem(LOCAL_STORAGE_COUNT_KEY, String(data.count));
        return data.count;
      }
    }
  } catch (e) {
    // Fallback to direct cloud fetch
  }

  // 2. Direct Cloud Endpoint Fallback
  try {
    const res = await fetch(DIRECT_CLOUD_URL, { cache: 'no-store' });
    if (res.ok) {
      const data = await res.json();
      const count = data?.data?.count || 0;
      localStorage.setItem(LOCAL_STORAGE_COUNT_KEY, String(count));
      return count;
    }
  } catch (e) {
    console.warn('Could not fetch global likes from cloud:', e);
  }

  // 3. Fallback to cached count
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_COUNT_KEY);
    return cached !== null ? parseInt(cached, 10) : 0;
  } catch (e) {
    return 0;
  }
};

// Increment or Decrement the global count
export const updateGlobalLikes = async (isLiked, targetCount) => {
  setStoredLikedState(isLiked);
  localStorage.setItem(LOCAL_STORAGE_COUNT_KEY, String(targetCount));

  // 1. Try Vercel Serverless API
  try {
    const method = isLiked ? 'POST' : 'DELETE';
    const res = await fetch('/api/likes', { method });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.count === 'number') {
        localStorage.setItem(LOCAL_STORAGE_COUNT_KEY, String(data.count));
        return data.count;
      }
    }
  } catch (e) {}

  // 2. Direct Cloud Endpoint Fallback
  try {
    const res = await fetch(DIRECT_CLOUD_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'still_alive_atc_likes',
        data: { count: targetCount }
      })
    });
    if (res.ok) {
      const data = await res.json();
      return data?.data?.count || targetCount;
    }
  } catch (e) {
    console.warn('Could not sync like to cloud:', e);
  }

  return targetCount;
};
