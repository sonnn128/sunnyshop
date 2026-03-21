import React from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const StylingTips = ({ product, stylingTips }) => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-6">
        <Icon name="Sparkles" size={20} className="text-accent" />
        <h2 className="text-xl font-semibold text-foreground">
          Gợi ý phối đồ
        </h2>
      </div>
      <div className="space-y-6">
        {stylingTips?.map((tip, index) => (
          <div key={index} className="border border-border rounded-lg p-4">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <div className="w-16 h-16 bg-accent/10 rounded-lg flex items-center justify-center">
                  <Icon name={tip?.icon} size={24} className="text-accent" />
                </div>
              </div>
              
              <div className="flex-1">
                <h3 className="font-medium text-foreground mb-2">{tip?.title}</h3>
                <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                  {tip?.description}
                </p>

                {/* Styling Images */}
                {tip?.images && tip?.images?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                    {tip?.images?.map((image, imgIndex) => (
                      <div key={imgIndex} className="relative aspect-square rounded-lg overflow-hidden">
                        <Image
                          src={image?.src}
                          alt={image?.alt}
                          className="w-full h-full object-cover hover:scale-105 transition-smooth cursor-pointer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-smooth">
                          <div className="absolute bottom-2 left-2 right-2">
                            <p className="text-white text-xs font-medium">
                              {image?.caption}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Recommended Products */}
                {tip?.recommendedProducts && tip?.recommendedProducts?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-foreground mb-3">
                      Sản phẩm phối cùng:
                    </h4>
                    <div className="flex space-x-3 overflow-x-auto pb-2">
                      {tip?.recommendedProducts?.map((product, prodIndex) => (
                        <div key={prodIndex} className="flex-shrink-0 w-20">
                          <div className="w-16 h-16 bg-muted rounded-lg overflow-hidden mb-2">
                            <Image
                              src={product?.image}
                              alt={product?.name}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <p className="text-xs text-muted-foreground text-center line-clamp-2">
                            {product?.name}
                          </p>
                          <p className="text-xs font-medium text-accent text-center">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND'
                            })?.format(product?.price)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {tip?.tags && tip?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {tip?.tags?.map((tag, tagIndex) => (
                      <span
                        key={tagIndex}
                        className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Call to Action */}
      <div className="mt-6 p-4 bg-accent/5 rounded-lg border border-accent/20">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-foreground mb-1">
              Cần tư vấn thêm về phối đồ?
            </h3>
            <p className="text-sm text-muted-foreground">
              Đội ngũ stylist của chúng tôi sẵn sàng hỗ trợ bạn
            </p>
          </div>
          <Button variant="outline" size="sm" iconName="MessageCircle" iconPosition="left">
            Tư vấn ngay
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StylingTips;