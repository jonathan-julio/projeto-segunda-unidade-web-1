// services/UploadService.js

import { API_URL} from './apiService';

class UploadService {
    static async uploadImage(imageFile) {
        if (!imageFile) {
            console.error('Nenhum arquivo selecionado');
            return;
        }

        const formData = new FormData();
        formData.append('imagemFile', imageFile);

        const response = await fetch(`${API_URL}/usuarios/imagem`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${localStorage.token}` },
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
        }
    }
}

export default UploadService;
