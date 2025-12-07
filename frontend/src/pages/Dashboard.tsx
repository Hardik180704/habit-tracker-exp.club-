import React, { useEffect, useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // Placeholder for fetching dashboard data
    const fetchDashboard = async () => {
      // For now just show a welcome message
    };
    fetchDashboard();
  }, []);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold leading-tight text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Track your daily habits and progress.
        </p>
      </header>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Your Habits
        </h3>
        <div className="mt-4 border-t border-gray-200 pt-4">
          <p className="text-gray-500">
            Habit list will appear here in Phase 7.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
