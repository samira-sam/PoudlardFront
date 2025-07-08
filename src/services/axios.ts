// src/axios.ts
import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3033', // adapter selon backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default instance;
