// services/ApiService.js

export const API_URL = 'http://localhost:8080/api';

class ApiService {
    static async request(endpoint, method, body, headers = {}) {
        const config = {
            method,
            headers: { 'Content-Type': 'application/json', ...headers },
            body: body ? JSON.stringify(body) : null,
        };
        const response = await fetch(`${API_URL}${endpoint}`, config);
        return response;
    }
    static async requestFD(endpoint, method, body, headers = {}) {
        const config = {
            method,
            headers: { ...headers },
            body: body
        };
        const response = await fetch(`${API_URL}${endpoint}`, config);
        return response;
    }

    static async requestFormData(endpoint, method, body) {
        return this.requestFD(endpoint, method, body, { 'Authorization': `Bearer ${localStorage.token}` });
    }

    static async requestWithAuth(endpoint, method, body) {
        return this.request(endpoint, method, body, { 'Authorization': `Bearer ${localStorage.token}` });
    }

    static async requestJSON(endpoint, method, body, headers = {}) {
        const response = await this.request(endpoint, method, body, headers);
        return response;
    }

    static async requestJSONWithAuth(endpoint, method, body) {
        const response = await this.requestWithAuth(endpoint, method, body);
        return response;
    }
}

export default ApiService;
