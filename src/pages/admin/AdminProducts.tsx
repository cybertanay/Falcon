import React, { useState, useEffect } from 'react';
import { Package, Plus, Trash2, Edit, Eye, CheckCircle2, XCircle, Search, Upload, AlertCircle, Sparkles } from 'lucide-react';
import { Product } from '../../types';

export const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: 'Powders' as 'Powders' | 'Whole Spices' | 'Dehydrated Ingredients' | 'Spice Blends',
    shortDescription: '',
    fullDescription: '',
    origin: 'India',
    botanicalName: '',
    form: '',
    keyActiveComponent: '',
    minimumOrderQuantity: '1 Metric Ton',
    storageConditions: 'Hygienic warehouse storage away from direct sunlight',
    shelfLife: '24 Months',
    image: '/src/assets/images/turmeric_product_1786195278080.jpg',
    featured: false,
    published: true
  });

  const getAuthToken = () => sessionStorage.getItem('falcon_admin_token') || '';

  const authFetch = (url: string, options: RequestInit = {}) => {
    const token = getAuthToken();
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...(options.headers || {})
      }
    });
  };

  const fetchProducts = async () => {
    try {
      const res = await authFetch('/api/products?all=true');
      if (res.ok) {
        const data = await res.json();
        setProducts(data);
      }
    } catch (e) {
      console.error('Failed to load products:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleOpenCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      slug: '',
      category: 'Powders',
      shortDescription: '',
      fullDescription: '',
      origin: 'India',
      botanicalName: '',
      form: '',
      keyActiveComponent: '',
      minimumOrderQuantity: '1 Metric Ton',
      storageConditions: 'Hygienic warehouse storage away from direct sunlight',
      shelfLife: '24 Months',
      image: '/src/assets/images/turmeric_product_1786195278080.jpg',
      featured: false,
      published: true
    });
    setFormError('');
    setShowModal(true);
  };

  const handleOpenEditModal = (p: Product) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      category: p.category,
      shortDescription: p.shortDescription || '',
      fullDescription: p.fullDescription || '',
      origin: p.origin,
      botanicalName: p.specifications?.botanicalName || '',
      form: p.form || '',
      keyActiveComponent: p.specifications?.keyActiveComponent || '',
      minimumOrderQuantity: p.minimumOrderQuantity || '1 Metric Ton',
      storageConditions: p.specifications?.storageConditions || '',
      shelfLife: p.specifications?.shelfLife || '24 Months',
      image: p.image,
      featured: p.featured,
      published: p.published
    });
    setFormError('');
    setShowModal(true);
  };

  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setFormError('Image size exceeds 5MB limit.');
      return;
    }

    setUploadingImage(true);
    setFormError('');

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        const base64 = reader.result as string;
        const res = await authFetch('/api/admin/upload-image', {
          method: 'POST',
          body: JSON.stringify({
            imageData: base64,
            filename: file.name
          })
        });

        const data = await res.json();
        if (res.ok && data.success) {
          setFormData(prev => ({ ...prev, image: data.url }));
        } else {
          setFormError(data.error || 'Failed to upload image.');
        }
      } catch (err) {
        setFormError('Upload failed due to network error.');
      } finally {
        setUploadingImage(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsSubmitting(true);

    const payload = {
      ...formData,
      slug: formData.slug.toLowerCase().trim().replace(/[^a-z0-9-]/g, '-'),
      gallery: [formData.image],
      packagingOptions: ['Multi-wall Kraft Bags (25kg)', 'Vacuum Foil Packs (10kg)', 'PP Woven Bags (50kg)'],
      availableFormats: ['Fine Ground Powder', 'Whole Seed'],
      specifications: {
        botanicalName: formData.botanicalName,
        origin: formData.origin,
        form: formData.form,
        keyActiveComponent: formData.keyActiveComponent,
        shelfLife: formData.shelfLife,
        storageConditions: formData.storageConditions,
        minimumOrderQuantity: formData.minimumOrderQuantity
      }
    };

    try {
      let res;
      if (editingProduct) {
        res = await authFetch(`/api/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        res = await authFetch('/api/products', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      if (res.ok) {
        setShowModal(false);
        fetchProducts();
      } else {
        const data = await res.json();
        setFormError(data.error || 'Failed to save product.');
      }
    } catch (err) {
      setFormError('Network error saving product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleTogglePublish = async (p: Product) => {
    try {
      const res = await authFetch(`/api/products/${p.id}`, {
        method: 'PUT',
        body: JSON.stringify({ published: !p.published })
      });
      if (res.ok) {
        setProducts(prev => prev.map(item => item.id === p.id ? { ...item, published: !p.published } : item));
      }
    } catch (e) {
      console.error('Error toggling publish:', e);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to delete ${name}? This will remove it from the database.`)) {
      return;
    }
    try {
      const res = await authFetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== id));
      }
    } catch (e) {
      console.error('Error deleting product:', e);
    }
  };

  const filtered = products.filter(p => {
    const matchCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="space-y-8 text-left">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#154736]/60 pb-5">
        <div>
          <span className="text-xs font-mono text-[#f2a900] uppercase tracking-wider block">
            Catalogue CMS
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#fdfcf0]">
            Export Product Management
          </h1>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="bg-[#f2a900] hover:bg-[#d97706] text-[#030d0a] font-bold px-4 py-2.5 rounded-xl text-xs shadow flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-[#05140f] p-4 rounded-2xl border border-[#154736]/70 flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 absolute left-3 top-3 text-[#a3b899]" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#030d0a] text-[#fdfcf0] pl-9 pr-3 py-2 rounded-xl border border-[#154736] text-xs focus:outline-none focus:border-[#f2a900]"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {['All', 'Powders', 'Whole Spices', 'Dehydrated Ingredients'].map(c => (
            <button
              key={c}
              onClick={() => setSelectedCategory(c)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === c
                  ? 'bg-[#f2a900] text-[#030d0a] font-bold'
                  : 'bg-[#030d0a] text-[#a3b899] border border-[#154736]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#05140f] rounded-2xl border border-[#154736]/70 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-[#a3b899]">
            <thead className="bg-[#030d0a] text-[#f2a900] font-mono uppercase tracking-wider border-b border-[#154736]/80">
              <tr>
                <th className="py-3 px-4">Product Name</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Botanical / Spec</th>
                <th className="py-3 px-4">MOQ</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#154736]/40">
              {filtered.map(p => (
                <tr key={p.id} className="hover:bg-[#0b2317]/50 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-[#fdfcf0] flex items-center gap-3">
                    <img src={p.image} alt={p.name} className="w-9 h-9 rounded-lg object-cover border border-[#154736]" />
                    <div>
                      <span className="block">{p.name}</span>
                      <span className="text-[10px] font-mono text-[#a3b899] font-normal">/{p.slug}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 font-mono">{p.category}</td>
                  <td className="py-3.5 px-4 font-mono text-[#f2a900]">
                    {p.specifications?.keyActiveComponent || p.specifications?.botanicalName || 'Standard'}
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-[#fdfcf0]">{p.minimumOrderQuantity}</td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleTogglePublish(p)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-mono font-bold transition-colors ${
                        p.published
                          ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                          : 'bg-red-500/15 text-red-400 border border-red-500/30'
                      }`}
                    >
                      {p.published ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                      <span>{p.published ? 'Published' : 'Draft'}</span>
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right space-x-2">
                    <button
                      onClick={() => handleOpenEditModal(p)}
                      className="p-1.5 text-[#a3b899] hover:text-[#f2a900] bg-[#030d0a] rounded-lg border border-[#154736]"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id, p.name)}
                      className="p-1.5 text-red-400 hover:text-red-300 bg-[#030d0a] rounded-lg border border-red-900/50"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Product Create / Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#030d0a]/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#05140f] border border-[#f2a900]/40 rounded-3xl p-6 sm:p-8 max-w-2xl w-full my-8 space-y-6 shadow-2xl text-left">
            <div className="flex items-center justify-between border-b border-[#154736] pb-4">
              <div>
                <span className="text-[10px] font-mono text-[#f2a900] uppercase tracking-wider block">Product Editor</span>
                <h2 className="text-xl font-serif font-bold text-[#fdfcf0]">
                  {editingProduct ? `Edit: ${editingProduct.name}` : 'Add New Commodity'}
                </h2>
              </div>
              <button onClick={() => setShowModal(false)} className="text-[#a3b899] hover:text-[#fdfcf0]">
                ✕
              </button>
            </div>

            {formError && (
              <div className="p-3 bg-red-950/60 border border-red-800 rounded-xl text-xs text-red-300">
                {formError}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#f2a900] font-mono mb-1">Product Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => {
                      const name = e.target.value;
                      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                      setFormData(prev => ({ ...prev, name, slug: editingProduct ? prev.slug : slug }));
                    }}
                    placeholder="e.g. Premium Turmeric Powder"
                    className="w-full bg-[#030d0a] text-[#fdfcf0] p-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#f2a900] font-mono mb-1">URL Slug *</label>
                  <input
                    type="text"
                    required
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="turmeric-powder"
                    className="w-full bg-[#030d0a] text-[#fdfcf0] p-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[#f2a900] font-mono mb-1">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as any }))}
                    className="w-full bg-[#030d0a] text-[#fdfcf0] p-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
                  >
                    <option value="Powders">Powders</option>
                    <option value="Whole Spices">Whole Spices</option>
                    <option value="Dehydrated Ingredients">Dehydrated Ingredients</option>
                    <option value="Spice Blends">Spice Blends</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#f2a900] font-mono mb-1">Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData(prev => ({ ...prev, origin: e.target.value }))}
                    className="w-full bg-[#030d0a] text-[#fdfcf0] p-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#f2a900] font-mono mb-1">Minimum Order Qty</label>
                  <input
                    type="text"
                    value={formData.minimumOrderQuantity}
                    onChange={(e) => setFormData(prev => ({ ...prev, minimumOrderQuantity: e.target.value }))}
                    className="w-full bg-[#030d0a] text-[#fdfcf0] p-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[#f2a900] font-mono mb-1">Botanical Name</label>
                  <input
                    type="text"
                    value={formData.botanicalName}
                    onChange={(e) => setFormData(prev => ({ ...prev, botanicalName: e.target.value }))}
                    placeholder="e.g. Curcuma longa L."
                    className="w-full bg-[#030d0a] text-[#fdfcf0] p-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#f2a900] font-mono mb-1">Key Active Component</label>
                  <input
                    type="text"
                    value={formData.keyActiveComponent}
                    onChange={(e) => setFormData(prev => ({ ...prev, keyActiveComponent: e.target.value }))}
                    placeholder="e.g. Curcumin 3.0% - 5.0%"
                    className="w-full bg-[#030d0a] text-[#fdfcf0] p-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#f2a900] font-mono mb-1">Short Description</label>
                <textarea
                  rows={2}
                  value={formData.shortDescription}
                  onChange={(e) => setFormData(prev => ({ ...prev, shortDescription: e.target.value }))}
                  className="w-full bg-[#030d0a] text-[#fdfcf0] p-2.5 rounded-xl border border-[#154736] focus:border-[#f2a900] focus:outline-none"
                />
              </div>

              {/* Image Upload Area */}
              <div className="space-y-2 bg-[#030d0a] p-3.5 rounded-xl border border-[#154736]">
                <label className="block text-[#f2a900] font-mono mb-1">Product Image (Object Storage Upload)</label>
                <div className="flex items-center gap-3">
                  <img src={formData.image} alt="Preview" className="w-12 h-12 rounded-lg object-cover border border-[#154736]" />
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="text-xs text-[#a3b899] file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#f2a900] file:text-[#030d0a] hover:file:bg-[#d97706]"
                    />
                    <span className="text-[10px] text-[#a3b899] block mt-1">
                      {uploadingImage ? 'Uploading image...' : 'Max 5MB (JPG, PNG, WebP)'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-[#fdfcf0]">
                  <input
                    type="checkbox"
                    checked={formData.published}
                    onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.checked }))}
                    className="accent-[#f2a900]"
                  />
                  <span>Published to Public Website</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-[#fdfcf0]">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                    className="accent-[#f2a900]"
                  />
                  <span>Feature on Homepage</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#154736]">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#030d0a] text-[#a3b899] border border-[#154736]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || uploadingImage}
                  className="px-5 py-2 rounded-xl bg-[#f2a900] text-[#030d0a] font-bold shadow"
                >
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
