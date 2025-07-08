import axios from '@/services/axios';

const API_URL = '/concours';

export const getConcoursByAnnee = (idAnnee: number) => {
  return axios.get(`${API_URL}/annee/${idAnnee}`);
};
