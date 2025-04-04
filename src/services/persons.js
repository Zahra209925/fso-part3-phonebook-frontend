import axios from 'axios';
const baseUrl = '/api/persons';

const getAll = () => {
  return axios.get(baseUrl).then(response => response.data);
};

const create = (newObject) => {
  return axios.post(baseUrl, newObject).then(response => response.data);
};

const remove = (id) => {
  return axios.delete(`${baseUrl}/${id}`);
};

export default { getAll, create, remove };