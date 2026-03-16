import React, { useState } from 'react';

import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

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
      caption: "Loving this new summer collection! 💕 #ABCFashion #SummerVibes"
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
      caption: "Weekend casual look with ABC Fashion pieces 🌟"
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
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Khách Hàng Nói Gì Về Chúng Tôi
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Hàng nghìn khách hàng đã tin tưởng và lựa chọn ABC Fashion Store
          </p>
        </div>

        {/* Trust Statistics */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {trustStats?.map((stat, index) => (
            <div key={index} className="text-center bg-background rounded-2xl p-6 shadow-elegant">
              <div className="w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={stat?.icon} size={24} className="text-accent" />
              </div>
              <div className="text-2xl lg:text-3xl font-bold text-foreground mb-2">
                {stat?.number}
              </div>
              <div className="text-sm text-muted-foreground">
                {stat?.label}
              </div>
            </div>
          ))}
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-background rounded-lg p-1 shadow-elegant">
            <button
              onClick={() => setActiveTab('reviews')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'reviews' ?'bg-accent text-accent-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Đánh Giá Khách Hàng
            </button>
            <button
              onClick={() => setActiveTab('instagram')}
              className={`px-6 py-2 rounded-md font-medium transition-all duration-200 ${
                activeTab === 'instagram' ?'bg-accent text-accent-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
              }`}
            >
              Instagram
            </button>
          </div>
        </div>

        {/* Content Tabs */}
        {activeTab === 'reviews' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {customerReviews?.map((review) => (
              <div key={review?.id} className="bg-background rounded-2xl p-6 shadow-elegant">
                {/* Review Header */}
                <div className="flex items-center gap-3 mb-4">
                  <Image
                    src={review?.avatar}
                    alt={review?.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">{review?.name}</h4>
                      {review?.verified && (
                        <Icon name="BadgeCheck" size={16} className="text-success" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      {renderStars(review?.rating)}
                    </div>
                  </div>
                </div>

                {/* Review Content */}
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {review?.review}
                </p>

                {/* Product Info */}
                <div className="text-sm text-muted-foreground mb-4">
                  Sản phẩm: <span className="font-medium text-foreground">{review?.product}</span>
                </div>

                {/* Review Images */}
                {review?.images?.length > 0 && (
                  <div className="flex gap-2 mb-4">
                    {review?.images?.map((image, index) => (
                      <div key={index} className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={image}
                          alt="Review image"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Review Date */}
                <div className="text-xs text-muted-foreground">
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
                Theo Dõi @ABCFashionStore
              </Button>
            </div>
          </div>
        )}

        {/* Newsletter Signup */}
        <div className="mt-16 bg-gradient-to-r from-primary to-accent rounded-3xl p-8 lg:p-12 text-center text-white">
          <h3 className="text-2xl lg:text-3xl font-bold mb-4">
            Đăng Ký Nhận Tin Khuyến Mãi
          </h3>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Là người đầu tiên biết về các sản phẩm mới, khuyến mãi đặc biệt và xu hướng thời trang hot nhất
          </p>
          
          <div className="max-w-md mx-auto flex gap-3">
            <input
              type="email"
              placeholder="Nhập email của bạn"
              className="flex-1 px-4 py-3 rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-white"
            />
            <Button className="bg-white text-primary hover:bg-white/90 px-6">
              Đăng Ký
            </Button>
          </div>
          
          <p className="text-sm text-white/70 mt-4">
            Bằng cách đăng ký, bạn đồng ý với điều khoản sử dụng của chúng tôi
          </p>
        </div>
      </div>
    </section>
  );
};

export default SocialProof;