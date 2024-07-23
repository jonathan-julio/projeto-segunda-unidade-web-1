

import ApiService from './apiService.js';

class AdminService {
    static fetchLogs(id) {
        return ApiService.requestJSONWithAuth(`/admin/logs/${id}`, 'GET');
    }

    static fetchBlocked() {
        return ApiService.requestJSONWithAuth('/admin/bloqueados', 'GET');
    }

    static postPermissao(body) {
        return ApiService.requestJSONWithAuth('/admin/alterar-papel', 'POST', body);
    }

    static postAcesso(body) {
        return ApiService.requestJSONWithAuth('/admin/acesso-usuario', 'POST', body);
    }

    static patchPasswordAdmin(body) {
        return ApiService.requestJSONWithAuth('/admin/patch-password', 'PATCH', body);
    }
}

export default AdminService;
