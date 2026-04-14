import React, { useState, useEffect } from 'react';
import { FaPlus, FaTrash, FaSave, FaEdit, FaLightbulb } from 'react-icons/fa';
import * as api from '../../../services/api';
import toast from 'react-hot-toast';

const CategoriesManager: React.FC = () => {
    const [categories, setCategories] = useState<api.Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [formData, setFormData] = useState({ name_en: '', name_ru: '', slug: '' });

    const token = localStorage.getItem('admin_token') || '';

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const data = await api.categoriesApi.getAll(token);
            setCategories(data);
        } catch (e) {
            console.error('Failed to fetch categories:', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const generateSlug = (text: string) => {
        return text.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        if (name === 'name_en' && !isEditing) {
            setFormData(prev => ({ ...prev, [name]: value, slug: generateSlug(value) }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (isEditing) {
                await api.categoriesApi.update(isEditing, formData, token);
                toast.success('Kategoriya muvaffaqiyatli yangilandi');
            } else {
                await api.categoriesApi.create(formData, token);
                toast.success('Yangi kategoriya qo\'shildi');
            }
            setFormData({ name_en: '', name_ru: '', slug: '' });
            setIsEditing(null);
            fetchCategories();
        } catch (e) {
            // Error toast handled by interceptor
        }
    };

    const handleEdit = (cat: api.Category) => {
        setIsEditing(cat.id);
        setFormData({ name_en: cat.name_en, name_ru: cat.name_ru, slug: cat.slug });
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm('Haqiqatdan ham ushbu kategoriyani o\'chirmoqchimisiz? Bu ushbu kategoriyadagi loyihalarga ta\'sir qilishi mumkin.')) return;
        try {
            await api.categoriesApi.delete(id, token);
            toast.success('Kategoriya o\'chirildi');
            fetchCategories();
        } catch (e) {
            // Error handled by interceptor
        }
    };

    if (loading && categories.length === 0) return <div className="adm-loader">Kategoriyalar yuklanmoqda...</div>;

    return (
        <div className="animate-fade-in">
            <div className="adm-header-action">
                <div>
                    <h1 className="adm-heading">Xizmat va Loyiha Kategoriyalari</h1>
                    <p className="adm-subheading">Kontakt formasidagi xizmatlar ro'yxati va Loyihalar bo'limidagi filtrlarni shu yerda boshqaring.</p>
                </div>
            </div>

            <div className="adm-help-banner">
                <div className="adm-help-icon"><FaLightbulb /></div>
                <div className="adm-help-content">
                    <h4>Nega bu kerak?</h4>
                    <p>
                        Siz bu yerda qo'shgan kategoriyalar avtomatik ravishda saytdagi <b>Kontakt formasida</b> (Interested Service) paydo bo'ladi. 
                        Shuningdek, ular <b>Loyihalar</b> bo'limida filter sifatida ishlatiladi.
                    </p>
                </div>
            </div>

            <div className="manager-sections" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '32px' }}>
                {/* List Section */}
                <div className="adm-card">
                    <div className="adm-table-container">
                        <table className="adm-table">
                            <thead>
                                <tr>
                                    <th>Kategoriya Nomi (O'zb/Eng)</th>
                                    <th>Slug</th>
                                    <th>Amallar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.map(cat => (
                                    <tr key={cat.id}>
                                        <td>
                                            <div style={{ fontWeight: 600 }}>{cat.name_en}</div>
                                            <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>{cat.name_ru}</div>
                                        </td>
                                        <td><code className="adm-code">{cat.slug}</code></td>
                                        <td>
                                            <div className="adm-actions">
                                                <button className="adm-btn-icon" onClick={() => handleEdit(cat)} title="Tahrirlash">
                                                    <FaEdit />
                                                </button>
                                                <button className="adm-btn-icon" onClick={() => handleDelete(cat.id)} style={{ color: 'var(--adm-error)' }} title="O'chirish">
                                                    <FaTrash />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Form Section */}
                <div className="adm-card" style={{ height: 'fit-content' }}>
                    <h3 className="adm-heading" style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                        {isEditing ? <><FaEdit /> Tahrirlash</> : <><FaPlus /> Yangi qo'shish</>}
                    </h3>
                    <form onSubmit={handleSubmit} className="adm-form">
                        <div className="form-group">
                            <label className="form-label">Nomi (English)</label>
                            <input 
                                className="form-input" 
                                name="name_en" 
                                value={formData.name_en} 
                                onChange={handleInputChange} 
                                required 
                                placeholder="Management, Consulting..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Nomi (Russian)</label>
                            <input 
                                className="form-input" 
                                name="name_ru" 
                                value={formData.name_ru} 
                                onChange={handleInputChange} 
                                required 
                                placeholder="Управление, Консалтинг..."
                            />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Slug (tizim uchun ID)</label>
                            <input 
                                className="form-input" 
                                name="slug" 
                                value={formData.slug} 
                                onChange={handleInputChange} 
                                required 
                                placeholder="management-solutions"
                                disabled={!!isEditing} // Only editable on creation for safety
                            />
                        </div>

                        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                            <button type="submit" className="adm-btn adm-btn-primary" style={{ flex: 1 }}>
                                <FaSave /> {isEditing ? 'Yangilash' : 'Saqlash'}
                            </button>
                            {isEditing && (
                                <button 
                                    type="button" 
                                    className="adm-btn adm-btn-outline" 
                                    onClick={() => { setIsEditing(null); setFormData({ name_en: '', name_ru: '', slug: '' }); }}
                                >
                                    Bekor qilish
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CategoriesManager;
