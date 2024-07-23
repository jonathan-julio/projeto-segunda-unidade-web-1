// services/ProfileService.js

import ApiService from './apiService.js';

class ProfileService {
    static fetchProfileByUsername(username) {
        return ApiService.requestJSON(`/usuarios/login=${username}`, 'GET');
    }

    static putProfile(body) {
        return ApiService.requestJSONWithAuth('/profile/edit', 'PUT', body);
    }

    static fetchPerson() {
        return ApiService.requestJSONWithAuth(`/person/${localStorage.id}`, 'GET');
    }

    static patchPerson(body) {
        return ApiService.requestJSONWithAuth('/person/patch', 'PATCH', body);
    }
}

export default ProfileService;
