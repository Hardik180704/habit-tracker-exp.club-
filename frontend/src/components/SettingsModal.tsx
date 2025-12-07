import { useState } from 'react';
import { AxiosError } from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, AlertTriangle, Shield, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import api from '../services/api';
import ProfileModal from './ProfileModal';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal = ({ isOpen, onClose }: SettingsModalProps) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Reset state when closing
  const handleClose = () => {
    setDeleteConfirmation('');
    setIsDeleting(false);
    onClose();
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmation !== 'DELETE') {
      toast.error('Please type DELETE to confirm');
      return;
    }

    setIsDeleting(true);
    const toastId = toast.loading('Deleting account...');

    try {
      await api.delete('/auth/delete-account');
      toast.success('Account deleted successfully', { id: toastId });
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Delete account error:', error);
      const err = error as AxiosError<{ error: string }>;
      toast.error(err.response?.data?.error || 'Failed to delete account', { id: toastId });
      setIsDeleting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto z-50 w-full max-w-lg h-fit bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-800"
          >
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User className="w-5 h-5 text-indigo-500" />
                Account Settings
              </h2>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-8">
              {/* Profile Info (Read Only) */}
              <div className="space-y-4">
                <button 
                  onClick={() => setIsProfileOpen(true)}
                  className="flex items-center gap-4 w-full text-left bg-gray-50 dark:bg-gray-800/50 p-3 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-transparent hover:border-indigo-100 dark:hover:border-indigo-900/30 group"
                >
                  <div className="w-16 h-16 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-2xl font-bold group-hover:scale-105 transition-transform">
                    {user?.username?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white capitalize group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {user?.username}
                        </h3>
                        {user?._count && (
                             <div className="flex gap-3 text-xs font-medium text-gray-500">
                                <span>{user._count.followers} Followers</span>
                                <span>{user._count.following} Following</span>
                             </div>
                        )}
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                    <p className="text-xs text-indigo-500 mt-1 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                        View full profile stats &rarr;
                    </p>
                  </div>
                </button>
              </div>

              {/* Danger Zone */}
              <div className="border border-red-200 dark:border-red-900/30 rounded-2xl overflow-hidden">
                 <div className="bg-red-50 dark:bg-red-900/10 p-4 border-b border-red-200 dark:border-red-900/30 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                    <h3 className="font-bold text-red-700 dark:text-red-400">Danger Zone</h3>
                 </div>
                 
                 <div className="p-5 space-y-4">
                    <div>
                       <h4 className="font-bold text-gray-900 dark:text-white text-sm">Delete Account</h4>
                       <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                         Permanently delete your account and all of your content. This action is not reversible.
                       </p>
                    </div>

                    <div className="space-y-3">
                        <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
                           To confirm, type "<strong className="text-gray-900 dark:text-white">DELETE</strong>" below:
                        </label>
                        <input 
                          type="text"
                          value={deleteConfirmation}
                          onChange={(e) => setDeleteConfirmation(e.target.value)}
                          placeholder="DELETE"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-white text-sm transition-colors placeholder:text-gray-400"
                        />
                        
                        <button
                          onClick={handleDeleteAccount}
                          disabled={deleteConfirmation !== 'DELETE' || isDeleting}
                          className={`w-full py-3 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all ${
                             deleteConfirmation === 'DELETE' 
                               ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/20' 
                               : 'bg-gray-100 dark:bg-gray-800 text-gray-400 cursor-not-allowed'
                          }`}
                        >
                           {isDeleting ? (
                             <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                           ) : (
                             <>
                               <Trash2 className="w-4 h-4" />
                               Delete this account
                             </>
                           )}
                        </button>
                    </div>
                 </div>
              </div>
            </div>
            
            {/* Footer */}
            <div className="bg-gray-50 dark:bg-black/20 p-4 text-center text-xs text-gray-400 dark:text-gray-500 border-t border-gray-100 dark:border-gray-800">
                <div className="flex items-center justify-center gap-1.5">
                   <Shield className="w-3 h-3" />
                   Secure Action
                </div>
            </div>
          </motion.div>
        </>
      )}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </AnimatePresence>
  );
};

export default SettingsModal;
