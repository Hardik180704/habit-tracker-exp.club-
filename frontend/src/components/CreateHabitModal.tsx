import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const habitSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  frequency: z.enum(['DAILY', 'WEEKLY']),
  category: z.string().min(1, 'Category is required'),
  color: z.string().default('#4F46E5'),
  icon: z.string().default('📝'),
});

type HabitFormData = z.infer<typeof habitSchema>;

interface CreateHabitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HabitFormData) => Promise<void>;
}

const CreateHabitModal = ({ isOpen, onClose, onSubmit }: CreateHabitModalProps) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<HabitFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(habitSchema) as any,
    defaultValues: {
      frequency: 'DAILY',
      color: '#4F46E5',
    }
  });

  if (!isOpen) return null;

  const onFormSubmit = async (data: HabitFormData) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  const colors = [
    '#4F46E5', // Indigo
    '#EF4444', // Red
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#8B5CF6', // Violet
    '#06B6D4', // Cyan
    '#F97316', // Orange
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-gray-100 dark:border-white/10"
        >
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-white/10">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create New Habit</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onFormSubmit)} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Habit Name</label>
              <input
                {...register('name')}
                placeholder="e.g., Morning Jog"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-white/5 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 border transition-colors outline-none"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name.message}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description (Optional)</label>
              <textarea
                {...register('description')}
                placeholder="What exactly do you want to track?"
                className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-white/5 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 border transition-colors outline-none"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Frequency</label>
                <select
                  {...register('frequency')}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-white/5 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 border transition-colors outline-none"
                >
                  <option value="DAILY" className="dark:bg-gray-800">Daily</option>
                  <option value="WEEKLY" className="dark:bg-gray-800">Weekly</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Category</label>
                <select
                  {...register('category')}
                  className="w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-white/5 dark:text-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 py-2.5 px-3 border transition-colors outline-none"
                >
                  <option value="HEALTH" className="dark:bg-gray-800">Health</option>
                  <option value="FITNESS" className="dark:bg-gray-800">Fitness</option>
                  <option value="PRODUCTIVITY" className="dark:bg-gray-800">Productivity</option>
                  <option value="LEARNING" className="dark:bg-gray-800">Learning</option>
                  <option value="MINDFULNESS" className="dark:bg-gray-800">Mindfulness</option>
                  <option value="NUTRITION" className="dark:bg-gray-800">Nutrition</option>
                  <option value="SOCIAL" className="dark:bg-gray-800">Social</option>
                  <option value="FINANCE" className="dark:bg-gray-800">Finance</option>
                  <option value="CREATIVITY" className="dark:bg-gray-800">Creativity</option>
                  <option value="OTHER" className="dark:bg-gray-800">Other</option>
                </select>
                {errors.category && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.category.message}</p>}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Color Theme</label>
              <div className="flex gap-3 flex-wrap">
                {colors.map((color) => (
                  <label key={color} className="relative cursor-pointer">
                    <input
                      type="radio"
                      value={color}
                      {...register('color')}
                      className="peer sr-only"
                    />
                    <div className="w-8 h-8 rounded-full transition-transform peer-checked:scale-110 peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-indigo-500 dark:peer-checked:ring-offset-gray-800" style={{ backgroundColor: color }} />
                  </label>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 dark:shadow-none transition-all"
              >
                {isSubmitting ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  'Create Habit'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateHabitModal;
