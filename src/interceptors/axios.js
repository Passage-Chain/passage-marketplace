import axios from "axios";
import { getToken } from "../configs";

//import { useDispatch } from "react-redux";
import { setToken } from "../redux/accountSlice";
import store from "src/store";

const instance = () => {
  return axios.create({
    headers: {
      Authorization: 'Bearer ' + getToken(),
    },
  });
};
//axios.defaults.baseURL = 'http://localhost:8000/api/';

let refresh = false;

axios.interceptors.response.use(resp => resp, async error => {
  //const dispatch = useDispatch();
    if (error.response.status === 401 && !refresh) {
      const baseUrl = {host: (process.env.NODE_ENV === 'production' ? '' : "http://localhost:3001"),
        api: "/core/api",
        version: "/v1",}
        refresh = true;

        const response = await instance().post(`${baseUrl.host}${baseUrl.api}${baseUrl.version}/refreshToken`, {}, {withCredentials: true});

        if (response.status === 200) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${response.data['token']}`;
            store.dispatch(setToken(response.data.token));
            //dispatch(setToken(response.data.token));
            return axios(error.config);
        }
    }
    refresh = false;
    return error;
});
