import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2 } from 'lucide-react';
import type { FeedItem as FeedItemType } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface FeedItemProps {
  item: FeedItemType;
}

const FeedItem = ({ item }: FeedItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex gap-4 p-4 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-white/5 shadow-sm relative overflow-hidden transition-colors"
    >
      {/* Timeline connector line (visual only) */}
      <div className="absolute left-[27px] top-12 bottom-0 w-0.5 bg-gray-100 dark:bg-white/5 -z-0" />

      <div className="relative z-10 shrink-0">
        <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center text-green-600 dark:text-green-400 ring-4 ring-white dark:ring-neutral-900">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-gray-900 dark:text-gray-200">
              <span className="font-bold text-indigo-900 dark:text-indigo-400">{item.user.username}</span> completed a habit!
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-0.5">
              {formatDistanceToNow(new Date(item.completedAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        <div 
          className="mt-3 p-3 rounded-lg border border-gray-100 dark:border-white/10 flex items-center gap-3 bg-gray-50/50 dark:bg-black/20"
        >
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white shadow-sm shrink-0"
            style={{ backgroundColor: item.habit.color || '#4F46E5' }}
          >
            <span className="text-xl">{item.habit.icon || '📝'}</span>
          </div>
          <div className="min-w-0">
            <h4 className="font-semibold text-gray-900 dark:text-white text-sm truncate">{item.habit.name}</h4>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-gray-100 dark:bg-white/10 text-gray-800 dark:text-gray-300 capitalize mt-1">
              {item.habit.category?.toLowerCase()}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default FeedItem;
