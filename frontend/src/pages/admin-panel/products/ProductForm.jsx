import React, { useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../../../lib/api';
import { getBrands } from '../../../lib/brandApi';
import { useToast } from '../../../components/ui/ToastProvider';
import { useRole } from '../../../hooks/useRole';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Textarea from '../../../components/ui/Textarea';
import { Package, DollarSign, Image as ImageIcon, X, Activity, Star, Upload, Download } from 'lucide-react';
import ProductImageManager from './components/ProductImageManager';
import * as XLSX from 'xlsx';
import { formatCategoriesWithHierarchy, normalizeCategoryId } from '../../../utils/categoryTree';

/**
 * Empty template matching ProductMongo.js schema exactly
 */
const emptyTemplate = {
  // Basic fields
  name: '',
  slug: '',
  description: '',
  short_description: '',
  sku: '',
  brand: '',        // Legacy field - text brand name
  brand_id: '',     // 3NF: ObjectId reference to Brand collection
  product_type: 'clothing',
  
  // Pricing
  price: 0,
  original_price: 0,
  cost_price: 0,
  
  // Inventory
  stock_quantity: 0,
  min_stock_level: 5,
  
  // Status
  status: 'active', // enum: 'active', 'inactive', 'out_of_stock'
  is_featured: false,
  
  // Relations
  category_id: '',
  created_by: '',
  
  // Nested arrays - ProductMongo schema
  images: [], // Array of { image_url, alt_text, sort_order, is_primary }
  variants: [], // Array of { name, value, price_adjustment, stock_quantity, sku, image_url, sort_order }
};

const PRODUCT_TYPES = [
  { value: 'clothing', label: 'Quần áo', description: 'Bao gồm áo, quần, váy...' },
  { value: 'shoes', label: 'Giày dép', description: 'Sneaker, sandal, cao gót...' },
  { value: 'accessory', label: 'Phụ kiện', description: 'Túi xách, dây nịt, trang sức...' }
];

const PRODUCT_TYPE_ATTRIBUTE_WHITELIST = {
  clothing: ['size', 'color'],
  shoes: ['size', 'color'],
  accessory: [],
};

const ATTRIBUTE_NAME_ALIASES = {
  size: ['size', 'kích thước', 'cỡ', 'size giày'],
  color: ['color', 'màu', 'màu sắc'],
  material: ['material', 'chất liệu', 'fabric', 'chất lieu'],
  style: ['style', 'kiểu', 'kiểu dáng', 'design'],
};

const ATTRIBUTE_FIELD_KEYS = ['size', 'color', 'material', 'style'];

const resolveAttributeKeyFromName = (rawName = '') => {
  const name = typeof rawName === 'string' ? rawName.trim().toLowerCase() : '';
  if (!name) return null;
  for (const [attributeKey, aliases] of Object.entries(ATTRIBUTE_NAME_ALIASES)) {
    if (aliases.some(alias => name.includes(alias))) {
      return attributeKey;
    }
  }
  return null;
};

const getAttributeValue = (variant = {}, key) => {
  if (!key) return '';
  const directValue = variant?.[key];
  if (directValue !== undefined && directValue !== null) return String(directValue).trim();
  if (variant?.attributes && variant.attributes[key]) {
    return String(variant.attributes[key]).trim();
  }
  return '';
};

const normalizeVariantForSave = (variant, index, productType) => {
  if (!variant) return null;
  const allowedAttributes = PRODUCT_TYPE_ATTRIBUTE_WHITELIST[productType] || [];
  if (!allowedAttributes.length) return null;

  const attributeFromName = resolveAttributeKeyFromName(variant.name);
  const candidateKeys = [];
  if (attributeFromName) candidateKeys.push(attributeFromName);

  ATTRIBUTE_FIELD_KEYS.forEach((fieldKey) => {
    const hasValue = getAttributeValue(variant, fieldKey);
    if (hasValue) candidateKeys.push(fieldKey);
  });

  const resolvedAttributeKey = candidateKeys.find(key => allowedAttributes.includes(key));
  if (!resolvedAttributeKey) return null;

  const resolvedValue = getAttributeValue(variant, resolvedAttributeKey) || (variant.value ? String(variant.value).trim() : '');
  if (!resolvedValue) return null;

  const normalized = {
    sku: variant.sku?.trim() || '',
    name: variant.name || (resolvedAttributeKey === 'size' ? 'Size' : resolvedAttributeKey === 'color' ? 'Color' : resolvedAttributeKey),
    value: resolvedValue,
    price_adjustment: Number(variant.price_adjustment) || 0,
    stock_quantity: Number(variant.stock_quantity || variant.stock) || 0,
    image_url: variant.image_url?.trim() || '',
    sort_order: typeof variant.sort_order === 'number' ? variant.sort_order : index,
    is_active: variant.is_active !== false,
    attributes: { [resolvedAttributeKey]: resolvedValue }
  };

  if (resolvedAttributeKey === 'size') {
    normalized.size = resolvedValue;
  }
  if (resolvedAttributeKey === 'color') {
    normalized.color = resolvedValue;
    const colorCode = variant.color_code || variant.colorCode;
    if (colorCode) {
      normalized.color_code = String(colorCode).trim();
    }
  }

  return normalized;
};

const normalizeImagesForForm = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((img, index) => {
      if (!img) return null;
      if (typeof img === 'string') {
        return {
          image_url: img,
          alt_text: '',
          sort_order: index,
          is_primary: index === 0
        };
      }
      const imageUrl = img.image_url || img.imageUrl || img.url;
      if (!imageUrl) return null;
      return {
        ...img,
        image_url: imageUrl,
        alt_text: img.alt_text || img.altText || '',
        sort_order: typeof img.sort_order === 'number' ? img.sort_order : index,
        is_primary: img.is_primary ?? img.isPrimary ?? (index === 0)
      };
    })
    .filter(Boolean)
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
};

const normalizeImagesForSave = (images) => {
  if (!Array.isArray(images)) return [];
  return images
    .map((img, index) => {
      if (!img) return null;
      if (typeof img === 'string') {
        return {
          image_url: img,
          alt_text: '',
          sort_order: index,
          is_primary: index === 0
        };
      }
      const imageUrl = img.image_url || img.imageUrl || img.url;
      if (!imageUrl) return null;
      return {
        image_url: imageUrl,
        alt_text: img.alt_text || img.altText || '',
        sort_order: typeof img.sort_order === 'number' ? img.sort_order : index,
        is_primary: img.is_primary ?? img.isPrimary ?? (index === 0)
      };
    })
    .filter(Boolean);
};

const pickCategoryId = (product) => {
  if (!product) return '';
  const tryNormalize = (value) => normalizeCategoryId(value) || '';
  return tryNormalize(product.category_id) || tryNormalize(product.category);
};

const slugify = (value = '') => {
  return value
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

const defaultVariantTemplate = {
  name: 'Size',
  value: '',
  sku: '',
  stock_quantity: 0,
  price_adjustment: 0,
  image_url: ''
};

const inferAttributeKeyForVariant = (variant) => {
  if (!variant) return null;
  const keyFromName = resolveAttributeKeyFromName(variant.name);
  if (keyFromName) return keyFromName;

  if (variant.attributes && typeof variant.attributes === 'object') {
    for (const attrKey of ATTRIBUTE_FIELD_KEYS) {
      if (variant.attributes[attrKey]) return attrKey;
    }
  }

  if (variant.size) return 'size';
  if (variant.color) return 'color';
  return null;
};

const syncVariantAttributeFields = (variant) => {
  if (!variant) return variant;
  const attributeKey = inferAttributeKeyForVariant(variant);
  const normalizedValue = variant.value !== undefined && variant.value !== null
    ? String(variant.value).trim()
    : '';

  const ensureAttributesObject = () => {
    if (!variant.attributes || typeof variant.attributes !== 'object') {
      variant.attributes = {};
    }
    return variant.attributes;
  };

  if (attributeKey === 'size') {
    const resolved = normalizedValue || (variant.size ? String(variant.size).trim() : '');
    variant.size = resolved;
    variant.color = attributeKey === 'size' ? '' : variant.color;
    if (!normalizedValue && resolved) {
      variant.value = resolved;
    }
    const attrs = ensureAttributesObject();
    attrs.size = resolved;
    delete attrs.color;
  } else if (attributeKey === 'color') {
    const resolved = normalizedValue || (variant.color ? String(variant.color).trim() : '');
    variant.color = resolved;
    variant.size = attributeKey === 'color' ? '' : variant.size;
    if (!normalizedValue && resolved) {
      variant.value = resolved;
    }
    const attrs = ensureAttributesObject();
    attrs.color = resolved;
    delete attrs.size;
  } else if (!variant.value) {
    const fallback = variant.size || variant.color || '';
    variant.value = typeof fallback === 'number' ? String(fallback) : (fallback || '');
  }

  return variant;
};

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { role } = useRole();
  const [form, setForm] = useState({ ...emptyTemplate });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const categories = categoryOptions; // backwards compatibility for legacy references
  const [importingExcel, setImportingExcel] = useState(false);
  const fileInputRef = useRef(null);

  const update = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const updateVariant = (index, field, value) => {
    setForm(prev => {
      const variants = Array.isArray(prev.variants) ? [...prev.variants] : [];
      if (!variants[index]) variants[index] = { ...defaultVariantTemplate };
      const nextVariant = { ...variants[index], [field]: value };
      variants[index] = syncVariantAttributeFields(nextVariant);
      // Recalculate product-level stock_quantity as sum of variant stocks
      const newStock = variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0);
      return { ...prev, variants, stock_quantity: newStock };
    });
  };

  const addVariant = () => {
    setForm(prev => {
      const nextVariant = syncVariantAttributeFields({
        ...defaultVariantTemplate,
        sort_order: prev.variants?.length || 0
      });
      const variants = [...(prev.variants || []), nextVariant];
      // Recalculate stock when adding first variant (resets manual stock)
      const newStock = variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0);
      return {
        ...prev,
        variants,
        stock_quantity: newStock
      };
    });
  };

  const removeVariant = (index) => {
    setForm(prev => {
      const variants = Array.isArray(prev.variants) ? [...prev.variants] : [];
      variants.splice(index, 1);
      const newStock = variants.reduce((sum, v) => sum + (Number(v.stock_quantity) || 0), 0);
      return { ...prev, variants, stock_quantity: newStock };
    });
  };

  const generateSlug = () => {
    if (!form.name) {
      toast.push({ title: 'Thông báo', message: 'Vui lòng nhập tên sản phẩm trước', type: 'info' });
      return;
    }
    update('slug', slugify(form.name));
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await API.get('/categories');
        if (!mounted) return;
        const rawCats = res?.data?.data || res?.data?.categories || res?.data || [];
        const sortedCats = Array.isArray(rawCats)
          ? [...rawCats].sort((a, b) => (a?.sort_order || 0) - (b?.sort_order || 0))
          : [];
        setCategoryOptions(formatCategoriesWithHierarchy(sortedCats));
      } catch (e) {
        console.error('Failed to load categories:', e);
        if (e.response?.status === 404) {
          console.warn('Categories API not available yet. Using empty list.');
        }
        if (mounted) setCategoryOptions([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Excel import functions
  const downloadExcelTemplate = () => {
    const template = [
      {
        'Tên sản phẩm *': 'Áo thun nam',
        'Slug': 'ao-thun-nam',
        'Mô tả ngắn': 'Áo thun chất liệu cotton cao cấp',
        'Mô tả chi tiết': 'Áo thun nam chất liệu cotton 100%, thoáng mát, thấm hút mồ hôi tốt',
        'SKU *': 'ATN001',
        'Thương hiệu': 'Sunny Fashion',
        'Giá bán *': 199000,
        'Giá gốc': 299000,
        'Giá vốn': 100000,
        'Số lượng tồn kho *': 100,
        'Mức tồn kho tối thiểu': 10,
        'Trạng thái': 'active',
        'Nổi bật': 'false',
        'Category ID': '',
        'URLs ảnh (phân cách bằng dấu chấm phẩy ;)': 'https://example.com/image1.jpg; https://example.com/image2.jpg',
        'Alt text ảnh (phân cách bằng dấu chấm phẩy ;)': 'Áo thun nam mặt trước; Áo thun nam mặt sau',
        'Variant - Loại': '',
        'Variant - Giá trị': '',
        'Variant - SKU riêng': '',
        'Variant - Tồn kho': '',
        'Variant - Chênh lệch giá (VNĐ)': '',
        'Variant - URL ảnh riêng': '',
      },
      {
        'Tên sản phẩm *': '',
        'Slug': '',
        'Mô tả ngắn': '',
        'Mô tả chi tiết': '',
        'SKU *': 'ATN001',
        'Thương hiệu': '',
        'Giá bán *': '',
        'Giá gốc': '',
        'Giá vốn': '',
        'Số lượng tồn kho *': '',
        'Mức tồn kho tối thiểu': '',
        'Trạng thái': '',
        'Nổi bật': '',
        'Category ID': '',
        'URLs ảnh (phân cách bằng dấu chấm phẩy ;)': '',
        'Alt text ảnh (phân cách bằng dấu chấm phẩy ;)': '',
        'Variant - Loại': 'Màu sắc',
        'Variant - Giá trị': 'Đỏ',
        'Variant - SKU riêng': 'AT-NAM-001-RED',
        'Variant - Tồn kho': 50,
        'Variant - Chênh lệch giá (VNĐ)': 0,
        'Variant - URL ảnh riêng': 'https://example.com/red.jpg',
      },
      {
        'Tên sản phẩm *': '',
        'Slug': '',
        'Mô tả ngắn': '',
        'Mô tả chi tiết': '',
        'SKU *': 'ATN001',
        'Thương hiệu': '',
        'Giá bán *': '',
        'Giá gốc': '',
        'Giá vốn': '',
        'Số lượng tồn kho *': '',
        'Mức tồn kho tối thiểu': '',
        'Trạng thái': '',
        'Nổi bật': '',
        'Category ID': '',
        'URLs ảnh (phân cách bằng dấu chấm phẩy ;)': '',
        'Alt text ảnh (phân cách bằng dấu chấm phẩy ;)': '',
        'Variant - Loại': 'Size',
        'Variant - Giá trị': 'M',
        'Variant - SKU riêng': 'AT-NAM-001-M',
        'Variant - Tồn kho': 30,
        'Variant - Chênh lệch giá (VNĐ)': 10000,
        'Variant - URL ảnh riêng': '',
      },
      {
        'Tên sản phẩm *': '',
        'Slug': '',
        'Mô tả ngắn': '',
        'Mô tả chi tiết': '',
        'SKU *': 'ATN001',
        'Thương hiệu': '',
        'Giá bán *': '',
        'Giá gốc': '',
        'Giá vốn': '',
        'Số lượng tồn kho *': '',
        'Mức tồn kho tối thiểu': '',
        'Trạng thái': '',
        'Nổi bật': '',
        'Category ID': '',
        'URLs ảnh (phân cách bằng dấu chấm phẩy ;)': '',
        'Alt text ảnh (phân cách bằng dấu chấm phẩy ;)': '',
        'Variant - Loại': 'Size',
        'Variant - Giá trị': 'L',
        'Variant - SKU riêng': 'AT-NAM-001-L',
        'Variant - Tồn kho': 20,
        'Variant - Chênh lệch giá (VNĐ)': 20000,
        'Variant - URL ảnh riêng': '',
      }
    ];
    
    const ws = XLSX.utils.json_to_sheet(template);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Products');
    
    // Set column widths
    ws['!cols'] = [
      { wch: 20 }, { wch: 20 }, { wch: 30 }, { wch: 50 },
      { wch: 15 }, { wch: 15 }, { wch: 12 }, { wch: 12 },
      { wch: 12 }, { wch: 15 }, { wch: 20 }, { wch: 12 },
      { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 12 },
      { wch: 12 }, { wch: 30 }, { wch: 20 }, { wch: 30 },
      { wch: 15 }, { wch: 50 }, { wch: 50 },
      { wch: 15 }, { wch: 20 }, { wch: 20 }, { wch: 12 }, { wch: 20 }, { wch: 30 }
    ];
    
    XLSX.writeFile(wb, 'product_template.xlsx');
    toast.push({ title: 'Thành công', message: 'Đã tải xuống file mẫu', type: 'success' });
  };

  const handleExcelImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      toast.push({ title: 'Lỗi', message: 'Chỉ chấp nhận file Excel (.xlsx, .xls)', type: 'error' });
      return;
    }
    
    setImportingExcel(true);
    try {
      const data = await file.arrayBuffer();
      const workbook = XLSX.read(data);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      
      if (jsonData.length === 0) {
        toast.push({ title: 'Lỗi', message: 'File Excel không có dữ liệu', type: 'error' });
        return;
      }
      
      // Group rows by SKU (product + its variants)
      const productGroups = {};
      
      jsonData.forEach(row => {
        const sku = row['SKU *'];
        if (!sku) return;
        
        if (!productGroups[sku]) {
          productGroups[sku] = {
            product: null,
            variants: []
          };
        }
        
        // Check if this row is a variant (has Variant - Loại)
        const isVariant = row['Variant - Loại']?.trim();
        
        if (isVariant) {
          // This is a variant row
          productGroups[sku].variants.push(row);
        } else if (row['Tên sản phẩm *']?.trim()) {
          // This is the main product row
          productGroups[sku].product = row;
        }
      });
      
      // Parse and send to backend
      const products = Object.values(productGroups).map(({ product, variants }) => {
        if (!product) return null;
        
        const row = product;
        
        // Parse images - support both semicolon and newline as separators
        const imageUrls = row['URLs ảnh (phân cách bằng dấu chấm phẩy ;)']
          ? row['URLs ảnh (phân cách bằng dấu chấm phẩy ;)']
              .split(/[;\n]/)
              .map(url => url.trim())
              .filter(Boolean)
          : [];
        
        const imageAlts = row['Alt text ảnh (phân cách bằng dấu chấm phẩy ;)']
          ? row['Alt text ảnh (phân cách bằng dấu chấm phẩy ;)']
              .split(/[;\n]/)
              .map(alt => alt.trim())
              .filter(Boolean)
          : [];
        
        // Build images array
        const images = imageUrls.map((url, index) => ({
          url,
          alt: imageAlts[index] || `Image ${index + 1}`,
          is_primary: index === 0
        }));
        
        // Parse variants
        const parsedVariants = variants.map(variantRow => {
          try {
            const type = variantRow['Variant - Loại'] || '';
            const value = variantRow['Variant - Giá trị'] || '';
            const variantSku = variantRow['Variant - SKU riêng'] || '';
            const stock = Number(variantRow['Variant - Tồn kho']) || 0;
            const priceDiff = Number(variantRow['Variant - Chênh lệch giá (VNĐ)']) || 0;
            const imageUrl = variantRow['Variant - URL ảnh riêng'] || '';
            
            // Build attributes object based on type
            const attributes = {};
            const typeKey = type.toLowerCase()
              .replace('màu sắc', 'color')
              .replace('size', 'size')
              .replace('chất liệu', 'material')
              .trim();
            
            if (typeKey) {
              attributes[typeKey] = value;
            }
            
            // Build variant name from type and value
            const variantName = `${type}: ${value}`;
            
            return {
              sku: variantSku,
              name: variantName,
              price: Number(row['Giá bán *'] || 0) + priceDiff,
              stock_quantity: stock,
              attributes,
              image_url: imageUrl || undefined
            };
          } catch (e) {
            console.error('Error parsing variant:', e);
            return null;
          }
        }).filter(Boolean);
        
        return {
          name: row['Tên sản phẩm *'] || '',
          slug: row['Slug'] || '',
          description: row['Mô tả chi tiết'] || '',
          short_description: row['Mô tả ngắn'] || '',
          sku: row['SKU *'] || '',
          brand: row['Thương hiệu'] || '',
          price: Number(row['Giá bán *']) || 0,
          original_price: Number(row['Giá gốc']) || 0,
          cost_price: Number(row['Giá vốn']) || 0,
          stock_quantity: Number(row['Số lượng tồn kho *']) || 0,
          min_stock_level: Number(row['Mức tồn kho tối thiểu']) || 5,
          status: row['Trạng thái'] || 'active',
          is_featured: row['Nổi bật']?.toLowerCase() === 'true',
          category_id: row['Category ID'] || '',
          images,
          variants: parsedVariants
        };
      }).filter(Boolean);
      
      // Send to backend
      const res = await API.post('/api/products/import-excel', { products });
      const result = res?.data;
      
      toast.push({ 
        title: 'Thành công', 
        message: `Đã import ${result.success || 0} sản phẩm. ${result.failed || 0} lỗi.`, 
        type: 'success' 
      });
    } catch (error) {
      console.error('Excel import failed:', error);
      toast.push({
        title: 'Lỗi',
        message: 'Không thể import file Excel. Vui lòng kiểm tra lại nội dung file.',
        type: 'error'
      });
    } finally {
      setImportingExcel(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const selectedProductType = form.product_type || 'clothing';
  const isAccessoryProduct = selectedProductType === 'accessory';
  const showVariantSection = !isAccessoryProduct;
  const discountPercent = (() => {
    const basePrice = Number(form.price) || 0;
    const original = Number(form.original_price) || 0;
    if (original <= 0 || basePrice <= 0 || basePrice >= original) return 0;
    return Math.round(((original - basePrice) / original) * 100);
  })();

  // Fetch brands on mount (3NF support)
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await getBrands();
        if (!mounted) return;
        const brandList = res?.data || res || [];
        setBrands(Array.isArray(brandList) ? brandList : []);
      } catch (e) {
        console.error('Failed to load brands:', e);
        if (mounted) setBrands([]);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // Load product if editing
  useEffect(() => {
    let mounted = true;
    if (!id) return;
    
    (async () => {
      try {
        const res = await API.get(`/products/${id}`);
        if (!mounted) return;
		
        const p = res?.data?.data || res?.data?.product || res?.data;
        if (p) {
          const normalizedCategoryId = pickCategoryId(p);
          // Map backend data to form - ensure schema compliance
          // 3NF: Extract brand_id from populated brand_id object or direct string
          const brandId = p.brand_id?._id || p.brand_id || '';

          const normalizedVariants = Array.isArray(p.variants)
            ? p.variants.map((variant, variantIndex) => {
                const attributeKey = inferAttributeKeyForVariant(variant);
                const derivedName = variant.name
                  || (attributeKey === 'color' ? 'Màu sắc'
                    : attributeKey === 'size' ? 'Size'
                    : 'Size');
                const derivedValue = variant.value || variant.size || variant.color || '';
                const prepared = {
                  ...variant,
                  name: derivedName,
                  value: derivedValue,
                  sort_order: typeof variant.sort_order === 'number' ? variant.sort_order : variantIndex
                };

                if (attributeKey === 'size' && !prepared.size) {
                  prepared.size = derivedValue;
                }
                if (attributeKey === 'color' && !prepared.color) {
                  prepared.color = derivedValue;
                }

                return syncVariantAttributeFields(prepared);
              })
            : [];

          const recomputedStock = normalizedVariants.reduce((sum, v) => sum + (Number(v.stock_quantity || v.stock || 0) || 0), 0);

          setForm({
            // Basic
            name: p.name || '',
            slug: p.slug || '',
            description: p.description || '',
            short_description: p.short_description || '',
            sku: p.sku || '',
            brand: p.brand || p.brand_id?.name || '', // Legacy field
            brand_id: brandId, // 3NF: Reference to Brand collection
            product_type: p.product_type || 'clothing',
            
            // Pricing
            price: Number(p.price) || 0,
            original_price: Number(p.original_price) || 0,
            cost_price: Number(p.cost_price) || 0,
            
            // Inventory
            min_stock_level: Number(p.min_stock_level) || 5,
            
            // Status
            status: p.status || 'active',
            is_featured: !!p.is_featured,
            
            // Relations
            category_id: normalizedCategoryId,
            created_by: p.created_by || '',
            
            // Nested arrays - ensure proper structure
            images: normalizeImagesForForm(p.images),
            variants: normalizedVariants,
            // If variants exist, make product-level stock the sum of them
            stock_quantity: normalizedVariants.length ? recomputedStock : Number(p.stock_quantity) || 0,
          });
        }
      } catch (e) {
        console.error('Load product error:', e);
        toast.push({ 
          title: 'Lỗi', 
          message: 'Không tải được sản phẩm', 
          type: 'error' 
        });
      } finally { 
        if (mounted) setLoading(false); 
      }
    })();
    
    return () => { mounted = false; };
  }, [id]);

  const handleSaveAsDraft = async () => {
    if (role !== 'staff') {
      toast.push({ 
        title: 'Thông báo', 
        message: 'Chỉ nhân viên mới có thể lưu draft', 
        type: 'info' 
      });
      return;
    }

    setLoading(true);
    setErrors(null);

    try {
      const toSend = prepareProductData(form);
      toSend.status = 'draft';

      if (id) {
        await API.put(`/api/products/${id}`, toSend);
        toast.push({ 
          title: 'Thành công', 
          message: 'Draft đã được cập nhật', 
          type: 'success' 
        });
      } else {
        const response = await API.post('/api/products', toSend);
        if (response.data?.success) {
          toast.push({ 
            title: 'Thành công', 
            message: 'Draft đã được tạo', 
            type: 'success' 
          });
          // Navigate to edit mode with new product ID
          const newId = response.data?.product?._id;
          if (newId) {
            navigate(`/admin-panel/products/${newId}`, { replace: true });
          }
        }
      }
    } catch (err) {
      console.error('Save draft error:', err);
      toast.push({ 
        title: 'Lỗi', 
        message: 'Không thể lưu draft', 
        type: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const prepareProductData = (payload) => {
    const productType = payload.product_type || 'clothing';
    const allowVariants = productType !== 'accessory';
    const primaryCategoryId = normalizeCategoryId(payload.category_id);

    const normalizedVariants = allowVariants && Array.isArray(payload.variants)
      ? payload.variants
          .map((variant, index) => normalizeVariantForSave(variant, index, productType))
          .filter(Boolean)
      : [];

    return {
      // Basic
      name: payload.name?.trim() || '',
      slug: payload.slug?.trim() || '',
      description: payload.description || '',
      short_description: payload.short_description || '',
      sku: payload.sku?.trim() || '',
      brand: payload.brand?.trim() || '', // Legacy field
      brand_id: payload.brand_id || null, // 3NF: Reference to Brand collection
      product_type: productType,
      
      // Pricing
      price: Number(payload.price) || 0,
      original_price: Number(payload.original_price) || 0,
      cost_price: Number(payload.cost_price) || 0,
      
      // Inventory
      stock_quantity: Number(payload.stock_quantity) || 0,
      min_stock_level: Number(payload.min_stock_level) || 5,
      
      // Status
      status: payload.status || 'active',
      is_featured: !!payload.is_featured,
      
      // Relations
      category_id: primaryCategoryId || '',
      
      // Nested arrays
      images: normalizeImagesForSave(payload.images),
      variants: normalizedVariants,
    };
  };

  const handleSave = async (payload) => {
    setLoading(true);
    setErrors(null);
    
    // Debug: Check images before sending
    console.log('📸 Images before save:', payload.images);
    console.log('📦 Full payload:', payload);
    
    try {
      // Prepare data for backend - ensure types match schema
      const toSend = prepareProductData(payload);

      // Debug: Check toSend object
      console.log('📤 Data to send:', toSend);
      console.log('📸 Images in toSend:', toSend.images);

      // Validate required fields
      if (!toSend.name) {
        toast.push({ 
          title: 'Lỗi xác thực', 
          message: 'Tên sản phẩm là bắt buộc', 
          type: 'error' 
        });
        setLoading(false);
        return;
      }

      if (!toSend.slug) {
        toast.push({ 
          title: 'Lỗi xác thực', 
          message: 'Slug là bắt buộc', 
          type: 'error' 
        });
        setLoading(false);
        return;
      }

      if (toSend.price <= 0) {
        toast.push({ 
          title: 'Lỗi xác thực', 
          message: 'Giá bán phải lớn hơn 0', 
          type: 'error' 
        });
        setLoading(false);
        return;
      }

      // Save to backend
      if (id) {
        await API.put(`/products/${id}`, toSend);
        toast.push({ 
          title: 'Thành công', 
          message: 'Sản phẩm đã được cập nhật', 
          type: 'success' 
        });
      } else {
        await API.post('/products', toSend);
        toast.push({ 
          title: 'Thành công', 
          message: 'Sản phẩm mới đã được tạo', 
          type: 'success' 
        });
      }
      
      navigate('/admin-panel?tab=products');
    } catch (err) {
      console.error('Save product error:', err?.response?.data || err);
      const data = err?.response?.data;
      
      // Handle validation errors from backend
      if (data && data.errors && typeof data.errors === 'object') {
        setErrors(data.errors);
      }
      
      toast.push({ 
        title: 'Lỗi', 
        message: data?.message || 'Không thể lưu sản phẩm', 
        type: 'error' 
      });
    } finally { 
      setLoading(false); 
    }
  };

  return (
    <div className="min-h-screen bg-muted/30 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="bg-background rounded-xl border border-border p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-foreground">
                {id ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {id 
                  ? 'Cập nhật thông tin sản phẩm' 
                  : 'Điền đầy đủ thông tin để tạo sản phẩm mới'
                }
              </p>
            </div>
            
            {/* Excel Import Buttons - Only show when creating new product */}
            {!id && (
              <div className="flex gap-2">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={downloadExcelTemplate}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Tải mẫu Excel
                </Button>
                
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".xlsx,.xls"
                  onChange={handleExcelImport}
                  className="hidden"
                />
                
                <Button 
                  type="button" 
                  variant="default"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={importingExcel}
                  className="flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {importingExcel ? 'Đang import...' : 'Import Excel'}
                </Button>
              </div>
            )}
            
            {id && form.name && (
              <div className="text-right">
                <div className="text-sm text-muted-foreground">Đang chỉnh sửa</div>
                <div className="font-semibold text-primary">{form.name}</div>
              </div>
            )}
          </div>
        </div>

        {/* Form - INLINE ALL SECTIONS */}
        <form className="space-y-6" onSubmit={e => { e.preventDefault(); handleSave(form); }}>
          
          {/* === SECTION 1: THÔNG TIN CƠ BẢN === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Package size={20} className="text-primary" />
              Thông tin cơ bản
            </h3>

            {/* Product Type Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-3">Loại sản phẩm</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {PRODUCT_TYPES.map((type) => {
                  const active = selectedProductType === type.value;
                  return (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => update('product_type', type.value)}
                      className={`text-left p-4 border rounded-lg transition focus:outline-none focus:ring-2 focus:ring-primary ${active ? 'border-primary bg-primary/5 shadow-sm' : 'border-border hover:border-primary/60'}`}
                    >
                      <div className="font-semibold flex items-center gap-2">
                        <span>{type.label}</span>
                        {active && <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">Đang chọn</span>}
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">{type.description}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Name & Slug */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <Input
                  label="Tên sản phẩm"
                  placeholder="VD: Áo thun nam cotton"
                  value={form.name || ''}
                  onChange={(e) => update('name', e.target.value)}
                  error={errors?.name}
                  required
                />
              </div>
              <div>
                <Input
                  label="Slug (URL)"
                  placeholder="ao-thun-nam-cotton"
                  value={form.slug || ''}
                  onChange={(e) => update('slug', e.target.value)}
                  error={errors?.slug}
                  required
                />
                <button
                  type="button"
                  onClick={generateSlug}
                  className="mt-1 text-sm text-primary hover:underline"
                >
                  Tạo tự động
                </button>
              </div>
            </div>

            {/* SKU, Category & Brand - 3 columns */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <Input
                  label="SKU"
                  placeholder="VD: AT-NAM-001"
                  value={form.sku || ''}
                  onChange={(e) => update('sku', e.target.value)}
                  error={errors?.sku}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Danh mục</label>
                <select
                  value={form.category_id || ''}
                  onChange={(e) => {
                    const value = e.target.value || '';
                    update('category_id', value);
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="">-- Chọn danh mục --</option>
                  {Array.isArray(categoryOptions) && categoryOptions.map(cat => {
                    const optionValue = cat?.normalizedId || cat?._id || cat?.id;
                    if (!optionValue) return null;
                    return (
                      <option
                        key={optionValue}
                        value={optionValue}
                        title={cat?.displayLabel || cat?.name}
                      >
                        {cat?.indentedLabel || cat?.displayLabel || cat?.name}
                      </option>
                    );
                  })}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Thương hiệu</label>
                <select
                  value={form.brand_id || ''}
                  onChange={(e) => {
                    const selectedBrandId = e.target.value;
                    const selectedBrand = brands.find(b => b._id === selectedBrandId);
                    update('brand_id', selectedBrandId);
                    update('brand', selectedBrand?.name || ''); // Sync legacy field
                  }}
                  className="w-full px-3 py-2 border rounded-lg bg-background"
                >
                  <option value="">-- Chọn thương hiệu --</option>
                  {Array.isArray(brands) && brands.filter(b => b.is_active !== false).map(brand => (
                    <option key={brand._id} value={brand._id}>{brand.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Short & Full Description in 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Textarea
                  label="Mô tả ngắn"
                  placeholder="Mô tả ngắn gọn..."
                  rows={4}
                  value={form.short_description || ''}
                  onChange={(e) => update('short_description', e.target.value)}
                  error={errors?.short_description}
                />
              </div>
              <div>
                <Textarea
                  label="Mô tả chi tiết"
                  placeholder="Mô tả đầy đủ về sản phẩm..."
                  rows={4}
                  value={form.description || ''}
                  onChange={(e) => update('description', e.target.value)}
                  error={errors?.description}
                />
              </div>
            </div>
          </div>

          {/* === SECTION 2: GIÁ & TỒN KHO === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <DollarSign size={20} className="text-primary" />
              Giá & Tồn kho
            </h3>

            {/* Prices - 4 columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div>
                <Input
                  label="Giá bán (VNĐ)"
                  type="number"
                  placeholder="0"
                  value={form.price || ''}
                  onChange={(e) => update('price', Number(e.target.value))}
                  error={errors?.price}
                  required
                  min={0}
                />
              </div>
              <div>
                <Input
                  label="Giá gốc (VNĐ)"
                  type="number"
                  placeholder="0"
                  value={form.original_price || ''}
                  onChange={(e) => update('original_price', Number(e.target.value))}
                  error={errors?.original_price}
                  min={0}
                  helper={discountPercent > 0 ? `Giảm ${discountPercent}%` : ''}
                />
              </div>
              <div>
                <Input
                  label="Giá vốn (VNĐ)"
                  type="number"
                  placeholder="0"
                  value={form.cost_price || ''}
                  onChange={(e) => update('cost_price', Number(e.target.value))}
                  error={errors?.cost_price}
                  min={0}
                  helper="Để tính lợi nhuận"
                />
              </div>
            </div>

            {/* Stock */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Input
                  label="Số lượng tồn kho"
                  type="number"
                  placeholder="0"
                  value={form.stock_quantity || ''}
                  onChange={(e) => update('stock_quantity', Number(e.target.value))}
                  disabled={Array.isArray(form.variants) && form.variants.length > 0}
                  error={errors?.stock_quantity}
                  required
                  min={0}
                />
              </div>
              <div>
                <Input
                  label="Mức tồn kho tối thiểu"
                  type="number"
                  placeholder="5"
                  value={form.min_stock_level || ''}
                  onChange={(e) => update('min_stock_level', Number(e.target.value))}
                  error={errors?.min_stock_level}
                  min={0}
                  helper="Cảnh báo khi tồn kho < giá trị này"
                />
              </div>
            </div>

            {/* Stock Status */}
            {form.stock_quantity !== undefined && (
              <div className={`mt-4 p-3 rounded ${form.stock_quantity <= 0 ? 'bg-red-50 text-red-700' : form.stock_quantity <= (form.min_stock_level || 5) ? 'bg-yellow-50 text-yellow-700' : 'bg-green-50 text-green-700'}`}>
                <div className="font-medium">
                  {form.stock_quantity <= 0 ? '🔴 Hết hàng' : form.stock_quantity <= (form.min_stock_level || 5) ? '⚠️ Sắp hết hàng' : '✅ Còn hàng'}
                </div>
                <div className="text-sm">Tồn kho: {form.stock_quantity || 0} sản phẩm</div>
              </div>
            )}
          </div>

          {showVariantSection && (
            <div className="bg-card border rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Package size={20} className="text-primary" />
                  Biến thể sản phẩm (Size, Màu sắc...)
                </h3>
                <Button type="button" onClick={addVariant} size="sm">
                  + Thêm biến thể
                </Button>
              </div>

              {(form.variants || []).length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Chưa có biến thể. Click "Thêm biến thể" để thêm size, màu sắc, v.v.
                </p>
              ) : (
                <div className="space-y-4">
                  {(form.variants || []).map((variant, idx) => (
                    <div key={idx} className="border rounded-lg p-4 bg-muted/30">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          Biến thể #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeVariant(idx)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-sm font-medium mb-1">Loại</label>
                          <select
                            value={variant.name || 'Size'}
                            onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          >
                            <option value="Size">Size</option>
                            <option value="Màu sắc">Màu sắc</option>
                            <option value="Chất liệu">Chất liệu</option>
                            <option value="Kiểu dáng">Kiểu dáng</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Giá trị</label>
                          <input
                            type="text"
                            placeholder="VD: S, M, L hoặc Đỏ, Xanh"
                            value={variant.value || ''}
                            onChange={(e) => updateVariant(idx, 'value', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">SKU riêng</label>
                          <input
                            type="text"
                            placeholder="VD: AT-NAM-001-M"
                            value={variant.sku || ''}
                            onChange={(e) => updateVariant(idx, 'sku', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Tồn kho</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={variant.stock_quantity || ''}
                            onChange={(e) => updateVariant(idx, 'stock_quantity', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                            min={0}
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">Chênh lệch giá (VNĐ)</label>
                          <input
                            type="number"
                            placeholder="0"
                            value={variant.price_adjustment || ''}
                            onChange={(e) => updateVariant(idx, 'price_adjustment', Number(e.target.value))}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Giá cuối: {((form.price || 0) + (variant.price_adjustment || 0)).toLocaleString()} VNĐ
                          </p>
                        </div>

                        <div>
                          <label className="block text-sm font-medium mb-1">URL ảnh riêng</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={variant.image_url || ''}
                            onChange={(e) => updateVariant(idx, 'image_url', e.target.value)}
                            className="w-full px-3 py-2 border rounded-lg text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* === SECTION 3: TRẠNG THÁI === */}
          <div className="bg-card border rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Activity size={20} className="text-primary" />
              Trạng thái
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Status Radio */}
              <div>
                <label className="block text-sm font-medium mb-2">Trạng thái sản phẩm</label>
                <div className="space-y-2">
                  {[
                    { value: 'active', label: 'Hoạt động', color: 'green' },
                    { value: 'inactive', label: 'Không hoạt động', color: 'gray' },
                    { value: 'out_of_stock', label: 'Hết hàng', color: 'red' },
                  ].map((opt) => (
                    <label
                      key={opt.value}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition-colors ${form.status === opt.value ? `border-${opt.color}-500 bg-${opt.color}-50` : 'border-gray-200 hover:border-primary'}`}
                    >
                      <input
                        type="radio"
                        name="status"
                        value={opt.value}
                        checked={form.status === opt.value}
                        onChange={(e) => update('status', e.target.value)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium">{opt.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Featured */}
              <div>
                <label className="block text-sm font-medium mb-2">Hiển thị đặc biệt</label>
                <label className="flex items-center gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.is_featured || false}
                    onChange={(e) => update('is_featured', e.target.checked)}
                    className="w-5 h-5"
                  />
                  <div className="flex-1">
                    <div className="font-medium flex items-center gap-2 text-sm">
                      <Star size={16} className={form.is_featured ? 'text-amber-600 fill-amber-600' : ''} />
                      Sản phẩm nổi bật
                    </div>
                    <div className="text-xs text-muted-foreground">Ưu tiên trang chủ</div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* === SECTION 4: HÌNH ẢNH === */}
          <div className="bg-card border rounded-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ImageIcon size={20} className="text-primary" />
                Hình ảnh sản phẩm
              </h3>
              {(form.images || []).length > 0 && (
                <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-semibold">
                  {(form.images || []).length} ảnh
                </span>
              )}
            </div>
            <ProductImageManager
              images={form.images || []}
              onChange={(imgs) => update('images', imgs)}
              error={errors?.images}
            />
          </div>

          {/* SEO, tag, and physical sections removed per updated requirements */}

          {/* === ACTION BUTTONS === */}
          <div className="flex justify-between items-center sticky bottom-0 bg-background p-4 border-t">
            <Button variant="outline" onClick={() => navigate('/admin-panel?tab=products')} type="button" disabled={loading}>
              Hủy
            </Button>
            
            <div className="flex gap-3">
              <Button 
                type="button" 
                variant="outline"
                onClick={handleSaveAsDraft}
                disabled={loading}
                className="min-w-[140px]"
              >
                {loading ? 'Đang lưu...' : '💾 Lưu Draft'}
              </Button>
              
              <Button type="submit" disabled={loading} className="min-w-[120px]">
                {loading ? 'Đang lưu...' : '✅ Lưu & Xuất bản'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductForm;
