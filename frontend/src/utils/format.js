export const formatPrice = (price) => {
    if (price === undefined || price === null) return '0 ₫';
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};
