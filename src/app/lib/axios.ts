// lib/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // 환경변수로 관리
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키 등 필요한 경우 설정
});

export default instance;
