import React from 'react';
import { Link } from 'react-router-dom';
import Icon from '../../../components/AppIcon';
import EmailSubscription from '../../../components/EmailSubscription';

const Footer = () => {
  const currentYear = new Date()?.getFullYear();

  const footerSections = [
    {
      title: "Về Sunny Fashion",
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
    <footer className="bg-slate-50 border-t border-slate-200 text-slate-900 font-sans">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 lg:gap-12 mb-20">
          
          {/* Company Info - wider column */}
          <div className="md:col-span-2 lg:col-span-4 space-y-8 pr-0 lg:pr-8">
            <Link to="/homepage" className="inline-block group">
              <span className="font-serif text-3xl tracking-widest text-slate-900 uppercase group-hover:opacity-70 transition-opacity">
                Sunny<span className="font-light">Fashion</span>
              </span>
            </Link>
            
            <p className="text-slate-500 text-[11px] uppercase justify-between tracking-[0.15em] leading-[2.2] max-w-sm">
              Điểm đến thời trang hàng đầu Việt Nam. Mang đến những thiết kế tinh tế và đẳng cấp nhất với hơn 50,000 khách hàng tin tưởng.
            </p>

            <div className="space-y-4 pt-4">
              <p className="text-[10px] uppercase tracking-widest text-slate-900 font-bold flex items-center gap-3">
                <Icon name="MapPin" size={14} className="text-slate-400" />
                123 Nguyễn Huệ, Quận 1, TP.HCM
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-900 font-bold flex items-center gap-3">
                <Icon name="Phone" size={14} className="text-slate-400" />
                1900 1234
              </p>
              <p className="text-[10px] uppercase tracking-widest text-slate-900 font-bold flex items-center gap-3">
                <Icon name="Mail" size={14} className="text-slate-400" />
                support@sunnyfashion.vn
              </p>
            </div>
            
            {/* Socials */}
            <div className="flex items-center gap-8 pt-6">
              {[
                { icon: 'Facebook', href: '#' },
                { icon: 'Instagram', href: '#' },
                { icon: 'Youtube', href: '#' },
              ].map((s, i) => (
                <a key={i} href={s.href} className="text-slate-400 hover:text-slate-900 transition-colors transform hover:-translate-y-1 duration-300">
                  <Icon name={s.icon} size={20} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Links */}
          {footerSections
            ?.filter((section) => section?.title !== "Kết nối với chúng tôi")
            ?.map((section, index) => (
            <div key={index} className="md:col-span-1 lg:col-span-2 space-y-8">
              <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">
                {section?.title}
              </h3>
              <ul className="space-y-5">
                {section?.links?.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    {link?.href?.startsWith('/') ? (
                      <Link
                        to={link?.href}
                        className="text-[11px] uppercase tracking-widest font-bold text-slate-900 hover:text-slate-500 transition-colors inline-block relative group"
                      >
                        {link?.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-slate-900 transition-all duration-300 group-hover:w-full" />
                      </Link>
                    ) : (
                      <a
                        href={link?.href}
                        className="text-[11px] uppercase tracking-widest font-bold text-slate-900 hover:text-slate-500 transition-colors inline-block relative group"
                      >
                        {link?.name}
                        <span className="absolute -bottom-1 left-0 w-0 h-px bg-slate-900 transition-all duration-300 group-hover:w-full" />
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="md:col-span-2 lg:col-span-4 space-y-8 pl-0 lg:pl-12 border-t lg:border-t-0 lg:border-l border-slate-200 pt-12 lg:pt-0 mt-8 lg:mt-0">
            <h3 className="text-[10px] uppercase font-bold tracking-[0.2em] text-slate-400">
              Cập nhật ưu đãi
            </h3>
            <p className="text-[11px] uppercase tracking-[0.15em] text-slate-900 leading-loose font-bold">
              Đăng ký ngay để nhận voucher độc quyền và các bộ sưu tập mới nhất.
            </p>
            <div className="pt-4">
              <EmailSubscription variant="minimal" />
            </div>
          </div>

        </div>

        {/* Bottom Bar Elements */}
        <div className="flex flex-col lg:flex-row justify-between items-center gap-10 pt-10 border-t border-slate-200">
          
          {/* Methods */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            {paymentMethods?.map((method, index) => (
              <div key={index} className="flex items-center gap-2 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer">
                 <Icon name={method?.icon} size={18} />
                 <span className="text-[10px] uppercase tracking-[0.1em] font-bold text-slate-900">{method?.name}</span>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
            <a href="#" className="text-[10px] uppercase font-bold tracking-[0.15em] text-slate-400 hover:text-slate-900 transition-colors">
              Chính sách bảo mật
            </a>
            <a href="#" className="text-[10px] uppercase font-bold tracking-[0.15em] text-slate-400 hover:text-slate-900 transition-colors">
              Điều khoản
            </a>
            <span className="text-[10px] uppercase tracking-[0.15em] text-slate-400 font-medium">
              © {currentYear} Sunny Fashion Store.
            </span>
          </div>

        </div>
      </div>
    </footer>
  );
};

export default Footer;