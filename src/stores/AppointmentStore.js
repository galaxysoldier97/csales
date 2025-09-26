import { defineStore } from 'pinia';
import axios from 'axios';

const API_PREFIX = '/api/appointment';
const API_BASE = import.meta.env?.VITE_APP_API_URL || ''; // opcional

// axios con baseURL opcional (si VITE_APP_API_URL existe, se prefiere)
const http = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

// Interceptor (similar a tu proyecto anterior) por si luego necesitas token/headers
http.interceptors.request.use(
  (config) => {
    // const token = localStorage.getItem('user_key');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, PATCH, DELETE';
    config.headers['Access-Control-Allow-Credentials'] = 'false';
    return config;
  },
  (error) => Promise.reject(error)
);

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    appointments: [],
    tasks: [],
    availability: null,
    error: null,
  }),
  actions: {
    // ====== CHECK AVAILABILITY ====== 1ra llamada del onMounted
     async checkAvailability(id, source) {
      try {
        const url = `${API_PREFIX}/${id}/${source}/check-availability`;
        const { data: resp } = await http.post(url);
        this.availability = resp;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
        this.availability = null;
      }
    },

    // ====== CHECK AVAILABILITY GENERAL (solo fecha desde el input) ======
    async timeInterval(data) {
      try {
        const url = `${API_PREFIX}/check-availability`;
        const { data: resp } = await http.post(url, data);
        this.availability = resp;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
        this.availability = null;
      }
    },

    // ====== TASKS ======
    async getTask(id, source) {
      try {
        const url = `${API_PREFIX}/${id}/${source}/get-task`;
        const { data } = await http.get(url);
        this.tasks = data;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
        this.tasks = [];
      }
    },

    async getTaskByAccountId(accountId) {
      try {
        const { data } = await http.get(`${API_PREFIX}/getTaskByAccountId`, { params: { accountId } });
        this.tasks = data;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
        this.tasks = [];
      }
    },

    async getTaskByCustomerId(customerId) {
      try {
        const { data } = await http.get(`${API_PREFIX}/getTaskByCustomerId`, { params: { customerId } });
        this.tasks = data;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
        this.tasks = [];
      }
    },

    // ====== APPOINTMENTS ======
    async setAppointment(payload) {
      try {
        const { data } = await http.post(`${API_PREFIX}/setAppointments`, payload);
        this.appointments.push(data);
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
      }
    },

    async setAppointmentVIP(payload) {
      try {
        const { data } = await http.post(`${API_PREFIX}/setAppointmentsVIP`, payload);
        this.appointments.push(data);
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
      }
    },

    async updateStatus(payload) {
      try {
        await http.post(`${API_PREFIX}/update-status`, payload);
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
      }
    },

    async confirmAppointment_Digital(payload) {
      try {
        await http.post(`${API_PREFIX}/confirmAppointments`, payload);
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
      }
    },

    async timeInterval_Digital(payload) {
      try {
        const { data } = await http.post(`${API_PREFIX}/check-availability-digital`, payload);
        this.availability = data;
        this.error = null;
      } catch (error) {
        this.error = error.response?.data?.message || 'An error occurred';
        this.availability = null;
      }
    },
  },
});
