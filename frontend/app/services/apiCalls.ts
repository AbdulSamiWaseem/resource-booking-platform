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
      data: payload,
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
