import React, { useState } from 'react';
import API from '../../../lib/api';
import { 
  getAddresses, 
  createAddress, 
  updateAddress, 
  deleteAddress, 
  setDefaultAddress 
} from '../../../lib/addressApi';
import { useToast } from '../../../components/ui/ToastProvider';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';

const AddressBook = () => {
  const toast = useToast();
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    // 3NF: Fetch addresses from Address collection API
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        const res = await getAddresses();
        const addressList = res?.data || res || [];
        if (mounted && Array.isArray(addressList)) {
          const normalized = addressList.map(a => normalizeServerAddress(a));
          setAddresses(normalized);
        }
      } catch (e) {
        console.error('Failed to load addresses:', e);
        // Fallback: try to get from user profile (legacy)
        try {
          const res = await API.get('/api/auth/me');
          const user = res?.data?.user || res?.data;
          if (mounted && user?.addresses) {
            const normalized = (user.addresses || []).map(a => normalizeServerAddress(a));
            setAddresses(normalized);
          }
        } catch (e2) {
          console.error('Failed to load addresses from user profile:', e2);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  // helper: convert server address shape -> frontend form shape
  const normalizeServerAddress = (a) => {
    if (!a) return a;
    // server may store fields like fullName, addressLine1, addressLine2, city, state, default, phone, label
    const name = a.fullName || a.full_name || a.name || '';
    const addressLine1 = a.addressLine1 || a.address_line1 || a.address || '';
    const addressLine2 = a.addressLine2 || '';
    // try to split addressLine2 into ward/district if possible (we saved 'ward, district' or 'ward / district')
    let ward = '';
    let district = '';
    if (addressLine2) {
      const parts = addressLine2.split(/[,/\\]/).map(s => s.trim()).filter(Boolean);
      ward = parts[0] || '';
      district = parts[1] || '';
    }
    return {
      // use _id as id if present
      id: a._id ? String(a._id) : undefined,
      type: a.label || a.type || 'other',
      name,
      phone: a.phone || '',
      address: addressLine1,
      ward,
      district: a.district || a.state || district,
      city: a.city || '',
      provinceCode: a.provinceCode || a.province_code || '',
      districtCode: a.districtCode || a.district_code || '',
      wardCode: a.wardCode || a.ward_code || '',
      isDefault: !!(a.default || a.isDefault || a.is_default)
    };
  };

  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'home',
    name: '',
    phone: '',
    address: '',
    ward: '',
    district: '',
    city: '',
    provinceCode: '',
    districtCode: '',
    wardCode: '',
    isDefault: false
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ isOpen: false, addressId: null, addressName: '' });

  const addressTypes = {
    home: { label: 'Nhà riêng', icon: 'Home', color: 'text-accent' },
    office: { label: 'Văn phòng', icon: 'Building', color: 'text-secondary' },
    other: { label: 'Khác', icon: 'MapPin', color: 'text-muted-foreground' }
  };

  // location lists (provinces -> districts -> wards)
  const [locations, setLocations] = React.useState([]);
  const [districts, setDistricts] = React.useState([]);
  const [wards, setWards] = React.useState([]);

  React.useEffect(() => {
    // fetch nested provinces/districts/wards once
    let mounted = true;
    (async () => {
      try {
        const res = await fetch('https://provinces.open-api.vn/api/?depth=3');
        const data = await res.json();
        if (mounted && Array.isArray(data)) setLocations(data);
      } catch (e) {
        console.error('Failed to load locations', e);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // clear per-field error when user starts typing
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = (fd) => {
    const errs = {};
    if (!fd.name || !String(fd.name).trim()) errs.name = 'Vui lòng nhập họ và tên.';
    const phoneRe = /^(?:\+84|0)\d{9}$/; // +84xxxxxxxxx or 0xxxxxxxxx (Vietnam common)
    if (!fd.phone || !phoneRe.test(String(fd.phone).trim())) errs.phone = 'Số điện thoại không hợp lệ. Bắt đầu bằng 0 hoặc +84 và đủ 10 chữ số.';
    if (!fd.address || !String(fd.address).trim()) errs.address = 'Vui lòng nhập địa chỉ cụ thể.';
    if (!fd.provinceCode || !fd.districtCode || !fd.wardCode) errs.location = 'Vui lòng chọn tỉnh, quận/huyện và phường/xã.';
    return errs;
  };

  const handleProvinceChange = (code) => {
    const province = locations.find(p => String(p.code) === String(code));
    const ds = province?.districts || [];
    setDistricts(ds);
    setWards([]);
    handleInputChange('city', province?.name || '');
    handleInputChange('provinceCode', String(code));
    handleInputChange('district', '');
    handleInputChange('districtCode', '');
    handleInputChange('ward', '');
    handleInputChange('wardCode', '');
  };

  const handleDistrictChange = (code) => {
    const district = districts.find(d => String(d.code) === String(code));
    const ws = district?.wards || [];
    setWards(ws);
    handleInputChange('district', district?.name || '');
    handleInputChange('districtCode', String(code));
    handleInputChange('ward', '');
    handleInputChange('wardCode', '');
  };

  const handleWardChange = (code) => {
    const ward = wards.find(w => String(w.code) === String(code));
    handleInputChange('ward', ward?.name || '');
    handleInputChange('wardCode', String(code));
  };

  const handleSubmit = async () => {
    // validate
    const validationTarget = { ...formData };
    const errs = validateForm(validationTarget);
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setSaving(true);
    const previous = [...addresses];
    
    try {
      // 3NF: Use Address API for CRUD operations
      const payload = mapToServerAddress(formData);
      
      if (editingId) {
        // Update existing address
        await updateAddress(editingId, payload);
        // If setting as default, call setDefault API
        if (formData.isDefault) {
          await setDefaultAddress(editingId);
        }
        // Update local state
        setAddresses(prev => prev.map(addr => 
          addr.id === editingId ? { ...formData, id: editingId } : addr
        ));
        toast.push({ title: 'Thành công', message: 'Địa chỉ đã được cập nhật', type: 'success' });
      } else {
        // Create new address
        const res = await createAddress(payload);
        const newAddress = res?.data || res;
        const normalizedNew = normalizeServerAddress(newAddress);
        setAddresses(prev => [...prev, normalizedNew]);
        // If setting as default, call setDefault API
        if (formData.isDefault && normalizedNew.id) {
          await setDefaultAddress(normalizedNew.id);
        }
        toast.push({ title: 'Thành công', message: 'Địa chỉ mới đã được thêm', type: 'success' });
      }
      
      setEditingId(null);
      setIsAddingNew(false);
      // Reset form
      setFormData({
        type: 'home',
        name: '',
        phone: '',
        address: '',
        ward: '',
        district: '',
        city: '',
        provinceCode: '',
        districtCode: '',
        wardCode: '',
        isDefault: false
      });
      setErrors({});
    } catch (e) {
      console.error('Save addresses failed', e);
      // revert optimistic update
      setAddresses(previous);
      toast.push({ title: 'Lỗi', message: 'Không thể lưu địa chỉ', type: 'error' });
    } finally {
      setSaving(false);
    }
  };

  const mapToServerAddress = (copy) => {
    // copy is frontend form shape: { type, name, phone, address, ward, district, city, isDefault }
    const out = {
      label: copy.type || copy.label || 'other',
      fullName: copy.name || copy.fullName || '',
      phone: copy.phone || '',
      addressLine1: copy.address || copy.addressLine1 || '',
      addressLine2: [copy.ward, copy.district].filter(Boolean).join(', '),
      city: copy.city || '',
      district: copy.district || copy.state || '',
      postalCode: copy.postalCode || '',
      country: copy.country || 'VN',
      default: !!(copy.isDefault || copy.default),
      // include codes so backend can store precise selection
      provinceCode: copy.provinceCode || '',
      districtCode: copy.districtCode || '',
      wardCode: copy.wardCode || ''
    };
    // if frontend address carried an ObjectId-like id, pass it as _id so updates will map to same subdocument
    if (copy.id && copy.id.length === 24) out._id = copy.id;
    return out;
  };

  const handleEdit = (address) => {
    // if address came from server, normalize it first
    const normalized = address && address._id ? normalizeServerAddress(address) : address;
    setFormData(normalized);
    setEditingId(address?.id || address?._id || null);
    setIsAddingNew(true);

    // populate location selects if we already have the locations loaded
    if (locations && locations.length > 0) {
      // try to find province by code or by name
      let prov = null;
      if (normalized.provinceCode) prov = locations.find(p => String(p.code) === String(normalized.provinceCode));
      if (!prov && normalized.city) prov = locations.find(p => p.name === normalized.city);
      if (prov) {
        setDistricts(prov.districts || []);
        // set provinceCode in formData
        setFormData(prev => ({ ...prev, provinceCode: String(prov.code), city: prov.name }));
        // find district by code or name
        let dist = null;
        if (normalized.districtCode) dist = (prov.districts || []).find(d => String(d.code) === String(normalized.districtCode));
        if (!dist && normalized.district) dist = (prov.districts || []).find(d => d.name === normalized.district);
        if (dist) {
          setWards(dist.wards || []);
          setFormData(prev => ({ ...prev, districtCode: String(dist.code), district: dist.name }));
          // find ward
          let w = null;
          if (normalized.wardCode) w = (dist.wards || []).find(x => String(x.code) === String(normalized.wardCode));
          if (!w && normalized.ward) w = (dist.wards || []).find(x => x.name === normalized.ward);
          if (w) setFormData(prev => ({ ...prev, wardCode: String(w.code), ward: w.name }));
        }
      }
    }
  };

  // if locations are loaded after user clicked edit, populate selects accordingly
  React.useEffect(() => {
    if (!editingId) return;
    // ensure formData has values
    const fd = formData;
    if (!fd) return;
    if (!locations || locations.length === 0) return;
    // If we don't have a provinceCode, try to infer it by matching district or ward names across all provinces
    if (!fd.provinceCode) {
      if (fd.district || fd.ward) {
        let found = null;
        for (const prov of locations) {
          const d = (prov.districts || []).find(x => x.name === fd.district);
          if (d) { found = { prov, dist: d }; break; }
          // try ward match
          for (const dist of (prov.districts || [])) {
            const w = (dist.wards || []).find(x => x.name === fd.ward);
            if (w) { found = { prov, dist, ward: w }; break; }
          }
          if (found) break;
        }
        if (found) {
          const prov = found.prov;
          const dist = found.dist || found.ward && (found.ward.parent || null) || null;
          setDistricts(prov.districts || []);
          setFormData(prev => ({ ...prev, provinceCode: String(prov.code), city: prov.name }));
          if (found.dist) {
            setWards(found.dist.wards || []);
            setFormData(prev => ({ ...prev, districtCode: String(found.dist.code), district: found.dist.name }));
          }
          if (found.ward) {
            setWards(found.ward ? (found.dist ? found.dist.wards : []) : []);
            setFormData(prev => ({ ...prev, wardCode: String(found.ward.code), ward: found.ward.name }));
          }
        }
      }
    }
    // if provinceCode not set but we have city, try to find and populate
    if (!fd.provinceCode && fd.city) {
      const prov = locations.find(p => p.name === fd.city);
      if (prov) {
        setDistricts(prov.districts || []);
        setFormData(prev => ({ ...prev, provinceCode: String(prov.code) }));
      }
    }
    // if districtCode not set but district name exists, try to find and populate wards
    if (fd.provinceCode && !fd.districtCode && fd.district) {
      const prov = locations.find(p => String(p.code) === String(fd.provinceCode));
      const dist = prov?.districts?.find(d => d.name === fd.district);
      if (dist) {
        setWards(dist.wards || []);
        setFormData(prev => ({ ...prev, districtCode: String(dist.code) }));
      }
    }
    // if wardCode not set but ward name exists, try to set wardCode
    if (fd.provinceCode && fd.districtCode && !fd.wardCode && fd.ward) {
      const prov = locations.find(p => String(p.code) === String(fd.provinceCode));
      const dist = prov?.districts?.find(d => String(d.code) === String(fd.districtCode));
      const w = dist?.wards?.find(x => x.name === fd.ward);
      if (w) setFormData(prev => ({ ...prev, wardCode: String(w.code) }));
    }
  }, [locations]);

  const handleDelete = (addressId) => {
    console.log('handleDelete called with id:', addressId);
    const address = addresses.find(addr => addr?.id === addressId);
    const addressName = address ? `${address.name} - ${address.address}` : 'địa chỉ này';
    setDeleteConfirmModal({ 
      isOpen: true, 
      addressId, 
      addressName 
    });
  };

  const confirmDelete = async () => {
    const addressId = deleteConfirmModal.addressId;
    console.log('confirmDelete for id:', addressId);
    const previous = [...addresses];
    
    // 3NF: Use Address API to delete
    try {
      await deleteAddress(addressId);
      // Update local state
      setAddresses(prev => prev.filter(addr => addr?.id !== addressId));
      toast.push({ title: 'Thành công', message: 'Đã xóa địa chỉ', type: 'success' });
    } catch (e) {
      console.error('Delete address error:', e);
      toast.push({ title: 'Lỗi', message: 'Không thể xóa địa chỉ', type: 'error' });
    } finally {
      setDeleteConfirmModal({ isOpen: false, addressId: null, addressName: '' });
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmModal({ isOpen: false, addressId: null, addressName: '' });
  };

  const handleSetDefault = async (addressId) => {
    const previous = [...addresses];
    // Optimistic UI update
    setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: addr?.id === addressId })));
    
    try {
      // 3NF: Use Address API to set default
      await setDefaultAddress(addressId);
      toast.push({ title: 'Thành công', message: 'Đã cập nhật địa chỉ mặc định', type: 'success' });
    } catch (e) {
      console.error('Set default address error:', e);
      // Revert optimistic update
      setAddresses(previous);
      toast.push({ title: 'Lỗi', message: 'Không thể cập nhật địa chỉ mặc định', type: 'error' });
    }
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({
      type: 'home',
      name: '',
      phone: '',
      address: '',
      ward: '',
      district: '',
      city: '',
      provinceCode: '',
      districtCode: '',
      wardCode: '',
      isDefault: false
    });
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">Sổ địa chỉ</h2>
        {!isAddingNew && (
          <Button
            variant="default"
            size="sm"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setIsAddingNew(true)}
          >
            Thêm địa chỉ mới
          </Button>
        )}
      </div>
      {/* Add/Edit Form */}
      {isAddingNew && (
        <div className="bg-muted rounded-lg p-4 mb-6">
          <h3 className="font-medium text-foreground mb-4">
            {editingId ? 'Chỉnh sửa địa chỉ' : 'Thêm địa chỉ mới'}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            {/* Address Type */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Loại địa chỉ
              </label>
              <div className="flex space-x-4">
                {Object.entries(addressTypes)?.map(([type, config]) => (
                  <label key={type} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="addressType"
                      value={type}
                      checked={formData?.type === type}
                      onChange={(e) => handleInputChange('type', e?.target?.value)}
                      className="w-4 h-4 text-accent focus:ring-accent"
                    />
                    <Icon name={config?.icon} size={16} className={config?.color} />
                    <span className="text-sm text-foreground">{config?.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Default Address */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isDefault"
                checked={formData?.isDefault}
                onChange={(e) => handleInputChange('isDefault', e?.target?.checked)}
                className="w-4 h-4 text-accent focus:ring-accent rounded"
              />
              <label htmlFor="isDefault" className="text-sm text-foreground">
                Đặt làm địa chỉ mặc định
              </label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              label="Họ và tên"
              type="text"
              value={formData?.name}
              onChange={(e) => handleInputChange('name', e?.target?.value)}
              placeholder="Nhập họ và tên"
              required
            />
            {errors.name && <div className="text-sm text-error mt-1">{errors.name}</div>}

            <Input
              label="Số điện thoại"
              type="tel"
              value={formData?.phone}
              onChange={(e) => handleInputChange('phone', e?.target?.value)}
              placeholder="Nhập số điện thoại"
              required
            />
            {errors.phone && <div className="text-sm text-error mt-1">{errors.phone}</div>}

            <div className="md:col-span-2">
              <Input
                label="Địa chỉ cụ thể"
                type="text"
                value={formData?.address}
                onChange={(e) => handleInputChange('address', e?.target?.value)}
                placeholder="Số nhà, tên đường"
                required
              />
              {errors.address && <div className="text-sm text-error mt-1">{errors.address}</div>}
            </div>

            <div>
              <label className="block text-sm mb-1">Tỉnh/Thành phố</label>
                <div className="text-xs text-gray-500 mb-1">{formData.city ? `Bạn đã chọn: ${formData.city}` : 'Chưa chọn tỉnh'}</div>
              <select className="w-full px-4 py-3 border border-border rounded-md" value={formData?.provinceCode || ''} onChange={(e) => handleProvinceChange(e?.target?.value)} required>
                <option value="">Chọn tỉnh/thành phố</option>
                {locations?.map(loc => <option key={loc.code} value={loc.code}>{loc.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Quận/Huyện</label>
                <div className="text-xs text-gray-500 mb-1">{formData.district ? `Bạn đã chọn: ${formData.district}` : 'Chưa chọn quận/huyện'}</div>
              <select className="w-full px-4 py-3 border border-border rounded-md" value={formData?.districtCode || ''} onChange={(e) => handleDistrictChange(e?.target?.value)} required>
                <option value="">Chọn quận/huyện</option>
                {districts?.map(d => <option key={d.code} value={d.code}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm mb-1">Phường/Xã</label>
                <div className="text-xs text-gray-500 mb-1">{formData.ward ? `Bạn đã chọn: ${formData.ward}` : 'Chưa chọn phường/xã'}</div>
              <select className="w-full px-4 py-3 border border-border rounded-md" value={formData?.wardCode || ''} onChange={(e) => handleWardChange(e?.target?.value)} required>
                <option value="">Chọn phường/xã</option>
                {wards?.map(w => <option key={w.code} value={w.code}>{w.name}</option>)}
              </select>
            </div>

            {/* Live preview of selected location */}
            <div className="md:col-span-2">
              <div className="mt-2 p-3 bg-white border border-border rounded-md text-sm">
                <strong>Bạn đã chọn:</strong>
                <div className="mt-1 text-foreground">
                  {formData?.city || '—'}{formData?.district ? ` / ${formData?.district}` : ''}{formData?.ward ? ` / ${formData?.ward}` : ''}
                </div>
                {errors.location && <div className="text-sm text-error mt-2">{errors.location}</div>}
              </div>
            </div>
          </div>

          <div className="flex space-x-2 mt-4">
            <Button
              variant="default"
              size="sm"
              iconName="Check"
              iconPosition="left"
              onClick={handleSubmit}
              disabled={saving}
            >
              {editingId ? 'Cập nhật' : 'Thêm địa chỉ'}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCancel}
            >
              Hủy
            </Button>
          </div>
        </div>
      )}
      {/* Address List */}
      <div className="space-y-4">
        {addresses?.map((address) => (
          <div
            key={address?.id}
            className={`border rounded-lg p-4 ${
              address?.isDefault 
                ? 'border-accent bg-accent/5' :'border-border hover:border-accent/50'
            } transition-smooth`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <Icon 
                    name={addressTypes?.[address?.type]?.icon} 
                    size={16} 
                    className={addressTypes?.[address?.type]?.color} 
                  />
                  <span className="font-medium text-foreground">
                    {addressTypes?.[address?.type]?.label}
                  </span>
                  {address?.isDefault && (
                    <span className="bg-accent text-accent-foreground px-2 py-0.5 rounded-full text-xs font-medium">
                      Mặc định
                    </span>
                  )}
                </div>
                
                <div className="text-sm text-foreground space-y-1">
                  <p className="font-medium">{address?.name} • {address?.phone}</p>
                  <p>{address?.address}</p>
                  <p>{address?.ward}, {address?.district}, {address?.city}</p>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                {!address?.isDefault && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSetDefault(address?.id)}
                    className="text-accent hover:text-accent hover:bg-accent/10"
                  >
                    Đặt mặc định
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(address)}
                >
                  <Icon name="Edit2" size={16} />
                </Button>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(address?.id)}
                  className="text-error hover:text-error hover:bg-error/10"
                >
                  <Icon name="Trash2" size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {addresses?.length === 0 && !isAddingNew && (
        <div className="text-center py-8">
          <Icon name="MapPin" size={48} className="mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground mb-4">Chưa có địa chỉ nào được lưu</p>
          <Button
            variant="default"
            iconName="Plus"
            iconPosition="left"
            onClick={() => setIsAddingNew(true)}
          >
            Thêm địa chỉ đầu tiên
          </Button>
        </div>
      )}

      {/* Confirmation Modal for Delete */}
      <Modal 
        open={deleteConfirmModal.isOpen} 
        onClose={cancelDelete}
        title="Xác nhận xóa địa chỉ"
      >
        <div className="space-y-4">
          <p className="text-foreground">
            Bạn có chắc chắn muốn xóa địa chỉ <strong>{deleteConfirmModal.addressName}</strong> không?
          </p>
          <p className="text-sm text-muted-foreground">
            Hành động này không thể hoàn tác.
          </p>
          <div className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={cancelDelete}
            >
              Hủy
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
            >
              Xóa địa chỉ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AddressBook;