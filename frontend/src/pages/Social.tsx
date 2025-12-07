import { useState, useEffect } from 'react';
import * as Tabs from '@radix-ui/react-tabs';
import { motion } from 'framer-motion';
import { Search, Users, Activity } from 'lucide-react';
import api from '../services/api';
import UserCard from '../components/UserCard';
import FeedItem from '../components/FeedItem';
import type { SocialUser, FeedItem as FeedItemType } from '../types';
import toast from 'react-hot-toast';

// Inline simple debounce for now or use timeout
const Social = () => {
  const [activeTab, setActiveTab] = useState('feed');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SocialUser[]>([]);
  const [feed, setFeed] = useState<FeedItemType[]>([]);
  const [loading, setLoading] = useState(false);

  // Feed fetching with polling
  useEffect(() => {
    let intervalId: ReturnType<typeof setInterval>;

    if (activeTab === 'feed') {
      // Initial load with spinner
      fetchFeed(false);
      
      // Poll every 5 seconds silently
      intervalId = setInterval(() => {
        fetchFeed(true);
      }, 5000);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeTab]);

  const fetchFeed = async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await api.get('/social/feed');
      // Simple optimization: only update if length changed or ID changed to avoid unnecessary re-renders
      // But for now, just setting it is fine as React handles diffing well
      setFeed(res.data.feed);
    } catch (error) {
      console.error('Feed error', error);
      if (!silent) toast.error('Failed to load feed');
    } finally {
      if (!silent) setLoading(false);
    }
  };

  // Search logic
  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        setLoading(true);
        try {
          const res = await api.get(`/social/search?query=${searchQuery}`);
          setSearchResults(res.data.users);
        } catch (error) {
          console.error('Search error', error);
        } finally {
          setLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleFollow = async (id: number) => {
    await api.post(`/social/follow/${id}`);
    updateUserFollowState(id, true);
  };

  const handleUnfollow = async (id: number) => {
    await api.delete(`/social/follow/${id}`);
    updateUserFollowState(id, false);
  };

  const updateUserFollowState = (id: number, isFollowing: boolean) => {
    setSearchResults(prev => prev.map(u => 
      u.id === id ? { ...u, isFollowing } : u
    ));
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-gray-50 dark:bg-neutral-950 transition-colors"
    >

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs.Root value={activeTab} onValueChange={setActiveTab} className="mb-8">
          <Tabs.List className="flex p-1 bg-white dark:bg-neutral-900 rounded-xl border border-gray-100 dark:border-white/5 mb-6 shadow-sm">
            <Tabs.Trigger 
              value="feed"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-500/10 dark:data-[state=active]:text-indigo-400 data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <Activity className="w-4 h-4" />
              Activity Feed
            </Tabs.Trigger>
            <Tabs.Trigger 
              value="community"
              className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all data-[state=active]:bg-indigo-50 data-[state=active]:text-indigo-700 dark:data-[state=active]:bg-indigo-500/10 dark:data-[state=active]:text-indigo-400 data-[state=inactive]:text-gray-500 dark:data-[state=inactive]:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
            >
              <Users className="w-4 h-4" />
              Find Friends
            </Tabs.Trigger>
          </Tabs.List>

          <Tabs.Content value="feed" className="outline-none">
            {loading && feed.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-24 bg-white dark:bg-neutral-900 rounded-xl animate-pulse" />
                ))}
              </div>
            ) : feed.length > 0 ? (
              <div className="space-y-4">
                {feed.map(item => (
                  <FeedItem key={item.id} item={item} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white dark:bg-neutral-900 rounded-2xl border border-gray-100/50 dark:border-white/5">
                <div className="w-16 h-16 bg-gray-50 dark:bg-neutral-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">No activity yet</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">Follow people to see their progress here!</p>
              </div>
            )}
          </Tabs.Content>

          <Tabs.Content value="community" className="outline-none">
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all shadow-sm text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-600"
              />
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
            </div>

            <div className="space-y-3">
              {searchResults.length > 0 ? (
                searchResults.map(user => (
                  <UserCard
                    key={user.id}
                    user={user}
                    onFollow={handleFollow}
                    onUnfollow={handleUnfollow}
                  />
                ))
              ) : searchQuery.length >= 2 && !loading ? (
                <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                  No users found matching "{searchQuery}"
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 dark:text-gray-600">
                  {loading ? 'Searching...' : 'Type to search for friends'}
                </div>
              )}
            </div>
          </Tabs.Content>
        </Tabs.Root>
      </main>
    </motion.div>
  );
};

export default Social;
