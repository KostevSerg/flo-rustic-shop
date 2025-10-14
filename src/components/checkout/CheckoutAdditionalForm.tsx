import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';

interface CheckoutAdditionalFormProps {
  postcard: string;
  comment: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

const CheckoutAdditionalForm = ({ postcard, comment, onChange }: CheckoutAdditionalFormProps) => {
  return (
    <div className="bg-card rounded-lg p-6 space-y-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Icon name="MessageSquare" size={20} className="text-primary" />
        Дополнительно
      </h2>
      <div>
        <label className="block text-sm font-medium mb-1">Текст открытки</label>
        <Textarea
          name="postcard"
          value={postcard}
          onChange={onChange}
          rows={3}
          placeholder="Напишите текст для открытки..."
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Комментарий к заказу</label>
        <Textarea
          name="comment"
          value={comment}
          onChange={onChange}
          rows={3}
          placeholder="Особые пожелания, примечания..."
        />
      </div>
    </div>
  );
};

export default CheckoutAdditionalForm;
