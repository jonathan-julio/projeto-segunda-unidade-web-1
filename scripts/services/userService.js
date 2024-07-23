// services/UserService.js

import ApiService from "./apiService.js"; 

class UserService {
    static createUser(body) {
        return ApiService.request('/usuarios', 'POST', body);
    }

    static fetchUsers() {
        return ApiService.requestJSON('/usuarios/all', 'GET');
    }

    static fetchUserByLogin(login) {
        return ApiService.requestJSON(`/usuarios/login=${login}`, 'GET');
    }

    static patchPassword(body) {
        return ApiService.requestJSONWithAuth('/usuarios/patch-password', 'PATCH', body);
    }

    static recoverPassword(body, token) {
        return ApiService.requestJSON(`/usuarios/recover-password/token=${token}`, 'POST', body);
    }
    static login(body) {
        return ApiService.requestJSON(`/usuarios/auth`, 'POST', body);
    }

    static isConnected() {
        return ApiService.requestWithAuth(`/usuarios/check-token`, 'POST', null );
    }
}

export default UserService;
