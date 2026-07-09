import api from './api';

const trainService = {
  getAllTrains: async () => {
    const response = await api.get('/trains');
    return response.data;
  },

  searchTrains: async (source, destination, date) => {
    const response = await api.get('/trains/search', {
      params: { source, destination, date }
    });
    return response.data;
  },

  getTrainById: async (id) => {
    const response = await api.get(`/trains/${id}`);
    return response.data;
  }
};

export default trainService;
