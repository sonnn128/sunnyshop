import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import API from '../../../lib/api';
import Button from '../../../components/ui/button';
import { useToast } from '../../../components/ui/ToastProvider';
import { ArrowLeft, Folder, Pencil } from 'lucide-react';

const normalizeCategory = (category = {}) => {
  return {
    ...category,
    _id: category?._id ?? category?.id,
    image_url: category?.image_url ?? category?.imageUrl ?? '',
    sort_order: category?.sort_order ?? category?.sortOrder ?? 0,
    is_active: category?.is_active ?? category?.isActive ?? category?.active ?? true,
    is_featured: category?.is_featured ?? category?.isFeatured ?? category?.featured ?? false
  };
};

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get(`/categories/${id}`);
        const data = res?.data?.data ?? res?.data?.category ?? res?.data;
        if (mounted) {
          setCategory(data ? normalizeCategory(data) : null);
        }
      } catch (error) {
        toast.push({ title: 'Loi', message: 'Khong tai duoc danh muc', type: 'error' });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id, toast]);

  if (loading) {
    return (
      <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 shadow-elegant">
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent" />
          <p className="mt-2 text-muted-foreground">Dang tai...</p>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 shadow-elegant">
        <div className="text-center py-12">
          <Folder size={56} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold mb-2">Khong tim thay danh muc</h3>
          <Button onClick={() => navigate('/admin-panel?tab=categories')}>Quay lai</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card/60 backdrop-blur-md border border-border/50 rounded-[2rem] p-8 shadow-elegant">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/admin-panel?tab=categories')}>
            <ArrowLeft size={16} />
            Quay lai
          </Button>
          <div>
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Folder className="text-primary" />
              Chi tiet danh muc
            </h2>
            <p className="text-sm text-muted-foreground">{category.name}</p>
          </div>
        </div>
        <Link to={`/admin-panel/categories/${category._id}`}>
          <Button>
            <Pencil size={16} />
            Chinh sua
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-background border rounded-xl overflow-hidden">
            <div className="relative h-56 bg-muted">
              {category.image_url ? (
                <img src={category.image_url} alt={category.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Folder size={40} className="text-muted-foreground" />
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-background border rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3">Thong tin co ban</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Ten danh muc</p>
                <p className="font-semibold">{category.name}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Slug</p>
                <p className="font-semibold">/{category.slug}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Thu tu</p>
                <p className="font-semibold">{category.sort_order}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Trang thai</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  category.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {category.is_active ? 'Hoat dong' : 'Khong hoat dong'}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground">Noi bat</p>
                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                  category.is_featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-700'
                }`}>
                  {category.is_featured ? 'Noi bat' : 'Binh thuong'}
                </span>
              </div>
              <div>
                <p className="text-muted-foreground">Danh muc cha</p>
                <p className="font-semibold">{category.parent?.name || '---'}</p>
              </div>
            </div>
          </div>

          <div className="bg-background border rounded-xl p-5">
            <h3 className="text-lg font-semibold mb-3">Mo ta</h3>
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {category.description || 'Chua co mo ta.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDetail;
