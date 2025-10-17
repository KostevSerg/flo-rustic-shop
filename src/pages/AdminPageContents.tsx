import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdminAuth from '@/components/AdminAuth';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import Icon from '@/components/ui/icon';
import { useCart } from '@/contexts/CartContext';
import API_ENDPOINTS from '@/config/api';

interface PageContent {
  id: number;
  page_key: string;
  title: string;
  content: string;
  updated_at: string;
}

const PAGE_TEMPLATES = [
  { key: 'about', name: 'О нас' },
  { key: 'delivery', name: 'Доставка' },
  { key: 'guarantees', name: 'Гарантии' }
];

const AdminPageContents = () => {
  const { totalItems } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageContent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  const [editorContent, setEditorContent] = useState('');
  const [editorTitle, setEditorTitle] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const quillRef = useRef<ReactQuill>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadPages = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_ENDPOINTS.pageContents}?list=true`);
      const data = await response.json();
      setPages(data.pages || []);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить страницы',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Ошибка',
        description: 'Пожалуйста, выберите изображение',
        variant: 'destructive'
      });
      return;
    }

    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const base64Image = e.target?.result as string;

        const response = await fetch(API_ENDPOINTS.uploadImage, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            image: base64Image,
            filename: file.name
          })
        });

        if (!response.ok) throw new Error('Upload failed');

        const data = await response.json();
        
        const quill = quillRef.current?.getEditor();
        if (quill) {
          const range = quill.getSelection();
          const position = range ? range.index : quill.getLength();
          quill.insertEmbed(position, 'image', data.url);
          quill.setSelection(position + 1, 0);
        }

        toast({
          title: 'Успешно',
          description: 'Изображение загружено'
        });
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось загрузить изображение',
        variant: 'destructive'
      });
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const startEdit = (page: PageContent) => {
    setEditingPage(page);
    setEditorTitle(page.title);
    setEditorContent(page.content);
  };

  const cancelEdit = () => {
    setEditingPage(null);
    setEditorTitle('');
    setEditorContent('');
  };

  const handleSave = async () => {
    if (!editingPage) return;

    setSaving(true);
    try {
      const response = await fetch(API_ENDPOINTS.pageContents, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_key: editingPage.page_key,
          title: editorTitle,
          content: editorContent
        })
      });

      if (!response.ok) throw new Error('Failed to update page');

      toast({
        title: 'Успешно',
        description: 'Страница обновлена'
      });

      cancelEdit();
      loadPages();
    } catch (error) {
      toast({
        title: 'Ошибка',
        description: 'Не удалось обновить страницу',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadPages();
  }, []);

  const modules = {
    toolbar: {
      container: [
        [{ 'header': [1, 2, 3, false] }],
        ['bold', 'italic', 'underline', 'strike'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        [{ 'color': [] }, { 'background': [] }],
        ['link'],
        ['clean']
      ]
    }
  };

  return (
    <AdminAuth>
      <div className="min-h-screen flex flex-col">
        <Header cartCount={totalItems} />
        <main className="flex-1 container mx-auto px-4 py-16">
          <div className="max-w-6xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h1 className="text-4xl font-bold mb-2">Управление страницами</h1>
                <p className="text-muted-foreground">
                  Редактируйте содержимое статических страниц сайта
                </p>
              </div>
              <Button
                variant="outline"
                onClick={() => navigate('/admin/dashboard')}
              >
                <Icon name="LayoutDashboard" size={18} className="mr-2" />
                Админ-панель
              </Button>
            </div>

            {editingPage ? (
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">
                    Редактирование: {PAGE_TEMPLATES.find(t => t.key === editingPage.page_key)?.name}
                  </h2>
                  <Button
                    variant="ghost"
                    onClick={cancelEdit}
                  >
                    <Icon name="X" size={18} />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Заголовок страницы
                    </label>
                    <input
                      type="text"
                      value={editorTitle}
                      onChange={(e) => setEditorTitle(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-2 focus:ring-primary"
                      placeholder="Введите заголовок"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <label className="block text-sm font-medium">
                        Содержимое страницы
                      </label>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleImageUpload}
                        disabled={uploading}
                      >
                        <Icon name="Image" size={16} className="mr-2" />
                        {uploading ? 'Загрузка...' : 'Добавить изображение'}
                      </Button>
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="border border-border rounded-lg overflow-hidden">
                      <ReactQuill
                        ref={quillRef}
                        theme="snow"
                        value={editorContent}
                        onChange={setEditorContent}
                        modules={modules}
                        className="bg-background"
                        style={{ minHeight: '400px' }}
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      onClick={handleSave}
                      disabled={saving}
                    >
                      <Icon name="Save" size={18} className="mr-2" />
                      {saving ? 'Сохранение...' : 'Сохранить'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowPreview(!showPreview)}
                      disabled={saving}
                    >
                      <Icon name="Eye" size={18} className="mr-2" />
                      {showPreview ? 'Скрыть предпросмотр' : 'Предпросмотр'}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={cancelEdit}
                      disabled={saving}
                    >
                      Отмена
                    </Button>
                  </div>

                  {showPreview && (
                    <div className="mt-6 p-6 border border-border rounded-lg bg-background">
                      <h3 className="text-xl font-bold mb-4 text-muted-foreground">Предпросмотр:</h3>
                      <div className="prose prose-lg max-w-none">
                        <h1 className="text-4xl font-bold mb-6">{editorTitle}</h1>
                        <div dangerouslySetInnerHTML={{ __html: editorContent }} />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {loading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin mx-auto mb-3 w-12 h-12 border-4 border-primary border-t-transparent rounded-full"></div>
                    <p className="text-muted-foreground">Загрузка...</p>
                  </div>
                ) : (
                  <>
                    {PAGE_TEMPLATES.map(template => {
                      const page = pages.find(p => p.page_key === template.key);
                      
                      return (
                        <div
                          key={template.key}
                          className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="text-xl font-bold mb-2">{template.name}</h3>
                              <p className="text-muted-foreground text-sm mb-3">
                                Ключ: {template.key}
                              </p>
                              {page && (
                                <>
                                  <p className="text-sm mb-2">
                                    <span className="font-medium">Заголовок:</span> {page.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Последнее обновление: {new Date(page.updated_at).toLocaleString('ru-RU')}
                                  </p>
                                </>
                              )}
                              {!page && (
                                <p className="text-sm text-muted-foreground">
                                  Страница еще не создана
                                </p>
                              )}
                            </div>
                            <Button
                              onClick={() => page && startEdit(page)}
                              disabled={!page}
                            >
                              <Icon name="Pencil" size={18} className="mr-2" />
                              Редактировать
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            )}
          </div>
        </main>
        <Footer />
      </div>
    </AdminAuth>
  );
};

export default AdminPageContents;