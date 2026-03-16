import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../AppIcon';
import Button from './Button';
import API, { API_ENABLED } from '../../lib/api';
import cart from '../../lib/cart';
import { useWishlist } from '../../contexts/WishlistContext';

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);
  const location = useLocation();

  // Use Wishlist Context
  const { count: wishlistCount } = useWishlist();

  const primaryNavItems = [
    { name: 'Trang chủ', path: '/homepage', icon: 'Home' },
    { name: 'Sản phẩm', path: '/product-catalog', icon: 'ShoppingBag' },
    // cart handled via action icon (do not include in primary list to avoid duplication)
    { name: 'Tài khoản', path: '/user-dashboard', icon: 'User' },
  ];

  const secondaryNavItems = [
    // Admin removed from header for regular users
  ];

  const isActivePath = (path) => location?.pathname === path;

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const toggleMoreMenu = () => {
    setIsMoreMenuOpen(!isMoreMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Cart state & synchronization
  const [cartOpen, setCartOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [cartCount, setCartCount] = useState(0);
  const [cartTotal, setCartTotal] = useState(0);
  const [apiCartEnabled, setApiCartEnabled] = useState(false);
  const cartRef = useRef(null);

  const deriveUniqueProductCount = (items) => {
    if (!Array.isArray(items) || items.length === 0) return 0;
    const idSet = new Set();
    items.forEach((it) => {
      const pid = it?.productId || it?.id || it?._id;
      if (pid) idSet.add(String(pid));
    });
    return idSet.size;
  };

  const parseCartFromStorage = () => {
    try {
      // new helper persists under 'cart_v1' key; support legacy 'cart' too
      const keyCandidates = ['cart_v1', 'cart'];
      let raw = null;
      for (const k of keyCandidates) {
        raw = typeof window !== 'undefined' && localStorage.getItem(k);
        if (raw) break;
      }
      if (!raw) return { items: [], count: 0, total: 0 };
      const parsed = JSON.parse(raw);
      const items = Array.isArray(parsed) ? parsed : (parsed.items || []);
      const count = deriveUniqueProductCount(items);
      const total = typeof parsed.total === 'number' ? parsed.total : items.reduce((s, it) => s + (Number(it.price || it.price || 0) * (Number(it.quantity || it.qty || 1))), 0);
      return { items, count, total };
    } catch (e) { return { items: [], count: 0, total: 0 }; }
  };

  const refreshCart = async () => {
    // Use helper; helper itself respects API_ENABLED. We still mark apiCartEnabled based on API_ENABLED
    try {
      const c = await cart.fetchCart();
      const items = c?.items || [];
      const count = deriveUniqueProductCount(items);
      const total = typeof c.total === 'number' ? c.total : items.reduce((s, it) => s + (Number(it.price || 0) * (Number(it.quantity || it.qty || 1))), 0);
      setCartItems(items);
      setCartCount(count);
      setCartTotal(total);
      setApiCartEnabled(!!API_ENABLED);
    } catch (e) {
      const { items, count, total } = parseCartFromStorage();
      setCartItems(items);
      setCartCount(count);
      setCartTotal(total);
      setApiCartEnabled(false);
    }
  };

  useEffect(() => {
    // initial load
    refreshCart();
    // No need to refreshWishlist - WishlistContext handles it

    const onStorage = (e) => {
      if (!e) return;
      // custom event dispatched by helper includes detail with cart
      if (e.type === 'cart:updated' && e.detail) {
        const c = e.detail;
        const items = c?.items || [];
        const count = typeof c.uniqueCount === 'number' ? c.uniqueCount : deriveUniqueProductCount(items);
        const total = typeof c.total === 'number' ? c.total : items.reduce((s, it) => s + (Number(it.price || 0) * (Number(it.quantity || it.qty || 1))), 0);
        setCartItems(items);
        setCartCount(count);
        setCartTotal(total);
        return;
      }
      // storage events across tabs: helper writes 'cart_v1' and 'cart_v1_ts'
      if (e.key && (e.key.startsWith?.('cart_v1') || e.key === 'cart')) refreshCart();
      if (e.key && (e.key.startsWith?.('wishlist') || e.type === 'wishlist:updated')) refreshWishlist();
    };
  // storage event for other tabs
  window.addEventListener('storage', onStorage);
  // custom events for same-tab updates
  window.addEventListener('cart:updated', onStorage);
  window.addEventListener('wishlist:updated', onStorage);

    const onDocClick = (ev) => {
      if (!cartRef.current) return;
      if (!cartRef.current.contains(ev.target)) setCartOpen(false);
    };
    document.addEventListener('click', onDocClick);

    return () => {
      window.removeEventListener('storage', onStorage);
      window.removeEventListener('cart:updated', onStorage);
      window.removeEventListener('wishlist:updated', onStorage);
      document.removeEventListener('click', onDocClick);
    };
  }, []);

  const toggleCart = (e) => {
    e?.preventDefault?.();
    setCartOpen(s => !s);
  };

  const removeCartItem = (index) => {
    // if api cart available, attempt API delete
    (async () => {
      try {
        const it = cartItems[index];
        if (it) {
          // try helper remove
          try {
            await cart.removeItem(it);
            await refreshCart();
            return;
          } catch (e) {
            // fallthrough to manual local manipulation
          }
        }

        // fallback to localStorage manipulation (legacy)
        try {
          const raw = localStorage.getItem('cart_v1') || localStorage.getItem('cart');
          if (!raw) return refreshCart();
          let parsed = JSON.parse(raw);
          let items = Array.isArray(parsed) ? parsed : (parsed.items || []);
          items = items.filter((_, i) => i !== index);
          const total = items.reduce((s, it) => s + (Number(it.price || it.price || 0) * (Number(it.quantity || it.qty || 1))), 0);
          const out = Array.isArray(parsed) ? items : { items, count: items.length, total };
          localStorage.setItem('cart_v1', JSON.stringify(out));
          // dispatch custom event so same-tab listeners update
          window.dispatchEvent(new CustomEvent('cart:updated', { detail: out }));
          refreshCart();
        } catch (e) { console.error(e); }
      } catch (err) {
        console.error('Failed to remove cart item via API', err);
      }
    })();
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <Link to="/homepage" className="flex items-center space-x-2 flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <Icon name="Sparkles" size={20} color="white" />
            </div>
            <div className="flex flex-col">
              <span className="font-accent font-semibold text-lg text-primary leading-none">
                ABC Fashion
              </span>
              <span className="text-xs text-muted-foreground leading-none">
                Store
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {primaryNavItems?.map((item) => {
              // Render cart item as icon-only
              if (item.path === '/shopping-cart') {
                return (
                  <div key="cart" ref={cartRef} className="relative">
                    <button onClick={toggleCart} className="relative px-2 py-1 inline-flex items-center">
                      <Icon name={item.icon} size={20} />
                      <span className="sr-only">Giỏ hàng</span>
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">{cartCount}</span>
                    </button>

                    {cartOpen && (
                      <div className="absolute right-0 mt-2 w-80 bg-popover border border-border rounded-lg shadow-elegant z-50 p-3">
                        <h4 className="font-medium mb-2">Giỏ hàng ({cartCount})</h4>
                        <div className="space-y-2 max-h-56 overflow-auto">
                          {cartItems.length === 0 && <p className="text-sm text-muted-foreground">Giỏ hàng trống</p>}
                          {cartItems.map((it, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {it.image ? <img src={it.image} alt={it.title || ''} className="w-12 h-12 object-cover rounded" /> : <div className="w-12 h-12 bg-muted rounded" />}
                                <div>
                                  <div className="text-sm font-medium">{it.title || it.name || 'Sản phẩm'}</div>
                                  <div className="text-xs text-muted-foreground">{it.qty || 1} x {it.price ? `${it.price}` : '0'}</div>
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <button onClick={() => removeCartItem(i)} className="text-xs text-red-500">Xóa</button>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="border-t border-border mt-3 pt-3 flex items-center justify-between">
                          <div>
                            <div className="text-sm text-muted-foreground">Tổng</div>
                            <div className="font-semibold">{cartTotal.toLocaleString()}</div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link to="/shopping-cart" className="px-3 py-1 border rounded">Giỏ hàng</Link>
                            <Link to="/checkout" className="px-3 py-1 bg-accent text-white rounded">Thanh toán</Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }
              return (
                <Link
                  key={item?.path}
                  to={item?.path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-smooth hover:bg-muted ${
                    isActivePath(item?.path)
                      ? 'bg-accent/10 text-accent' :'text-foreground hover:text-accent'
                  }`}
                >
                  <Icon name={item?.icon} size={16} />
                  <span>{item?.name}</span>
                </Link>
              );
            })}

            {/* More Menu */}
            {/* <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMoreMenu}
                className="flex items-center space-x-1"
              >
                <Icon name="MoreHorizontal" size={16} />
                <span>Thêm</span>
              </Button>

              {isMoreMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-48 bg-popover border border-border rounded-lg shadow-elegant py-1 animate-fade-in">
                  {secondaryNavItems?.map((item) => (
                    <Link
                      key={item?.path}
                      to={item?.path}
                      onClick={() => setIsMoreMenuOpen(false)}
                      className={`flex items-center space-x-2 px-3 py-2 text-sm hover:bg-muted transition-smooth ${
                        isActivePath(item?.path)
                          ? 'text-accent bg-accent/10' :'text-foreground'
                      }`}
                    >
                      <Icon name={item?.icon} size={16} />
                      <span>{item?.name}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div> */}
          </nav>

          {/* Search and Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                className="w-64 pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-smooth"
              />
              <Icon
                name="Search"
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
              />
            </div>

            <Link to="/user-dashboard/wishlist" className="relative inline-flex items-center px-2 py-1">
              <Icon name="Heart" size={20} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
              <span className="sr-only">Wishlist</span>
            </Link>

            <Link to="/shopping-cart" className="relative inline-flex items-center px-2 py-1">
              <Icon name="ShoppingCart" size={20} />
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                {cartCount}
              </span>
              <span className="sr-only">Giỏ hàng</span>
            </Link>
            {(() => {
              try {
                const user = typeof window !== 'undefined' && JSON.parse(localStorage.getItem('user') || 'null');
                if (!user) {
                  return (
                    <>
                      <Link to="/login" className="text-sm text-foreground hover:text-accent">Đăng nhập</Link>
                      <Link to="/register" className="text-sm text-accent">Đăng ký</Link>
                    </>
                  );
                }

                return (
                  <div className="flex items-center space-x-3">
                    <Link to="/user-dashboard" className="text-sm text-foreground hover:text-accent">{user.email}</Link>
                    <button
                      onClick={async () => {
                        try {
                          // attempt server logout to clear cookie
                          await fetch(`${import.meta.env.VITE_API_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' });
                        } catch (e) {
                          // ignore
                        }
                        // preserve rememberedEmail if present, remove auth tokens
                        const remembered = localStorage.getItem('rememberedEmail');
                        try { localStorage.removeItem('user'); localStorage.removeItem('token'); } catch (e) {}
                        if (remembered) try { localStorage.setItem('rememberedEmail', remembered); } catch (e) {}
                        window.location.reload();
                      }}
                      className="text-sm text-muted-foreground hover:text-foreground"
                    >
                      Đăng xuất
                    </button>
                  </div>
                );
              } catch (e) {
                return null;
              }
            })()}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="md:hidden"
          >
            <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-background border-t border-border animate-slide-up">
            <div className="px-4 py-3 space-y-1">
              {/* Mobile Search */}
              <div className="relative mb-3">
                <input
                  type="text"
                  placeholder="Tìm kiếm sản phẩm..."
                  className="w-full pl-10 pr-4 py-2 bg-muted border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
                />
                <Icon
                  name="Search"
                  size={16}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
              </div>

              {/* Mobile Navigation */}
              {primaryNavItems?.map((item) => (
                <Link
                  key={item?.path}
                  to={item?.path}
                  onClick={closeMobileMenu}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-smooth ${
                    isActivePath(item?.path)
                      ? 'bg-accent/10 text-accent' :'text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={item?.icon} size={18} />
                  <span>{item?.name}</span>
                </Link>
              ))}

              {/* Mobile Secondary Navigation */}
              <div className="border-t border-border pt-3 mt-3">
                {secondaryNavItems?.map((item) => (
                  <Link
                    key={item?.path}
                    to={item?.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center space-x-3 px-3 py-3 rounded-lg text-sm font-medium transition-smooth ${
                      isActivePath(item?.path)
                        ? 'bg-accent/10 text-accent' :'text-foreground hover:bg-muted'
                    }`}
                  >
                    <Icon name={item?.icon} size={18} />
                    <span>{item?.name}</span>
                  </Link>
                ))}
              </div>

              {/* Mobile Actions */}
              <div className="flex items-center justify-center space-x-4 pt-3 border-t border-border mt-3">
                <Link to="/user-dashboard/wishlist" className="relative inline-flex items-center px-2 py-1">
                  <Icon name="Heart" size={20} />
                  {wishlistCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">
                      {wishlistCount}
                    </span>
                  )}
                  <span className="sr-only">Wishlist</span>
                </Link>

                <div ref={cartRef} className="relative">
                  <button onClick={toggleCart} className="relative inline-flex items-center px-2 py-1">
                    <Icon name="ShoppingCart" size={20} />
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-accent text-accent-foreground text-xs rounded-full flex items-center justify-center">{cartCount}</span>
                  </button>

                  {cartOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-popover border border-border rounded-lg shadow-elegant z-50 p-3">
                      <h4 className="font-medium mb-2">Giỏ hàng ({cartCount})</h4>
                      <div className="space-y-2 max-h-56 overflow-auto">
                        {cartItems.length === 0 && <p className="text-sm text-muted-foreground">Giỏ hàng trống</p>}
                        {cartItems.map((it, i) => (
                          <div key={i} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              {it.image ? <img src={it.image} alt={it.title || ''} className="w-12 h-12 object-cover rounded" /> : <div className="w-12 h-12 bg-muted rounded" />}
                              <div>
                                <div className="text-sm font-medium">{it.title || it.name || 'Sản phẩm'}</div>
                                <div className="text-xs text-muted-foreground">{it.qty || 1} x {it.price ? `${it.price}` : '0'}</div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button onClick={() => removeCartItem(i)} className="text-xs text-red-500">Xóa</button>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="border-t border-border mt-3 pt-3 flex items-center justify-between">
                        <div>
                          <div className="text-sm text-muted-foreground">Tổng</div>
                          <div className="font-semibold">{cartTotal.toLocaleString()}</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Link to="/shopping-cart" className="px-3 py-1 border rounded">Giỏ hàng</Link>
                          <Link to="/checkout" className="px-3 py-1 bg-accent text-white rounded">Thanh toán</Link>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {/* Overlay for mobile menu */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 md:hidden"
          onClick={closeMobileMenu}
        />
      )}
      {/* Overlay for more menu */}
      {isMoreMenuOpen && (
        <div
          className="fixed inset-0 z-40 hidden md:block"
          onClick={() => setIsMoreMenuOpen(false)}
        />
      )}
    </header>
  );
};

export default Header;