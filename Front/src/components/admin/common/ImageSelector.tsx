import React, { useRef, useState } from 'react';
import { imageLibrary, getImagesByCategory } from '../../../utils/imageLibrary';
import type { ImageOption } from '../../../utils/imageLibrary';
import * as api from '../../../services/api';
import { useAdminToast } from '../context/AdminToastContext';
import { FaCloudUploadAlt, FaSpinner } from 'react-icons/fa';

interface ImageSelectorProps {
  value: string;
  onChange: (url: string) => void;
  category?: 'hotel' | 'room' | 'service' | 'team' | 'blog' | 'logo';
  label?: string;
}

const ImageSelector: React.FC<ImageSelectorProps> = ({ value, onChange, category, label = "Select Image" }) => {
  const options = category ? getImagesByCategory(category) : imageLibrary;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { showToast } = useAdminToast();

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploading(true);
      const result = await api.mediaApi.upload(file);
      onChange(result.url);
      showToast('Image uploaded successfully!');
    } catch (error) {
      console.error('Upload failed:', error);
      showToast('Upload failed. Please try again.', 'error');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="adm-form-group">
      <label>{label}</label>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
        <select 
          className="adm-input" 
          value={value} 
          onChange={(e) => onChange(e.target.value)}
          style={{ flex: 1, minWidth: '200px' }}
        >
          <option value="">-- Choose from Library --</option>
          {options.map((img: ImageOption, i: number) => (
            <option key={i} value={img.url}>{img.label}</option>
          ))}
          {!options.find((o: ImageOption) => o.url === value) && value && (
            <option value={value}>Uploaded / Custom Image</option>
          )}
        </select>

        <input 
          type="file" 
          ref={fileInputRef} 
          style={{ display: 'none' }} 
          accept="image/*"
          onChange={handleFileUpload}
        />

        <button 
          type="button" 
          className="adm-btn adm-btn-outline" 
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          {isUploading ? <FaSpinner className="animate-spin" /> : <FaCloudUploadAlt />}
          {isUploading ? 'Uploading...' : 'Upload'}
        </button>

        {value && (
          <div style={{ width: '40px', height: '40px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--adm-border)' }}>
            <img src={value} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSelector;
