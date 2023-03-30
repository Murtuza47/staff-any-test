import { getAxiosInstance } from ".";

export const getShifts = async (startDayOfWeek: string, endDayOfWeek: string) => {
  const api = getAxiosInstance()
  const { data } = await api.get(`/shifts?order[date]=DESC&order[startTime]=ASC&startDayOfWeek=${startDayOfWeek}&endDayOfWeek=${endDayOfWeek}`);
  return data;
};

export const getShiftById = async (id: string) => {
  const api = getAxiosInstance()
  const { data } = await api.get(`/shifts/${id}`);
  return data;
};

export const createShifts = async (payload: any) => {
  const api = getAxiosInstance()
  const { data } = await api.post("/shifts", payload);
  return data;
};

export const updateShiftById = async (id: string, payload: any) => {
  const api = getAxiosInstance()
  const { data } = await api.patch(`/shifts/${id}`, payload);
  return data;
};

export const deleteShiftById = async (id: string) => {
  const api = getAxiosInstance()
  const { data } = await api.delete(`/shifts/${id}`);
  return data;
};

export const publishShift = async (startDayOfWeek: string, endDayOfWeek: string) => {
  const api = getAxiosInstance()
  const { data } = await api.get(`/shifts/publish?startDayOfWeek=${startDayOfWeek}&endDayOfWeek=${endDayOfWeek}`);
  return data;
};