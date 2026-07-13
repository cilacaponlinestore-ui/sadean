'use client';

import { useState, useRef } from 'react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export interface ImageItem {
  id?: string;
  url: string;
  isPrimary: boolean;
}

interface Props {
  images: ImageItem[];
  onChange: (images: ImageItem[]) => void;
  onDeleteExisting?: (id: string) => void;
  maxImages?: number;
  folder?: string;
}

export default function ImageUploader({ images, onChange, onDeleteExisting, maxImages = 5, folder = 'products' }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > maxImages) {
      toast.error(`Maksimal ${maxImages} gambar`);
      return;
    }

    setUploading(true);
    const uploaded: ImageItem[] = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      try {
        const res = await api.post('/storage/upload', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        uploaded.push({
          url: res.data.url,
          isPrimary: images.length + uploaded.length === 0,
        });
      } catch {
        toast.error(`Gagal upload ${file.name}`);
      }
    }

    onChange([...images, ...uploaded]);
    setUploading(false);
    if (inputRef.current) inputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    const img = images[index];
    if (img.id && onDeleteExisting) {
      onDeleteExisting(img.id);
    }
    const next = images.filter((_, i) => i !== index);
    if (next.length > 0 && images[index].isPrimary) {
      next[0].isPrimary = true;
    }
    onChange(next);
  };

  const handleSetPrimary = (index: number) => {
    onChange(images.map((img, i) => ({ ...img, isPrimary: i === index })));
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Gambar Produk {images.length > 0 && `(${images.length}/${maxImages})`}
      </label>

      <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-3">
        {images.map((img, index) => (
          <div key={index} className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
            <img src={img.url} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
              {!img.isPrimary && (
                <button type="button" onClick={() => handleSetPrimary(index)}
                  className="p-1.5 bg-white rounded-full hover:bg-gray-100" title="Jadikan utama">
                  <svg className="w-4 h-4 text-yellow-500" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                </button>
              )}
              {img.isPrimary && (
                <span className="text-xs text-white bg-emerald-600 px-2 py-1 rounded-full">Utama</span>
              )}
              <button type="button" onClick={() => handleRemove(index)}
                className="p-1.5 bg-white rounded-full hover:bg-red-50" title="Hapus">
                <svg className="w-4 h-4 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}

        {images.length < maxImages && (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={uploading}
            className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-primary-400 hover:bg-primary-50 transition disabled:opacity-50">
            {uploading ? (
              <span className="text-sm text-gray-500">Uploading...</span>
            ) : (
              <div className="text-center">
                <svg className="w-8 h-8 mx-auto text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                  <path d="M12 4v16m8-8H4" />
                </svg>
                <span className="text-xs text-gray-500 mt-1 block">Tambah</span>
              </div>
            )}
          </button>
        )}
      </div>

      <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" multiple
        onChange={handleSelect} className="hidden" />
      <p className="text-xs text-gray-500">JPEG, PNG, WEBP. Maks 5MB per gambar.</p>
    </div>
  );
}
