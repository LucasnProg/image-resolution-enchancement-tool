import axios from 'axios';

const api = axios.create({
  baseURL: '/',
});

export const upScaleImage = (formData: FormData) => {
  return api.post('/upscale/', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    responseType: 'blob'
  });
}