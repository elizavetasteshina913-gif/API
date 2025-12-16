import CarsController from "./CarsController.js";
import {QAAUTO_API_URL} from "../constants/api.js";


export default class AuthController {
    constructor(client) {
        this.client = client;
    }

    signUp(userData) {
        return this.client.post('/api/auth/signup', userData);
    }

    signIn(credentials) {
        return this.client.post('/api/auth/signin', credentials);
    }

    logout() {
        return this.client.post('/api/auth/logout');
    }
}
