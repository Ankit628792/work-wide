import AsyncStorage from "@react-native-async-storage/async-storage"
import axios from "axios";

// axios.defaults.baseURL = 'http://localhost:3000/api';
axios.defaults.baseURL = 'https://cornerqube-backend-9imbl.ondigitalocean.app/api';

const routes = {
    auth: '/auth',
    generateQR: '/qr/generate',
}

export const getEmployee = async () => {
    let token = await AsyncStorage.getItem('app_token');
    try {
        let res = await axios.get(routes.auth, { headers: { Authorization: `Bearer ${token}` } })
        return res.data
    } catch (error) {
        return {
            success: false,
            message: 'Something Went wrong'
        }
    }
}

export const postEmployee = async (data) => {
    let token = await AsyncStorage.getItem('app_token');
    try {
        let res = await axios.post(routes.auth, data, { headers: { Authorization: `Bearer ${token}` } })
        return res.data
    } catch (error) {
        return {
            success: false,
            message: 'Something Went wrong'
        }
    }
}

export const generateQR = async () => {
    let token = await AsyncStorage.getItem('app_token');

    try {
        let res = await axios.get(routes.generateQR, { headers: { Authorization: `Bearer ${token}` } })
        return res.data
    } catch (error) {
        return {
            success: false,
            message: 'Something Went wrong'
        }
    }
}
