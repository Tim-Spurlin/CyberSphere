import React from 'react';
import type { ScanCategory, Check, UserProfile } from '../types';
import { CheckStatus, UserRole } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, FireIcon, ShieldCheckIcon, ArrowTrendingUpIcon } from './icons';
import { ScoreTrendChart } from './charts';

interface DashboardProps {
  stats: {
    pass: number;
    warn: number;
    fail: number;
    total: number;
    score: number;
  };
  scans: ScanCategory[];
  onViewDetails: (check: Check) => void;
  userProfile: UserProfile;
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-400';
  if (score >= 70) return 'text-yellow-400';
  return 'text-red-400';
};

const RoleIcon: React.FC<{role: UserRole}> = ({ role }) => {
  if (role === UserRole.HACKER) {
    return <FireIcon className="w-5 h-5 text-red-400" />;
  }
  return <ShieldCheckIcon className="w-5 h-5 text-purple-400" />;
}

const Dashboard: React.FC<DashboardProps> = ({ stats, scans, userProfile }) => {
  const recentIssues = scans.flatMap(cat => cat.checks.filter(c => c.status === CheckStatus.FAIL || c.status === CheckStatus.WARN)).slice(0, 5);

  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Welcome back, {userProfile.username}</h1>
        <p className="text-gray-400 mt-1">Your command center for all cyber operations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Profile & Score */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
            <div className="flex items-center space-x-4">
              <img src={userProfile.avatarUrl} alt="User Avatar" className="w-16 h-16 rounded-full border-2 border-gray-700" />
              <div>
                <h3 className="text-xl font-bold text-white">{userProfile.username}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <RoleIcon role={userProfile.role} />
                  <span>{userProfile.role}</span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-purple-400">Level {userProfile.level}</span>
                <span className="text-xs text-gray-500">{userProfile.xp} / {userProfile.xpToNextLevel} XP</span>
              </div>
              <div className="w-full bg-gray-800 rounded-full h-2.5">
                <div className="bg-purple-600 h-2.5 rounded-full" style={{ width: `${(userProfile.xp / userProfile.xpToNextLevel) * 100}%` }}></div>
              </div>
            </div>
          </div>
          <div className="bg-gray-900 p-6 rounded-lg flex flex-col items-center justify-center border border-gray-800">
            <h3 className="text-lg font-medium text-gray-300 mb-2">Overall Security Score</h3>
            <div className={`text-6xl font-bold ${getScoreColor(stats.score)}`}>{stats.score}</div>
            <div className="w-full bg-gray-800 rounded-full h-2.5 mt-4">
                <div className={`${getScoreColor(stats.score).replace('text-', 'bg-')} h-2.5 rounded-full`} style={{ width: `${stats.score}%` }}></div>
            </div>
          </div>
        </div>

        {/* Right Column: Widgets */}
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-3 gap-6">
               <div className="bg-gray-900 p-4 rounded-lg flex items-center space-x-4 border border-gray-800">
                  <div className="p-2 rounded-full bg-gray-800 text-green-400"><CheckCircleIcon className="w-6 h-6"/></div>
                  <div><p className="text-2xl font-bold">{stats.pass}</p><p className="text-sm text-gray-400">Passed</p></div>
              </div>
              <div className="bg-gray-900 p-4 rounded-lg flex items-center space-x-4 border border-gray-800">
                  <div className="p-2 rounded-full bg-gray-800 text-yellow-400"><ExclamationTriangleIcon className="w-6 h-6"/></div>
                  <div><p className="text-2xl font-bold">{stats.warn}</p><p className="text-sm text-gray-400">Warnings</p></div>
              </div>
               <div className="bg-gray-900 p-4 rounded-lg flex items-center space-x-4 border border-gray-800">
                  <div className="p-2 rounded-full bg-gray-800 text-red-400"><XCircleIcon className="w-6 h-6"/></div>
                  <div><p className="text-2xl font-bold">{stats.fail}</p><p className="text-sm text-gray-400">Failures</p></div>
              </div>
            </div>
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center"><ArrowTrendingUpIcon className="w-5 h-5 mr-2 text-gray-400" />Score Trend</h3>
                <div className="h-48">
                  <ScoreTrendChart />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
