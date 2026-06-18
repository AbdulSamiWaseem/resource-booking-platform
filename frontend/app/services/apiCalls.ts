import axios from 'axios';

const apiCall = async (
  method: string,
  payload: any,
  route: string,
  onSuccess: (data: any) => void = () => { },
  onError: (error: any) => void = () => { },
) => {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
    const url = `${baseUrl}${route}`;

    const config: any = {
      method,
      url,
      ...(method.toLowerCase() === 'get' ? {} : { data: payload }),
    };

    const response = await axios.request(config);

    if (response?.data?.code === 200) {
      onSuccess(response.data);
      return { status: 200, response: response.data };
    } else {
      onError(response);
      return response;
    }
  } catch (e: any) {
    const errorMessage = e?.response?.data || e;
    onError(errorMessage);
    return {
      status: 400,
      response: e?.response?.data || { message: e.toString() },
    };
  }
};

export const postRequest = (
  payload: any,
  route: string,
  onSuccess: (data: any) => void = () => { },
  onError: (error: any) => void = () => { },
) => {
  return apiCall('post', payload, route, onSuccess, onError);
};

export const getRequest = (
  route: string,
  onSuccess: (data: any) => void = () => { },
  onError: (error: any) => void = () => { },
) => {
  return apiCall('get', null, route, onSuccess, onError);
};

export const deleteRequest = (
  payload: any,
  route: string,
  onSuccess: (data: any) => void = () => { },
  onError: (error: any) => void = () => { },
) => {
  return apiCall('delete', payload, route, onSuccess, onError);
};

export const putRequest = (
  payload: any,
  route: string,
  onSuccess: (data: any) => void = () => { },
  onError: (error: any) => void = () => { },
) => {
  return apiCall('put', payload, route, onSuccess, onError);
};

export const getApi = async (route: string) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await axios.get(`${baseUrl}${route}`);
  return res.data.data;
};

export const postApi = async (route: string, payload: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await axios.post(`${baseUrl}${route}`, payload);
  return res.data;
};

export const deleteApi = async (route: string, payload?: any) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const res = await axios.delete(`${baseUrl}${route}`, { data: payload });
  return res.data;
};


