import api from "@/config/api.js";

const getMyWishlist = () => {
    return api.get('/wishlists');
};

const addToWishlist = (productId) => {
    return api.post(`/wishlists/${productId}`);
};

const removeFromWishlist = (productId) => {
    return api.delete(`/wishlists/${productId}`);
};

const checkWishlist = (productId) => {
    return api.get(`/wishlists/check/${productId}`);
};

export const wishlistService = {
    getMyWishlist,
    addToWishlist,
    removeFromWishlist,
    checkWishlist
};
