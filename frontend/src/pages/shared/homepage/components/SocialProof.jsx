import React, { useState } from 'react';

import Icon from '@/components/AppIcon';
import Image from '@/components/AppImage';
import Button from '@/components/ui/Button';

const SocialProof = () => {
  const [activeTab, setActiveTab] = useState('reviews');

  const customerReviews = [
    {
      id: 1,
      name: "Nguyễn Thị Lan",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      rating: 5,
      review: `Chất lượng sản phẩm rất tốt, vải mềm mại và form dáng đẹp. Giao hàng nhanh chóng, đóng gói cẩn thận. Sẽ tiếp tục ủng hộ shop!`,
      product: "Váy Maxi Hoa Nhí",
      date: "2024-09-20",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      ]
    },
    {
      id: 2,
      name: "Trần Văn Minh",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      rating: 5,
      review: `Áo sơ mi chất lượng cao, thiết kế hiện đại và rất phù hợp cho môi trường công sở. Giá cả hợp lý so với chất lượng.`,
      product: "Áo Sơ Mi Trắng Classic",
      date: "2024-09-18",
      verified: true,
      images: []
    },
    {
      id: 3,
      name: "Lê Thị Hương",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      rating: 4,
      review: `Đầm dạ tiệc rất đẹp và sang trọng. Mình đã nhận được nhiều lời khen khi mặc. Dịch vụ khách hàng tuyệt vời!`,
      product: "Đầm Dạ Tiệc Đen",
      date: "2024-09-15",
      verified: true,
      images: [
        "https://images.unsplash.com/photo-1566479179817-c0b2b2c7e5b0?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
      ]
    }
  ];

  const instagramPosts = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      likes: 245,
      comments: 18,
      caption: "Loving this new summer collection! 💕 #SunnyFashion #SummerVibes"
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      likes: 189,
      comments: 12,
      caption: "Perfect outfit for the office! Professional yet stylish ✨"
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      likes: 312,
      comments: 25,
      caption: "Weekend casual look with Sunny Fashion pieces 🌟"
    },
    {
      id: 4,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      likes: 156,
      comments: 8,
      caption: "Cozy autumn vibes in this beautiful jacket 🍂"
    }
  ];

  const trustStats = [
    {
      icon: "Users",
      number: "50,000+",
      label: "Khách hàng hài lòng"
    },
    {
      icon: "Star",
      number: "4.8/5",
      label: "Đánh giá trung bình"
    },
    {
      icon: "ShoppingBag",
      number: "100,000+",
      label: "Đơn hàng đã giao"
    },
    {
      icon: "Award",
      number: "99%",
      label: "Tỷ lệ hài lòng"
    }
  ];

  const renderStars = (rating) => {
    return [...Array(5)]?.map((_, i) => (
      <Icon
        key={i}
        name="Star"
        size={16}
        className={i < rating ? 'text-accent fill-current' : 'text-muted-foreground'}
      />
    ));
  };

  return (
    <section className="py-24 bg-white border-t border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-serif text-slate-900 mb-4 font-light tracking-wide uppercase">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <div className="w-16 h-0.5 bg-slate-900 mx-auto mb-6"></div>
          <p className="text-base text-slate-500 max-w-2xl mx-auto font-light tracking-wide">
            Hàng nghìn khách hàng đã tin tưởng và lựa chọn Sunny Fashion Store
          </p>
        </div>

        {/* Trust Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12 mb-20">
          {trustStats?.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl lg:text-5xl font-serif text-slate-900 mb-3 font-light">
                {stat?.number}
              </div>
              <div className="text-xs font-semibold uppercase tracking-widest text-slate-400">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-12 border-b border-slate-200">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`pb-4 text-sm font-semibold uppercase tracking-widest transition-all duration-300 relative ${
                activeTab === 'reviews' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Đánh Giá Khách Hàng
            </button>
            <button
              onClick={() => setActiveTab('instagram')}
              className={`pb-4 text-sm font-semibold uppercase tracking-widest transition-all duration-300 relative ${
                activeTab === 'instagram' ? 'text-slate-900 border-b-2 border-slate-900' : 'text-slate-400 hover:text-slate-700'
              }`}
            >
              Instagram
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {customerReviews?.map((review) => (
              <div key={review?.id} className="bg-slate-50 p-8 border border-slate-100">
                {/* Review Header */}
                <div className="flex items-center gap-4 mb-6">
                  <Image
                    src={review?.avatar}
                    alt={review?.name}
                    className="w-14 h-14 object-cover rounded-full"
                  />
                  <div className="flex-1">
                    <h4 className="font-serif text-lg text-slate-900 mb-1">{review?.name}</h4>
                    <div className="flex items-center gap-1 text-yellow-500">
                      {renderStars(review?.rating)}
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <p className="text-slate-600 mb-6 font-light leading-relaxed italic">
                  "{review?.review}"
                </p>

                {/* Product Info */}
                <div className="text-[11px] uppercase tracking-widest text-slate-400 mb-6">
                  Đã mua: <span className="text-slate-900 font-semibold">{review?.product}</span>
                </div>

                {/* Review Images */}
                {review?.images?.length > 0 && (
                  <div className="flex gap-2 mb-6">
                    {review?.images?.map((image, index) => (
                      <div key={index} className="w-20 h-20 overflow-hidden bg-slate-200">
                        <Image
                          src={image}
                          alt="Review image"
                          className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                        />
                      </div>
                    ))}
                  </div>
                )}
                <div className="text-xs text-slate-400 font-light">
                  {new Date(review.date)?.toLocaleDateString('vi-VN')}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'instagram' && (
          <div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {instagramPosts?.map((post) => (
                <div key={post?.id} className="group relative aspect-square rounded-2xl overflow-hidden shadow-elegant hover:shadow-product transition-all duration-300">
                  <Image
                    src={post?.image}
                    alt="Instagram post"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <div className="text-white text-center">
                      <div className="flex items-center justify-center gap-4 mb-2">
                        <div className="flex items-center gap-1">
                          <Icon name="Heart" size={20} />
                          <span>{post?.likes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Icon name="MessageCircle" size={20} />
                          <span>{post?.comments}</span>
                        </div>
                      </div>
                      <p className="text-sm px-4 line-clamp-2">
                        {post?.caption}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instagram Follow CTA */}
            <div className="text-center">
              <Button size="lg" className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                <Icon name="Instagram" size={20} className="mr-2" />
                Theo Dõi @SunnyFashionStore
              </Button>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-24 bg-slate-50 border border-slate-200 p-12 lg:p-20 text-center text-slate-900">
          <h3 className="text-3xl lg:text-4xl font-serif mb-6 font-light">
            Nhận Thông Tin Bộ Sưu Tập Mới
          </h3>
          <p className="text-base text-slate-500 mb-10 max-w-2xl mx-auto font-light tracking-wide">
            Đăng ký để nhận thông tin mới nhất về các bộ sưu tập, chương trình ưu đãi độc quyền dành riêng cho khách hàng của Sunny Fashion.
          </p>
          
          <div className="max-w-xl mx-auto flex flex-col sm:flex-row gap-0">
            <input
              type="email"
              placeholder="Nhập địa chỉ email của bạn"
              className="flex-1 px-6 py-4 bg-white border border-slate-300 text-slate-900 placeholder-slate-400 focus:outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors"
            />
            <button className="px-10 py-4 bg-slate-900 text-white font-semibold text-sm uppercase tracking-widest hover:bg-slate-800 transition-colors">
              Đăng Ký
            </button>
          </div>
          
          <p className="text-xs text-slate-400 mt-6 tracking-wide">
            Bằng việc đăng ký, bạn đã đồng ý với Điều Khoản Dịch Vụ và Chính Sách Bảo Mật của chúng tôi.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;