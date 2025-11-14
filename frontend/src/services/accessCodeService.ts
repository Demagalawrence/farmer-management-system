import axios from 'axios';

const API = 'http://localhost:5000/api/access-codes';

export const accessCodeService = {
  async getActive() {
    const token = localStorage.getItem('token');
    const res = await axios.get(`${API}/active`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data?.data || [];
  },

  async generate(role: 'field_officer' | 'finance' | 'manager') {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${API}/generate`, { role }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data?.data;
  },

  async expire(code: string) {
    const token = localStorage.getItem('token');
    const res = await axios.post(`${API}/expire`, { code }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return res.data;
  }
};
