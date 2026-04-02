import api from "@/config/api.js";

const getReviewsByProduct = (productId) => {
    return api.get(`/reviews/product/${productId}`);
};

const addReview = (reviewData) => {
    return api.post('/reviews', reviewData);
};

export const reviewService = {
    getReviewsByProduct,
    addReview
};
