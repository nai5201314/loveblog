const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://loving.naiblog.cn';
async function request(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || '请求失败');
    }

    return data;
  } catch (error) {
    console.error('API请求错误:', error);
    throw error;
  }
}

export const api = {
  getHomeData: () => request('/api/home'),
  getTogetherDays: () => request('/api/together-days'),
  getDashboardStats: () => request('/api/status/stats'),
  getDiaries: (page = 1, pageSize = 8) => 
    request(`/api/diary?page=${page}&pageSize=${pageSize}`),
  getDiaryById: (id) => request(`/api/diary/${id}`),
  createDiary: (data) =>
    request('/api/diary', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateDiary: (id, data) =>
    request(`/api/diary/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteDiary: (id) =>
    request(`/api/diary/${id}`, {
      method: 'DELETE',
    }),
  getPhotos: (page = 1, pageSize = 8) => 
    request(`/api/photo?page=${page}&pageSize=${pageSize}`),
  getPhotoById: (id) => request(`/api/photo/${id}`),
  createPhoto: (data) =>
    request('/api/photo', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePhoto: (id, data) =>
    request(`/api/photo/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deletePhoto: (id) =>
    request(`/api/photo/${id}`, {
      method: 'DELETE',
    }),
  getMusics: (page = 1, pageSize = 8) => 
    request(`/api/music?page=${page}&pageSize=${pageSize}`),
  getMusicById: (id) => request(`/api/music/${id}`),
  createMusic: (data) =>
    request('/api/music', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateMusic: (id, data) =>
    request(`/api/music/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteMusic: (id) =>
    request(`/api/music/${id}`, {
      method: 'DELETE',
    }),
  getPlans: (status = 'all') => request(`/api/plan?status=${status}`),
  getPlanById: (id) => request(`/api/plan/${id}`),
  createPlan: (data) =>
    request('/api/plan', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updatePlan: (id, data) =>
    request(`/api/plan/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deletePlan: (id) =>
    request(`/api/plan/${id}`, {
      method: 'DELETE',
    }),
  getTalks: () => request('/api/talk'),
  createTalk: (data) => request('/api/talk', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  updateTalk: (id, data) =>
    request(`/api/talk/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTalk: (id) => request(`/api/talk/${id}`, { method: 'DELETE' }),
  getTimes: (tag = 'all') => request(`/api/time?tag=${tag}`),
  getTimeById: (id) => request(`/api/time/${id}`),
  createTime: (data) =>
    request('/api/time', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateTime: (id, data) =>
    request(`/api/time/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  deleteTime: (id) =>
    request(`/api/time/${id}`, {
      method: 'DELETE',
    }),
  getSettings: () => request('/api/setting'),
  updateSettings: (data) => request('/api/setting', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
  adminLogin: (username, password) => 
    request('/api/admin/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  getAdminInfo: () => request('/api/admin/info'),
uploadImage: (file) => {
  const token = localStorage.getItem('token');
  
  const formData = new FormData();
  formData.append('file', file);  

  return fetch(`${API_BASE_URL}/api/upload/image`, {
    method: 'POST',
    headers: {
      ...(token && { Authorization: `Bearer ${token}` }), 
    },
    body: formData,  
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.success) {
        return data.data.url;
      } else {
        throw new Error(data.message || '上传失败');
      }
    });
},

};

export default api;
