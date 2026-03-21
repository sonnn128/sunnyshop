import React, { useEffect, useState } from 'react';
import Image from '../../../components/AppImage';
import Icon from '../../../components/AppIcon';
import { getTopSellingProducts } from '../../../lib/orderApi';
import { motion, AnimatePresence } from 'framer-motion';

const TopProducts = () => {
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const products = await getTopSellingProducts(10);
        setTopProducts(Array.isArray(products) ? products : []);
      } catch (error) {
        console.error('Error fetching top selling products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTopProducts();
  }, []);

  const formatCurrency = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value || 0);

  return (
    <div className="glass-card rounded-[2.5rem] p-10 border-white/30 shadow-2xl">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h3 className="text-2xl font-black text-foreground tracking-tight">Market Stars</h3>
          <p className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em] mt-2 opacity-60">Highest velocity assets</p>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shadow-xl shadow-primary/5">
          <Icon name="Trophy" size={24} strokeWidth={2.5} />
        </div>
      </div>

      <div className="space-y-6">
        <AnimatePresence>
          {loading ? (
            [...Array(5)].map((_, i) => (
              <div key={i} className="h-20 animate-pulse bg-muted/10 rounded-3xl" />
            ))
          ) : (
            topProducts.slice(0, 5).map((product, index) => (
              <motion.div 
                key={product?.productId || index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
                className="group flex items-center gap-6 p-4 rounded-[2rem] bg-white/30 hover:bg-white/60 transition-all border border-white/20 shadow-xl shadow-black/5"
              >
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden shadow-2xl border border-white/40 flex-shrink-0">
                  <Image src={product?.image || 'https://placehold.co/120x120?text=Asset'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute top-0 left-0 w-6 h-6 bg-primary text-white text-[10px] font-black flex items-center justify-center rounded-br-xl shadow-lg">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-foreground text-sm tracking-tight truncate mb-1 group-hover:text-primary transition-colors">{product?.name || 'Unknown Asset'}</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-muted-foreground">
                      <Icon name="Zap" size={10} className="text-amber-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{product?.totalSold || 0} Velocity</span>
                    </div>
                    <div className="h-1 w-1 rounded-full bg-border" />
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{formatCurrency(product?.totalRevenue)}</span>
                  </div>
                  
                  {/* Progress bar to show relative sale */}
                  <div className="mt-3 h-1.5 w-full bg-muted/30 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(product.totalSold / (topProducts[0]?.totalSold || 1)) * 100}%` }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-primary to-accent rounded-full"
                    />
                  </div>
                </div>

                <div className="hidden lg:flex flex-col items-end gap-1">
                   <div className="p-2 rounded-xl bg-primary/5 text-primary">
                      <Icon name="TrendingUp" size={16} strokeWidth={3} />
                   </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
      
      <button className="mt-10 w-full py-4 rounded-2xl bg-muted/30 hover:bg-muted text-[10px] font-black uppercase tracking-[0.2em] text-foreground transition-all border border-white/20">
        View Global Rankings
      </button>
    </div>
  );
};

export default TopProducts;