import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000',
});

export const upScaleImage = (formData: FormData) => {
  return api.post('/upscale/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    responseType: 'blob'
  });
}