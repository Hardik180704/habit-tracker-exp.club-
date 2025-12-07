import React, { useState } from 'react';
import { UserPlus, UserCheck, Loader2, User } from 'lucide-react';
import { motion } from 'framer-motion';
import type { SocialUser } from '../types';
import toast from 'react-hot-toast';

interface UserCardProps {
  user: SocialUser;
  onFollow: (id: number) => Promise<void>;
  onUnfollow: (id: number) => Promise<void>;
}

const UserCard = ({ user, onFollow, onUnfollow }: UserCardProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isFollowing, setIsFollowing] = useState(user.isFollowing);

  const handleAction = async () => {
    setIsLoading(true);
    try {
      if (isFollowing) {
        await onUnfollow(user.id);
        setIsFollowing(false);
        toast.success(`Unfollowed ${user.username}`);
      } else {
        await onFollow(user.id);
        setIsFollowing(true);
        toast.success(`Following ${user.username}`);
      }
    } catch (error) {
      toast.error('Action failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-indigo-50 rounded-full flex items-center justify-center text-indigo-600">
          <User className="w-5 h-5" />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">{user.username}</h3>
          <p className="text-xs text-gray-500">Habit Tracker User</p>
        </div>
      </div>

      <button
        onClick={handleAction}
        disabled={isLoading}
        className={`flex items-center px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          isFollowing
            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm shadow-indigo-200'
        }`}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : isFollowing ? (
          <>
            <UserCheck className="w-4 h-4 mr-1.5" />
            Following
          </>
        ) : (
          <>
            <UserPlus className="w-4 h-4 mr-1.5" />
            Follow
          </>
        )}
      </button>
    </motion.div>
  );
};

export default UserCard;
