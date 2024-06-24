import axios from 'axios';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/slices/UserSlice';
import { removeNotification } from '../../store/slices/Notification';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const useAxiosInterceptor = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    axios.interceptors.response.use(
        response => response,
        error => {
            if (error.response.status === 401) {
                dispatch(logout());
                dispatch(removeNotification());
                Cookies.remove("access_token");
                localStorage.removeItem("user");
                navigate('/login');
            }
            return Promise.reject(error);
        }
    );
};

export default useAxiosInterceptor;
