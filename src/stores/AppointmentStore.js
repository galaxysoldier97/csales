import { defineStore } from 'pinia';
import axios from 'axios';

const API_BASE = import.meta.env?.VITE_APP_API_URL ?? '/api/appointment';

const http = axios.create({
  baseURL: API_BASE,
  withCredentials: false,
});

http.interceptors.request.use(
  (config) => {
    config.headers['Access-Control-Allow-Origin'] = '*';
    config.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS, PUT, PATCH, DELETE';
    config.headers['Access-Control-Allow-Credentials'] = 'false';
    return config;
  },
  (error) => Promise.reject(error)
);

const normalizeRecords = (records) => {
  if (!records) return [];
  return Array.isArray(records) ? records : [records];
};

export const useAppointmentStore = defineStore('appointment', {
  state: () => ({
    entryDates: null,
    records: [],
    sourceSystem: null,
    taskId: null,
    ProcesId: null,
    LoadingTemplate: true,
    LoadingTemplateProccess: false,
    hasRecords: null,
    canUnify: null,
    appointments: [],
    tasks: [],
    dueDateDays: null,
    error: null,
    isError: false,
    saveError: null,
    errorMessage: null,
  }),
  actions: {
    setRouteContext({ processId, ProcesId, sourceSystem, taskId }) {
      const resolvedProcess = processId ?? ProcesId;
      this.ProcesId = resolvedProcess ?? this.ProcesId;
      this.sourceSystem = sourceSystem ?? this.sourceSystem;
      this.taskId = taskId ?? this.taskId;
    },

    async fetchEvents({ processId, sourceSystem, taskId } = {}) {
      if (processId || sourceSystem || taskId) {
        this.setRouteContext({ processId, sourceSystem, taskId });
      }

      if (!this.ProcesId || !this.sourceSystem) {
        this.isError = true;
        this.errorMessage = `Error: ${!this.ProcesId ? 'Falto el parametro ProcessID.' : ''} ${!this.sourceSystem ? 'Falto el parametro SourceSystem.' : ''}`.trim();
      this.LoadingTemplate = false;
        return;
      }

      this.LoadingTemplate = true;
      this.isError = false;
      this.errorMessage = null;
      this.saveError = null;

      try {
        const { data } = await http.post(`/${this.ProcesId}/${this.sourceSystem}/check-availability`);

        this.entryDates = data ?? null;
        this.canUnify = data?.Unificacion ?? false;
        this.records = normalizeRecords(data?.record);
        this.hasRecords = this.records.length > 0;
        this.LoadingTemplate = false;
      } catch (error) {
        this.LoadingTemplate = false;
        this.entryDates = null;
        this.records = [];
        this.hasRecords = false;
        this.isError = true;
        this.saveError = error.response ?? null;
        this.error = error.response?.data?.message || error.message;
        this.errorMessage = this.error;
        throw error;
      }
    },

    async timeInterval(payload) {
      try {
        const { data } = await http.post('/check-availability', payload);
        this.entryDates = data ?? null;
        this.records = normalizeRecords(data?.record);
        this.hasRecords = this.records.length > 0;
        this.canUnify = data?.Unificacion ?? this.canUnify;
        this.isError = false;
        this.errorMessage = null;
        return data;
      } catch (error) {
        this.entryDates = null;
        this.records = [];
        this.hasRecords = false;
        this.isError = true;
        this.saveError = error.response ?? null;
        this.error = error.response?.data?.message || error.message;
        this.errorMessage = this.error;
        throw error;
      }
    },

    async checkAvailabilityDigital(payload) {
      try {
        const { data } = await http.post('/check-availability-digital', payload);
        this.entryDates = data ?? null;
        this.records = normalizeRecords(data?.record);
        this.hasRecords = this.records.length > 0;
        this.canUnify = data?.Unificacion ?? this.canUnify;
        this.isError = false;
        this.errorMessage = null;
        return data;
      } catch (error) {
        this.entryDates = null;
        this.records = [];
        this.hasRecords = false;
        this.isError = true;
        this.saveError = error.response ?? null;
        this.error = error.response?.data?.message || error.message;
        this.errorMessage = this.error;
        throw error;
      }
    },

    async newAppointment(payload) {
      try {
        this.LoadingTemplateProccess = true;
        const { data } = await http.post('/NewsetAppointments', payload);
        this.appointments.push(data);
        this.LoadingTemplateProccess = false;
        return data;
      } catch (error) {
        this.LoadingTemplateProccess = false;
        this.saveError = error.response ?? null;
        this.error = error.response?.data?.message || error.message;
        throw error;
      }
    },

    async getTaskStatus(payload) {
      try {
        this.LoadingTemplateProccess = true;
        const { data } = await http.post('/new-get-task', payload);
        this.LoadingTemplateProccess = false;
        return data;
      } catch (error) {
        this.LoadingTemplateProccess = false;
        this.saveError = error.response ?? null;
        this.error = error.response?.data?.message || error.message;
        throw error;
      }
    },

    async updateStatus(payload) {
      try {
        this.LoadingTemplate = true;
        const { data } = await http.post('/update-status', payload);
        this.LoadingTemplate = false;
        return data;
      } catch (error) {
        this.LoadingTemplate = false;
        this.saveError = error.response ?? null;
        this.error = error.response?.data?.message || error.message;
        throw error;
      }
    },

    async dispatchStatus(payload) {
      try {
        this.LoadingTemplate = true;
        const { data } = await http.post('/update-status', payload);
        this.LoadingTemplate = false;
        return data;
      } catch (error) {
        this.LoadingTemplate = false;
        this.saveError = error.response ?? null;
        this.error = error.response?.data?.message || error.message;
        throw error;
      }
    },

    async confirmAppointmentDigital(payload) {
      try {
        const { data } = await http.post('/confirmAppointments', payload);
        return data;
      } catch (error) {
        this.saveError = error.response ?? null;
        this.error = error.response?.data?.message || error.message;
        throw error;
      }
    },

    async searchDueDate() {
      try {
        const { data } = await http.post('/dueDate');
        this.dueDateDays = data?.records?.dueDate ?? null;
        return this.dueDateDays;
      } catch (error) {
        this.saveError = error.response ?? null;
        this.error = error.response?.data?.message || error.message;
        throw error;
      }
    },

    async getTask(id, source) {
      try {
        const { data } = await http.get(`/${id}/${source}/get-task`);
        this.tasks = data;
        this.error = null;
        return data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        this.tasks = [];
        throw error;
      }
    },

    async getTaskByAccountId(accountId) {
      try {
        const { data } = await http.get('/getTaskByAccountId', { params: { accountId } });
        this.tasks = data;
        this.error = null;
        return data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        this.tasks = [];
        throw error;
      }
    },

    async getTaskByCustomerId(customerId) {
      try {
        const { data } = await http.get('/getTaskByCustomerId', { params: { customerId } });
        this.tasks = data;
        this.error = null;
        return data;
      } catch (error) {
        this.error = error.response?.data?.message || error.message;
        this.tasks = [];
        throw error;
      }
    },
  },
});
