import axios from 'axios';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 15000,
});

// 요청 인터셉터 추가
api.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      data: config.data,
      headers: config.headers,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// 응답 인터셉터 추가
api.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers,
    });
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error(
        '서버 응답 시간이 초과되었습니다. 서버 상태를 확인해주세요.'
      );
    } else if (error.response) {
      console.error('서버 응답 에러:', {
        status: error.response.status,
        data: error.response.data,
      });
    } else if (error.request) {
      console.error(
        '서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.'
      );
    } else {
      console.error('요청 설정 중 에러 발생:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
