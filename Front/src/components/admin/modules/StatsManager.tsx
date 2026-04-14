import React, { useState, useEffect, useRef } from 'react';
import { FaPlus, FaTrash, FaSave, FaChartBar, FaTimes, FaSearch } from 'react-icons/fa';
import * as api from '../../../services/api';
import { iconNames, iconGroups, getIcon } from '../../../utils/iconMap';

const StatsManager: React.FC = () => {
    const [stats, setStats] = useState<api.Stat[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [status, setStatus] = useState<{ type: 'success' | 'error', msg: string } | null>(null);
    const [pickerOpenIndex, setPickerOpenIndex] = useState<number | null>(null);
    const [iconSearch, setIconSearch] = useState('');
    const pickerRef = useRef<HTMLDivElement>(null);
    const token = localStorage.getItem('admin_token') || '';

    const fetchStats = async () => {
        try {
            setLoading(true);
            const data = await api.statsApi.getAll(token);
            setStats(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchStats(); }, []);

    // Close icon picker on outside click
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
                setPickerOpenIndex(null);
                setIconSearch('');
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleAdd = () => {
        setStats([...stats, { 
            id: 0, 
            label_en: 'New Stat', 
            label_ru: 'Новый показатель', 
            value: '0+', 
            icon: 'FaHotel' 
        } as api.Stat]);
    };

    const handleUpdateField = (index: number, field: keyof api.Stat, value: string | boolean) => {
        const newStats = [...stats];
        (newStats[index] as any)[field] = value;
        setStats(newStats);
    };

    const handleSelectIcon = (index: number, iconName: string) => {
        handleUpdateField(index, 'icon', iconName);
        setPickerOpenIndex(null);
        setIconSearch('');
    };

    const handleDelete = async (index: number) => {
        const stat = stats[index];
        if (stat.id) {
            if (!window.confirm('Delete this stat?')) return;
            try {
                await api.statsApi.delete(stat.id, token);
            } catch (error) {
                console.error(error);
            }
        }
        setStats(stats.filter((_, i) => i !== index));
    };

    const handleSaveAll = async () => {
        try {
            setSaving(true);
            setStatus({ type: 'success', msg: 'Saving stats...' });
            for (const s of stats) {
                const payload = { label_en: s.label_en, label_ru: s.label_ru, value: s.value, icon: s.icon || 'FaHotel' };
                if (s.id) {
                    await api.statsApi.update(s.id, payload, token);
                } else {
                    await api.statsApi.create(payload as any, token);
                }
            }
            setStatus({ type: 'success', msg: '✅ All stats saved successfully!' });
            fetchStats();
            setTimeout(() => setStatus(null), 4000);
        } catch (error) {
            setStatus({ type: 'error', msg: '❌ Failed to save some stats.' });
        } finally {
            setSaving(false);
        }
    };

    const filteredIcons = iconSearch
        ? iconNames.filter(name => name.toLowerCase().includes(iconSearch.toLowerCase()))
        : iconNames;

    if (loading) return <div className="adm-loader">Loading Stats...</div>;

    return (
        <div className="adm-card" style={{ marginTop: '32px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h3 style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px', margin: 0 }}>
                    <FaChartBar /> Achievements & Stats
                </h3>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="adm-btn adm-btn-outline" onClick={handleAdd} disabled={saving}>
                        <FaPlus /> Add Stat
                    </button>
                    {stats.length > 0 && (
                        <button className="adm-btn adm-btn-primary" onClick={handleSaveAll} disabled={saving}>
                            <FaSave /> {saving ? 'Saving...' : 'Save All'}
                        </button>
                    )}
                </div>
            </div>

            {status && (
                <div style={{ 
                    padding: '12px 16px', borderRadius: '8px', marginBottom: '20px',
                    background: status.type === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: status.type === 'success' ? '#10b981' : '#ef4444',
                    fontSize: '0.9rem', fontWeight: 500
                }}>
                    {status.msg}
                </div>
            )}

            {stats.length === 0 ? (
                <div style={{
                    textAlign: 'center', padding: '48px 20px', 
                    background: '#f9fafb', borderRadius: '12px',
                    border: '2px dashed #e5e7eb'
                }}>
                    <FaChartBar style={{ fontSize: '2.5rem', color: '#d1d5db', marginBottom: '12px' }} />
                    <p style={{ color: '#6b7280', margin: 0, fontSize: '0.95rem' }}>
                        No stats yet. Click "Add Stat" to create your first achievement card.
                    </p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {stats.map((stat, i) => {
                        const Icon = getIcon(stat.icon);
                        return (
                            <div key={stat.id || `new-${i}`} style={{ 
                                display: 'grid', 
                                gridTemplateColumns: '80px 1fr', 
                                gap: '16px', 
                                padding: '20px',
                                background: '#f9fafb', 
                                borderRadius: '12px', 
                                border: '1px solid #edf2f7',
                                position: 'relative'
                            }}>
                                {/* Icon Picker Button */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                    <button
                                        onClick={() => {
                                            setPickerOpenIndex(pickerOpenIndex === i ? null : i);
                                            setIconSearch('');
                                        }}
                                        style={{
                                            width: '64px', height: '64px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))',
                                            border: '2px solid rgba(201,168,76,0.3)',
                                            borderRadius: '12px', cursor: 'pointer',
                                            transition: 'all 0.2s ease',
                                            color: '#C9A84C', fontSize: '1.5rem'
                                        }}
                                        title="Click to change icon"
                                    >
                                        <Icon />
                                    </button>
                                    <span style={{ 
                                        fontSize: '0.65rem', color: '#9ca3af', 
                                        textAlign: 'center', maxWidth: '80px',
                                        overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                                    }}>
                                        {stat.icon || 'FaHotel'}
                                    </span>
                                </div>

                                {/* Fields */}
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 120px', gap: '12px', alignItems: 'start' }}>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>
                                            Label (EN)
                                        </label>
                                        <input 
                                            className="adm-input" placeholder="e.g. Hotels" 
                                            value={stat.label_en} 
                                            onChange={e => handleUpdateField(i, 'label_en', e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>
                                            Label (RU)
                                        </label>
                                        <input 
                                            className="adm-input" placeholder="e.g. Отели" 
                                            value={stat.label_ru} 
                                            onChange={e => handleUpdateField(i, 'label_ru', e.target.value)} 
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: '0.75rem', fontWeight: 600, color: '#374151', marginBottom: '4px', display: 'block' }}>
                                            Value
                                        </label>
                                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                            <input 
                                                className="adm-input" placeholder="60+" 
                                                value={stat.value} 
                                                onChange={e => handleUpdateField(i, 'value', e.target.value)} 
                                                style={{ flex: 1 }}
                                            />
                                            <button 
                                                className="adm-btn-icon" 
                                                onClick={() => handleDelete(i)} 
                                                style={{ color: '#ef4444', flexShrink: 0 }}
                                                title="Delete stat"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                {/* Live Preview */}
                                <div style={{ 
                                    gridColumn: '1 / -1',
                                    display: 'flex', alignItems: 'center', gap: '12px',
                                    padding: '12px 16px', marginTop: '4px',
                                    background: '#fff', borderRadius: '8px',
                                    border: '1px solid #e5e7eb'
                                }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                        PREVIEW:
                                    </span>
                                    <div style={{ 
                                        display: 'flex', alignItems: 'center', gap: '10px',
                                        padding: '8px 16px', background: 'linear-gradient(135deg, #f9fafb, #fff)',
                                        borderRadius: '8px', border: '1px solid #edf2f7'
                                    }}>
                                        <Icon style={{ fontSize: '1.2rem', color: '#C9A84C' }} />
                                        <span style={{ fontWeight: 700, fontSize: '1.3rem', color: '#0D1B2A' }}>
                                            {stat.value || '0'}
                                        </span>
                                        <span style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                                            {stat.label_en || 'Label'}
                                        </span>
                                    </div>
                                </div>

                                {/* Icon Picker Dropdown */}
                                {pickerOpenIndex === i && (
                                    <div ref={pickerRef} style={{
                                        position: 'absolute', top: '90px', left: '0', zIndex: 1000,
                                        width: '420px', maxHeight: '400px', overflowY: 'auto',
                                        background: '#fff', borderRadius: '12px',
                                        border: '1px solid #e5e7eb',
                                        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
                                        padding: '16px'
                                    }}>
                                        <div style={{ 
                                            display: 'flex', justifyContent: 'space-between', 
                                            alignItems: 'center', marginBottom: '12px' 
                                        }}>
                                            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#374151' }}>
                                                Select Icon
                                            </span>
                                            <button 
                                                onClick={() => { setPickerOpenIndex(null); setIconSearch(''); }}
                                                style={{ 
                                                    background: 'none', border: 'none', cursor: 'pointer',
                                                    color: '#9ca3af', fontSize: '1rem' 
                                                }}
                                            >
                                                <FaTimes />
                                            </button>
                                        </div>
                                        <div style={{ 
                                            position: 'relative', marginBottom: '12px' 
                                        }}>
                                            <FaSearch style={{ 
                                                position: 'absolute', left: '10px', top: '50%', 
                                                transform: 'translateY(-50%)', color: '#9ca3af', fontSize: '0.8rem' 
                                            }} />
                                            <input 
                                                placeholder="Search icons..." 
                                                value={iconSearch}
                                                onChange={e => setIconSearch(e.target.value)}
                                                style={{
                                                    width: '100%', padding: '8px 12px 8px 32px',
                                                    border: '1px solid #e5e7eb', borderRadius: '8px',
                                                    fontSize: '0.85rem', outline: 'none',
                                                    boxSizing: 'border-box'
                                                }}
                                            />
                                        </div>
                                        {iconSearch ? (
                                            <div style={{ 
                                                display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' 
                                            }}>
                                                {filteredIcons.map(name => {
                                                    const Ic = getIcon(name);
                                                    return (
                                                        <button 
                                                            key={name}
                                                            onClick={() => handleSelectIcon(i, name)}
                                                            title={name}
                                                            style={{
                                                                width: '100%', aspectRatio: '1',
                                                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                background: stat.icon === name ? 'rgba(201,168,76,0.15)' : '#f9fafb',
                                                                border: stat.icon === name ? '2px solid #C9A84C' : '1px solid #e5e7eb',
                                                                borderRadius: '8px', cursor: 'pointer',
                                                                color: stat.icon === name ? '#C9A84C' : '#6b7280',
                                                                fontSize: '1.1rem', transition: 'all 0.15s ease'
                                                            }}
                                                        >
                                                            <Ic />
                                                        </button>
                                                    );
                                                })}
                                                {filteredIcons.length === 0 && (
                                                    <p style={{ gridColumn: '1 / -1', textAlign: 'center', color: '#9ca3af', fontSize: '0.85rem', padding: '12px' }}>
                                                        No icons found
                                                    </p>
                                                )}
                                            </div>
                                        ) : (
                                            iconGroups.map(group => (
                                                <div key={group.label} style={{ marginBottom: '12px' }}>
                                                    <p style={{ 
                                                        fontSize: '0.7rem', fontWeight: 700, 
                                                        textTransform: 'uppercase', letterSpacing: '0.08em',
                                                        color: '#9ca3af', marginBottom: '6px' 
                                                    }}>
                                                        {group.label}
                                                    </p>
                                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '6px' }}>
                                                        {group.icons.map(name => {
                                                            const Ic = getIcon(name);
                                                            return (
                                                                <button 
                                                                    key={name}
                                                                    onClick={() => handleSelectIcon(i, name)}
                                                                    title={name}
                                                                    style={{
                                                                        width: '100%', aspectRatio: '1',
                                                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                                        background: stat.icon === name ? 'rgba(201,168,76,0.15)' : '#f9fafb',
                                                                        border: stat.icon === name ? '2px solid #C9A84C' : '1px solid #e5e7eb',
                                                                        borderRadius: '8px', cursor: 'pointer',
                                                                        color: stat.icon === name ? '#C9A84C' : '#6b7280',
                                                                        fontSize: '1.1rem', transition: 'all 0.15s ease'
                                                                    }}
                                                                >
                                                                    <Ic />
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default StatsManager;
