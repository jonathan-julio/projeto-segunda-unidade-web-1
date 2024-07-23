// services/PasswordService.js

import ApiService from './apiService';

class PasswordService {
    static resetPassword(body) {
        return ApiService.requestJSON('http://localhost:8090/api/email', 'POST', body);
    }
}

export default PasswordService;
