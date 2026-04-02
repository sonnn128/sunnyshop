export const pushView = (product) => {
    try {
        if (!product || !product.id) return;

        const stored = localStorage.getItem('recentlyViewed');
        let recent = stored ? JSON.parse(stored) : [];

        // Remove existing same product to push to top
        recent = recent.filter(p => p.id !== product.id);

        // Add to front
        recent.unshift({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            factory: product.factory
        });

        // Limit to 10
        if (recent.length > 10) {
            recent.pop();
        }

        localStorage.setItem('recentlyViewed', JSON.stringify(recent));
    } catch (e) {
        console.error("Failed to update recently viewed", e);
    }
};
export const getRecentViews = () => {
    try {
        const stored = localStorage.getItem('recentlyViewed');
        return stored ? JSON.parse(stored) : [];
    } catch (e) {
        return [];
    }
};
