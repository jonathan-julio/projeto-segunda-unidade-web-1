// services/PostService.js

import ApiService from "./apiService.js";

class PostService {
    static createPost(body) {
        return ApiService.requestFormData('/post', 'POST', body);
    }

    static fetchPost(postId) {
        return ApiService.requestJSON(`/post/${postId}`, 'GET');
    }

    static updatePost(body) {
        return ApiService.requestFormData('/post/edit', 'PUT', body);
    }

    static deletePost(postId) {
        return ApiService.requestJSONWithAuth(`/post/delete=${postId}`, 'DELETE');
    }

    static fetchAllPosts() {
        return ApiService.requestJSONWithAuth('/post/posts', 'GET');
    }

    static fetchPostById(id) {
        return ApiService.requestJSON(`/post/${id}`, 'GET');
    }
}

export default PostService;
