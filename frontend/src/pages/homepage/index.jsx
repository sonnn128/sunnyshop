import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import HeroSection from './components/HeroSection';
import FeaturedCategories from './components/FeaturedCategories';
import ProductCarousel from './components/ProductCarousel';
import PromotionalBanners from './components/PromotionalBanners';
import SocialProof from './components/SocialProof';
import Footer from './components/Footer';
import ProductRecommendations from '../../components/ProductRecommendations';
import API from '../../lib/api';
import { summarizeVariantOptions } from '../../lib/productVariants';

const Homepage = () => {
  // API-backed product lists
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);

  const mapProductToCard = (p) => {
    if (!p) return null;
    const id = p._id || p.id || p.sku;
    const name = p.name || p.title || 'Sản phẩm';
    const category = (typeof p.category === 'object' ? p.category?.name : p.category) || '';
    const price = p.price ?? p.sale_price ?? p.final_price ?? 0;
    const originalPrice = p.original_price ?? p.compare_at_price ?? null;
    const image = Array.isArray(p.images)
      ? (p.images[0]?.image_url || p.images[0])
      : (p.image_url || p.image || '');
    const rating = p.rating ?? p.average_rating ?? 0;
    const reviews = p.reviewCount ?? p.reviews_count ?? (Array.isArray(p.reviews) ? p.reviews.length : 0) ?? 0;
    const createdAt = p.created_at || p.createdAt;
    const isNew = createdAt ? (Date.now() - new Date(createdAt).getTime() < 1000 * 60 * 60 * 24 * 30) : false;
    const discount = originalPrice && price && originalPrice > price
      ? Math.round(((originalPrice - price) / originalPrice) * 100)
      : null;
    const { sizes, colors: colorObjects } = summarizeVariantOptions(p);
    const colorSwatches = colorObjects.map((c) => c.color || c.value || c.name).filter(Boolean);
    return { 
      id,
      name,
      category,
      price,
      originalPrice,
      image,
      rating,
      reviews,
      isNew,
      discount,
      colors: colorSwatches,
      variants: p.variants || [],
      availableSizes: sizes,
      availableColors: colorObjects
    };
  };

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get('/api/products?status=active&limit=200');
        const products = res?.data?.products || res?.data?.data || res?.data || [];
        if (!Array.isArray(products) || !mounted) return;

        // Featured: prefer flagged, else top rated
        const featuredFlag = products.filter(p => p.is_featured || p.featured === true);
        const featured = (featuredFlag.length ? featuredFlag : products)
          .slice()
          .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
          .slice(0, 12)
          .map(mapProductToCard)
          .filter(Boolean);

        // New arrivals: newest by createdAt
        const byNew = products
          .slice()
          .sort((a, b) => new Date(b.created_at || b.createdAt || 0) - new Date(a.created_at || a.createdAt || 0))
          .slice(0, 12)
          .map(mapProductToCard)
          .filter(Boolean);

        // Best sellers: prefer sold_count, fallback to reviews
        const byBest = products
          .slice()
          .sort((a, b) => (b.sold_count ?? b.sales ?? (b.reviews_count ?? 0)) - (a.sold_count ?? a.sales ?? (a.reviews_count ?? 0)))
          .slice(0, 12)
          .map(mapProductToCard)
          .filter(Boolean);

        if (!mounted) return;
        setFeaturedProducts(featured);
        setNewArrivals(byNew);
        setBestSellers(byBest);
      } catch (e) {
        // Keep empty lists on error (no mock data)
        if (!mounted) return;
        setFeaturedProducts([]);
        setNewArrivals([]);
        setBestSellers([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="pt-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Featured Categories */}
        <FeaturedCategories />

        {/* Featured Products Carousel */}
        <ProductCarousel
          title="Sản Phẩm Nổi Bật"
          subtitle="Những món đồ được yêu thích nhất tại ABC Fashion Store"
          products={featuredProducts}
          sectionId="featured"
        />

        {/* Promotional Banners */}
        <PromotionalBanners />

        {/* New Arrivals Carousel */}
        <ProductCarousel
          title="Hàng Mới Về"
          subtitle="Cập nhật xu hướng thời trang mới nhất 2024"
          products={newArrivals}
          sectionId="new-arrivals"
        />

        {/* Best Sellers Carousel */}
        <ProductCarousel
          title="Bán Chạy Nhất"
          subtitle="Những sản phẩm được khách hàng tin tưởng và lựa chọn nhiều nhất"
          products={bestSellers}
          sectionId="best-sellers"
        />

        {/* Product Recommendations */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4">
            <ProductRecommendations
              title="Dành Riêng Cho Bạn"
              limit={8}
              showTrending={false}
            />
          </div>
        </section>

        {/* Social Proof Section */}
        <SocialProof />
      </main>

      <Footer />
    </div>
  );
};

export default Homepage;