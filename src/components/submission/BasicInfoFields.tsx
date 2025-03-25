
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface BasicInfoFieldsProps {
  title: string;
  setTitle: (value: string) => void;
  description: string;
  setDescription: (value: string) => void;
  username: string;
  setUsername: (value: string) => void;
  isSubmitting: boolean;
  isSuccess: boolean;
}

const BasicInfoFields = ({
  title,
  setTitle,
  description,
  setDescription,
  username,
  setUsername,
  isSubmitting,
  isSuccess
}: BasicInfoFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium flex items-center justify-between">
          <span className="flex items-center">
            Title <span className="text-red-500 ml-1">*</span>
          </span>
          <span className="text-xs text-muted-foreground">{title.length}/100</span>
        </label>
        <Input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., 'Chatbot Thinks I'm a Goldfish'"
          maxLength={100}
          required
          className="w-full"
          disabled={isSubmitting || isSuccess}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="description" className="text-sm font-medium flex items-center justify-between">
          <span>Description (optional)</span>
          <span className="text-xs text-muted-foreground">{description.length}/500</span>
        </label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell us what happened..."
          rows={3}
          maxLength={500}
          className="w-full"
          disabled={isSubmitting || isSuccess}
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium flex items-center justify-between">
          <span>Username (optional)</span>
          <span className="text-xs text-muted-foreground">{username.length}/50</span>
        </label>
        <Input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Anonymous"
          maxLength={50}
          className="w-full"
          disabled={isSubmitting || isSuccess}
        />
      </div>
    </>
  );
};

export default BasicInfoFields;
