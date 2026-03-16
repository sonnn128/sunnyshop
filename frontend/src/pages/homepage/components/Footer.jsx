import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import EmailSubscription from '../../../components/EmailSubscription';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: "Về ABC Fashion",
      links: [
        { name: "Giới thiệu", href: "#" },
        { name: "Tuyển dụng", href: "#" },
        { name: "Tin tức", href: "#" },
        { name: "Liên hệ", href: "#" }
      ]
    },
    {
      title: "Hỗ trợ khách hàng",
      links: [
        { name: "Hướng dẫn mua hàng", href: "#" },
        { name: "Chính sách đổi trả", href: "#" },
        { name: "Chính sách bảo mật", href: "#" },
        { name: "Điều khoản sử dụng", href: "#" }
      ]
    },
    {
      title: "Danh mục sản phẩm",
      links: [
        { name: "Thời trang nữ", href: "/product-catalog" },
        { name: "Thời trang nam", href: "/product-catalog" },
        { name: "Phụ kiện", href: "/product-catalog" },
        { name: "Giày dép", href: "/product-catalog" }
      ]
    },
    {
      title: "Kết nối với chúng tôi",
      links: [
        { name: "Facebook", href: "#", icon: "Facebook" },
        { name: "Instagram", href: "#", icon: "Instagram" },
        { name: "YouTube", href: "#", icon: "Youtube" },
        { name: "TikTok", href: "#", icon: "Music" }
      ]
    }
  ];

  const paymentMethods = [
    { name: "Visa", icon: "CreditCard" },
    { name: "Mastercard", icon: "CreditCard" },
    { name: "Momo", icon: "Smartphone" },
    { name: "ZaloPay", icon: "Smartphone" },
    { name: "VNPay", icon: "Smartphone" },
    { name: "COD", icon: "Banknote" }
  ];

  const certifications = [
    { name: "Đã thông báo Bộ Công Thương", icon: "Shield" },
    { name: "Chứng nhận SSL", icon: "Lock" },
    { name: "Chứng nhận ISO", icon: "Award" }
  ];

  return (
    <footer className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-blue-600/20 to-purple-600/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-emerald-600/20 to-blue-600/20 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
      </div>
      
      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-8">
          {/* Company Info - wider column */}
          <div className="md:col-span-1 lg:col-span-3 space-y-6">
            <Link to="/homepage" className="inline-flex items-center space-x-3 group">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                <Icon name="Sparkles" size={28} color="white" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-2xl text-white leading-none">
                  ABC Fashion
                </span>
                <span className="text-blue-300 text-sm leading-none">
                  Store
                </span>
              </div>
            </Link>
            
            <p className="text-slate-300 leading-relaxed">
              Điểm đến thời trang hàng đầu Việt Nam với hơn 50,000 khách hàng tin tưởng. 
              Chúng tôi mang đến những sản phẩm chất lượng cao với giá cả hợp lý.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3">
              {[
                { icon: 'Facebook', href: '#', color: 'hover:bg-blue-600' },
                { icon: 'Instagram', href: '#', color: 'hover:bg-pink-600' },
                { icon: 'Youtube', href: '#', color: 'hover:bg-red-600' },
                { icon: 'Music', href: '#', color: 'hover:bg-black' },
              ].map((s, i) => (
                <a key={i} href={s.href} className={`inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 ${s.color} transition-all duration-300 hover:scale-110 hover:shadow-lg`}>
                  <Icon name={s.icon} size={18} color="white" />
                </a>
              ))}
            </div>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
                  <Icon name="MapPin" size={16} className="text-blue-400" />
                </div>
                <span className="text-sm">123 Nguyễn Huệ, Q1, TP.HCM</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                  <Icon name="Phone" size={16} className="text-green-400" />
                </div>
                <span className="text-sm">1900 1234</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <Icon name="Mail" size={16} className="text-purple-400" />
                </div>
                <span className="text-sm">support@abcfashion.vn</span>
              </div>
              <div className="flex items-center gap-3 text-slate-300">
                <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Icon name="Clock" size={16} className="text-orange-400" />
                </div>
                <span className="text-sm">8:00 - 22:00 (Thứ 2 - CN)</span>
              </div>
            </div>
          </div>

          {/* Footer Links */}
          {footerSections
            ?.filter((section) => section?.title !== "Kết nối với chúng tôi")
            ?.map((section, index) => (
            <div key={index} className="md:col-span-1 lg:col-span-2 space-y-4">
              <h3 className="font-semibold text-lg text-white relative">
                {section?.title}
                <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
              </h3>
              <ul className="space-y-3">
                {section?.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link?.href?.startsWith('/') ? (
                      <Link
                        to={link?.href}
                        className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-200 block text-sm"
                      >
                        {link?.name}
                      </Link>
                    ) : (
                      <a
                        href={link?.href}
                        className="text-slate-300 hover:text-white hover:translate-x-1 transition-all duration-200 block text-sm"
                      >
                        {link?.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter as a column */}
          <div className="md:col-span-1 lg:col-span-3 space-y-4">
            <h3 className="font-semibold text-lg text-white relative">
              Đăng ký nhận tin
              <div className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
            </h3>
            <p className="text-slate-300 leading-relaxed text-sm">
              Nhận voucher độc quyền và cập nhật sản phẩm mới mỗi tuần.
            </p>
            <EmailSubscription compact className="bg-white/10 backdrop-blur-sm rounded-lg p-4" />
          </div>
        </div>
      </div>
      {/* Bottom Footer */}
      <div className="relative border-t border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Payment Methods & Certifications side-by-side */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
            <div>
              <h4 className="font-semibold mb-4 text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                Phương thức thanh toán
              </h4>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {paymentMethods?.map((method, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 text-center"
                  >
                    <Icon name={method?.icon} size={16} className="text-blue-400" />
                    <span className="text-xs text-slate-300 hidden sm:inline">{method?.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-4 text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Chứng nhận
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {certifications?.map((cert, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300"
                  >
                    <Icon name={cert?.icon} size={16} className="text-green-400" />
                    <span className="text-xs text-slate-300">{cert?.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-white/10">
            <div className="text-sm text-slate-400 mb-4 md:mb-0">
              © {currentYear} ABC Fashion Store. Tất cả quyền được bảo lưu.
            </div>
            
            <div className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">
                Chính sách bảo mật
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Điều khoản sử dụng
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Sitemap
              </a>
            </div>
          </div>

          {/* Business Registration */}
          <div className="mt-6 pt-6 border-t border-white/10 text-xs text-slate-500 text-center space-y-1">
            <p>
              Công ty TNHH ABC Fashion Store - GPKD số 0123456789 do Sở KH&ĐT TP.HCM cấp ngày 01/01/2020
            </p>
            <p>
              Địa chỉ: 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM - Điện thoại: 1900 1234
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;