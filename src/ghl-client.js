const axios = require('axios');
const config = require('./config');

const client = axios.create({
  baseURL: config.baseURL,
  headers: config.headers,
  timeout: 15000,
});

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const message = err.response?.data?.message || err.message;
    const url = err.config?.url;
    throw new Error(`GHL API error [${status}] ${url}: ${message}`);
  }
);

async function post(path, body) {
  const res = await client.post(path, body);
  return res.data;
}

async function get(path) {
  const res = await client.get(path);
  return res.data;
}

async function postForm(path, formData) {
  const res = await client.post(path, formData, {
    headers: {
      ...config.headers,
      ...formData.getHeaders(),
    },
  });
  return res.data;
}

module.exports = { post, get, postForm };
