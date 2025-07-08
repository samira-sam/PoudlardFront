import axios from 'axios';

const API_URL = 'http://localhost:3033/rentrees';

export const getRentrees = () => {
  return axios.get(API_URL);
};
