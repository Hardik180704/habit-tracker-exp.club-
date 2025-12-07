import React, { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import UserCard from './UserCard';
import type { SocialUser } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ProfileModal = ({ isOpen, onClose }: ProfileModalProps) => {
  const { user, fetchUser } = useAuth();
  const [activeTab, setActiveTab] = useState('followers');
  const [users, setUsers] = useState<SocialUser[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchUser(); // Refresh stats when opening
      loadList(activeTab);
    }
  }, [isOpen, activeTab]);

  const loadList = async (type: string) => {
    setLoading(true);
    try {
      const res = await api.get(`/social/${type}`);
      setUsers(res.data.users);
    } catch (error) {
      console.error(`Failed to fetch ${type}`, error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async (id: number) => {
    await api.post(`/social/follow/${id}`);
    updateListState(id, true);
    fetchUser(); // Update stats
  };

  const handleUnfollow = async (id: number) => {
    await api.delete(`/social/follow/${id}`);
    updateListState(id, false);
    fetchUser(); // Update stats
  };

  const updateListState = (id: number, isFollowing: boolean) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, isFollowing } : u
    ));
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
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
          className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh]"
        >
          {/* Header */}
          <div className="bg-white border-b border-gray-100 p-6 pb-0">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-2xl">
                  {user?.username?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{user?.username}</h2>
                  <p className="text-gray-500">{user?.email}</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-8 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {user?._count?.followers || 0}
                </div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {user?._count?.following || 0}
                </div>
                <div className="text-xs font-medium text-gray-500 uppercase tracking-wide">Following</div>
              </div>
            </div>

            <Tabs.Root value={activeTab} onValueChange={setActiveTab}>
              <Tabs.List className="flex border-b border-gray-100">
                <Tabs.Trigger
                  value="followers"
                  className="flex-1 pb-3 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700"
                >
                  Followers
                </Tabs.Trigger>
                <Tabs.Trigger
                  value="following"
                  className="flex-1 pb-3 text-sm font-medium border-b-2 transition-colors data-[state=active]:border-indigo-600 data-[state=active]:text-indigo-600 data-[state=inactive]:border-transparent data-[state=inactive]:text-gray-500 hover:text-gray-700"
                >
                  Following
                </Tabs.Trigger>
              </Tabs.List>
            </Tabs.Root>
          </div>

          {/* List Content */}
          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-white rounded-xl animate-pulse" />
                ))}
              </div>
            ) : users.length > 0 ? (
              <div className="space-y-3">
                {users.map(u => (
                  <UserCard
                    key={u.id}
                    user={u}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                No users found
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProfileModal;
