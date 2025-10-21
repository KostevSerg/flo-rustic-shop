import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

interface ImageUploadProps {
  currentImage?: string;
  onImageChange: (imageUrl: string) => void;
  label?: string;
}

const ImageUpload = ({ currentImage, onImageChange, label = 'Изображение товара' }: ImageUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Пожалуйста, выберите изображение');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Размер файла не должен превышать 5 МБ');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const reader = new FileReader();
      
      reader.onload = async (event) => {
        const base64String = event.target?.result as string;
        
        try {
          const response = await fetch('https://functions.poehali.dev/1a6c3d40-9259-4124-95d8-03422b03f786', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              image: base64String,
              filename: file.name
            })
          });

          if (!response.ok) {
            throw new Error('Ошибка загрузки на сервер');
          }

          const data = await response.json();
          onImageChange(data.url);
          setUploading(false);
        } catch (uploadError) {
          console.error('Upload to S3 error:', uploadError);
          setError('Не удалось загрузить изображение на сервер');
          setUploading(false);
        }
      };

      reader.onerror = () => {
        setError('Не удалось прочитать файл');
        setUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Upload error:', err);
      setError('Не удалось загрузить изображение');
      setUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium">{label}</label>
      
      {currentImage && (
        <div className="relative w-full h-48 rounded-lg overflow-hidden border border-border">
          <img
            src={currentImage}
            alt="Preview"
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600';
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={() => onImageChange('')}
          >
            <Icon name="Trash2" size={16} className="mr-1" />
            Удалить
          </Button>
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <Button
          type="button"
          variant="outline"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex-1"
        >
          {uploading ? (
            <>
              <div className="animate-spin mr-2 w-4 h-4 border-2 border-primary border-t-transparent rounded-full" />
              Загрузка...
            </>
          ) : (
            <>
              <Icon name="Upload" size={16} className="mr-2" />
              {currentImage ? 'Заменить изображение' : 'Загрузить изображение'}
            </>
          )}
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive flex items-center gap-1">
          <Icon name="AlertCircle" size={14} />
          {error}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Форматы: JPG, PNG, GIF. Максимальный размер: 5 МБ
      </p>
    </div>
  );
};

export default ImageUpload;