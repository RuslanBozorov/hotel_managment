import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTrash, FaSave, FaImage, FaSpinner } from 'react-icons/fa';
import * as api from '../../../services/api';

const PartnersManager: React.FC = () => {
    const [partners, setPartners] = useState<api.Partner[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
    
    const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);
    const token = localStorage.getItem('admin_token') || '';

    const fetchPartners = async () => {
        try {
            setLoading(true);
            const data = await api.partnersApi.getAll(token);
            setPartners(Array.isArray(data) ? data : []);
            fileInputRefs.current = new Array(data.length).fill(null);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchPartners(); }, []);

    const handleAdd = (category: 'partner' | 'brand' = 'brand') => {
        const newPartners = [...partners, { id: 0, name: 'Yangi brend', logo_url: '', category }];
        setPartners(newPartners);
        fileInputRefs.current = new Array(newPartners.length).fill(null);
    };

    const handleUpdateField = (index: number, field: keyof api.Partner, value: string) => {
        const newPartners = [...partners];
        (newPartners[index] as any)[field] = value;
        setPartners(newPartners);
    };

    const handleDelete = async (index: number) => {
        const partner = partners[index];
        if (partner.id) {
            if (!window.confirm(`"${partner.name}" logotipini o'chirishni tasdiqlaysizmi?`)) return;
            try {
                await api.partnersApi.delete(partner.id, token);
            } catch (error) {
                console.error(error);
            }
        }
        setPartners(partners.filter((_, i) => i !== index));
    };

    const handleImageUpload = async (index: number, file: File) => {
        try {
            setUploadingIndex(index);
            const res = await api.mediaApi.upload(file);
            const newPartners = [...partners];
            newPartners[index].logo_url = res.url;
            setPartners(newPartners);
        } catch (error) {
            alert('Rasm yuklashda xatolik yuz berdi.');
        } finally {
            setUploadingIndex(null);
        }
    };

    const handleSaveAll = async () => {
        try {
            setSaving(true);
            setStatus({ type: 'success', msg: 'Saqlanmoqda...' });
            
            for (const p of partners) {
                const payload = { name: p.name, logo_url: p.logo_url, category: p.category };
                if (p.id) {
                    await api.partnersApi.update(p.id, payload, token);
                } else {
                    await api.partnersApi.create(payload as any, token);
                }
            }
            setStatus({ type: 'success', msg: '✅ Barcha o\'zgarishlar muvaffaqiyatli saqlandi!' });
            fetchPartners();
            setTimeout(() => setStatus(null), 4000);
        } catch (error) {
            setStatus({ type: 'error', msg: '❌ Ba\'zi o\'zgarishlarni saqlashda xatolik yuz berdi.' });
        } finally {
            setSaving(false);
        }
    };

    const renderPartnerCard = (partner: api.Partner, i: number) => (
        <div key={partner.id || `new-${i}`} className="adm-partner-card" style={{ display: 'flex', flexDirection: 'column' }}>
            {partner.category === 'partner' && (
                <div 
                    className="adm-partner-logo-box"
                    onClick={() => fileInputRefs.current[i]?.click()}
                >
                    {uploadingIndex === i ? (
                        <div className="adm-loader-sm"><FaSpinner className="animate-spin" /></div>
                    ) : partner.logo_url ? (
                        <img src={partner.logo_url} alt={partner.name} />
                    ) : (
                        <div className="adm-upload-placeholder">
                            <FaImage />
                            <span>Logo yuklash</span>
                        </div>
                    )}
                    
                    <input 
                        type="file" 
                        accept="image/*" 
                        ref={el => { fileInputRefs.current[i] = el; }}
                        style={{ display: 'none' }}
                        onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                                handleImageUpload(i, e.target.files[0]);
                            }
                        }}
                    />
                </div>
            )}

            <div className="adm-partner-content" style={{ flex: 1, justifyContent: 'space-between' }}>
                <div>
                    <div className="adm-form-group">
                        <label>Brend nomi</label>
                        <input 
                            className="adm-input" 
                            placeholder="Masalan: Hilton" 
                            value={partner.name} 
                            onChange={e => handleUpdateField(i, 'name', e.target.value)} 
                        />
                    </div>

                    <div className="adm-form-group" style={{ marginBottom: 0 }}>
                        <label>Turi (Kategoriya)</label>
                        <div className="adm-type-toggle">
                            <button 
                                className={`adm-type-btn ${partner.category === 'partner' ? 'active' : ''}`}
                                onClick={() => handleUpdateField(i, 'category', 'partner')}
                            >
                                Strategik Hamkor
                            </button>
                            <button 
                                className={`adm-type-btn ${partner.category === 'brand' ? 'active' : ''}`}
                                onClick={() => handleUpdateField(i, 'category', 'brand')}
                            >
                                Global Brend
                            </button>
                        </div>
                    </div>
                </div>

                <div style={{ marginTop: '20px', textAlign: 'right' }}>
                    <button 
                        className="adm-btn"
                        style={{ color: 'var(--adm-error)', fontSize: '0.85rem', padding: '6px 12px', background: 'rgba(239, 68, 68, 0.1)' }}
                        onClick={() => handleDelete(i)}
                    >
                        <FaTrash /> O'chirish
                    </button>
                </div>
            </div>
        </div>
    );

    if (loading) return <div className="adm-loader">Hamkorlar yuklanmoqda...</div>;

    const strategicPartners = partners.filter(p => p.category === 'partner');
    const globalBrands = partners.filter(p => p.category === 'brand');

    return (
        <div className="partners-manager-wrapper animate-fade-in">
            <div className="adm-header-action">
                <div>
                    <h1 className="adm-heading">Hamkorlar va Brendlar</h1>
                    <p className="adm-subheading">Strategik hamkorlar (Grid) va xalqaro mehmonxona brendlarini (Marquee) boshqaring.</p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="adm-btn adm-btn-outline" onClick={() => handleAdd('brand')} disabled={saving}>
                        <FaPlus /> Yangi qo'shish
                    </button>
                    <button className="adm-btn adm-btn-primary" onClick={handleSaveAll} disabled={saving || partners.length === 0}>
                        <FaSave /> {saving ? 'Saqlanmoqda...' : 'Barchasini saqlash'}
                    </button>
                </div>
            </div>

            {status && (
                <div className={`adm-alert alert-${status.type}`}>
                    {status.msg}
                </div>
            )}

            <div className="manager-sections" style={{ display: 'flex', flexDirection: 'column', gap: '32px', marginTop: '32px' }}>
                <div className="adm-card">
                    <div style={{ marginBottom: '24px' }}>
                        <h4 className="group-title">Strategik Hamkorlar ({strategicPartners.length})</h4>
                        <p className="group-desc">
                            Ushbu hamkorlar Asosiy sahifada <strong>Logo + Nom</strong> ko'rinishida tasmada yuradi. 
                            Har bir hamkor uchun shaffof fondagi logotip yuklash tavsiya etiladi.
                        </p>
                    </div>
                    <div className="adm-partners-grid">
                        {partners.map((p, i) => p.category === 'partner' ? renderPartnerCard(p, i) : null)}
                        {strategicPartners.length === 0 && <div className="adm-empty-state">Hamkorlar mavjud emas</div>}
                    </div>
                </div>

                <div className="adm-card">
                    <div style={{ marginBottom: '24px' }}>
                        <h4 className="group-title">Global Brendlar ({globalBrands.length})</h4>
                        <p className="group-desc">
                            Ushbu brendlar Asosiy sahifada <strong>faqat Nomi (Text)</strong> ko'rinishida tasmada yuradi. 
                            Logotip yuklash shart emas, faqat nomini aniq yozing.
                        </p>
                    </div>
                    <div className="adm-partners-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
                        {partners.map((p, i) => p.category === 'brand' ? renderPartnerCard(p, i) : null)}
                        {globalBrands.length === 0 && <div className="adm-empty-state">Brendlar mavjud emas</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PartnersManager;
