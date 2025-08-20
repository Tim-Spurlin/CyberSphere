import React, { useState, useCallback, useMemo } from 'react';
import { SCAN_CATEGORIES } from './constants';
import type { ScanCategory, Check, CheckStatus, UserProfile } from './types';
import { CheckStatus as CheckStatusEnum, UserRole } from './types';
import Dashboard from './components/Dashboard';
import AttackLab from './components/AttackLab';
import AIHub from './components/AIHub';
import ScanResultModal from './components/ScanResultModal';
import Profile from './components/Profile';
import Map from './components/Map';
import Social from './components/Social';
import { ShieldIcon, BugIcon, CubeTransparentIcon, MapPinIcon, UserCircleIcon, UsersIcon, SparklesIcon } from './components/icons';

const App: React.FC = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'lab' | 'ai' | 'map' | 'profile' | 'social'>('dashboard');
  const [scans, setScans] = useState<ScanCategory[]>(SCAN_CATEGORIES);
  const [selectedCheck, setSelectedCheck] = useState<Check | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile>({
    username: 'Cipher007',
    role: UserRole.CYBER_SEC,
    avatarUrl: 'https://i.pravatar.cc/150?u=cipher007',
    level: 12,
    xp: 450,
    xpToNextLevel: 1000,
  });

  const handleRunScans = useCallback(async (categoryIds: string[]) => {
    setIsScanning(true);
    
    setScans(prevScans =>
      prevScans.map(cat => {
        if (categoryIds.includes(cat.id)) {
          return { ...cat, checks: cat.checks.map(c => ({ ...c, status: CheckStatusEnum.RUNNING, details: undefined })) };
        }
        return cat;
      })
    );

    const runCheck = (categoryId: string, checkId: string): Promise<void> => {
      return new Promise(resolve => {
        setTimeout(() => {
          setScans(prev =>
            prev.map(cat => {
              if (cat.id === categoryId) {
                return {
                  ...cat,
                  checks: cat.checks.map(c => {
                    if (c.id === checkId) {
                      const statuses = [CheckStatusEnum.PASS, CheckStatusEnum.WARN, CheckStatusEnum.FAIL];
                      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
                      return { ...c, status: randomStatus };
                    }
                    return c;
                  }),
                };
              }
              return cat;
            })
          );
          resolve();
        }, 500 + Math.random() * 1000);
      });
    };

    for (const categoryId of categoryIds) {
      const category = scans.find(c => c.id === categoryId);
      if (category) {
        for (const check of category.checks) {
          await runCheck(categoryId, check.id);
        }
      }
    }
    
    setIsScanning(false);
  }, [scans]);
  
  const handleViewCheckDetails = (check: Check) => setSelectedCheck(check);
  const handleCloseModal = () => setSelectedCheck(null);

  const dashboardStats = useMemo(() => {
    const checks = scans.flatMap(cat => cat.checks);
    const pass = checks.filter(c => c.status === CheckStatusEnum.PASS).length;
    const warn = checks.filter(c => c.status === CheckStatusEnum.WARN).length;
    const fail = checks.filter(c => c.status === CheckStatusEnum.FAIL).length;
    const total = checks.length;
    const score = total > 0 ? Math.round(((pass + warn * 0.5) / total) * 100) : 100;
    return { pass, warn, fail, total, score };
  }, [scans]);

  const NavButton: React.FC<{ view: typeof activeView; label: string; icon: React.ReactNode; }> = ({ view, label, icon }) => (
    <button
      onClick={() => setActiveView(view)}
      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors duration-200 w-full text-left ${
        activeView === view
          ? 'bg-purple-600/20 text-purple-400'
          : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );

  const renderContent = () => {
    switch(activeView) {
      case 'dashboard':
        return <Dashboard stats={dashboardStats} scans={scans} onViewDetails={handleViewCheckDetails} userProfile={userProfile} />;
      case 'lab':
        return <AttackLab scans={scans} onRunScans={handleRunScans} onViewDetails={handleViewCheckDetails} isScanning={isScanning} userProfile={userProfile} />;
      case 'ai':
        return <AIHub />;
      case 'map':
        return <Map />;
      case 'profile':
        return <Profile userProfile={userProfile} setUserProfile={setUserProfile} />;
      case 'social':
        return <Social />;
      default:
        return null;
    }
  }

  return (
    <div className="flex h-screen bg-gray-950 font-sans">
      <nav className="w-64 bg-gray-900 border-r border-gray-800 p-4 flex flex-col">
        <div className="flex items-center space-x-3 p-2 mb-6">
          <CubeTransparentIcon className="w-8 h-8 text-purple-500" />
          <h1 className="text-xl font-bold text-gray-100">CyberSphere</h1>
        </div>
        <div className="flex flex-col space-y-2">
          <NavButton view="dashboard" label="Dashboard" icon={<ShieldIcon className="w-6 h-6" />} />
          <NavButton view="lab" label="Attack Lab" icon={<BugIcon className="w-6 h-6" />} />
          <NavButton view="ai" label="AI Hub" icon={<SparklesIcon className="w-6 h-6" />} />
          <NavButton view="map" label="AR Map" icon={<MapPinIcon className="w-6 h-6" />} />
          <NavButton view="profile" label="Profile" icon={<UserCircleIcon className="w-6 h-6" />} />
          <NavButton view="social" label="Social" icon={<UsersIcon className="w-6 h-6" />} />
        </div>
        <div className="mt-auto text-center text-xs text-gray-600">
          <p>v2.1.0 - The Intelligence Update</p>
          <p>The mind is the new battlefield.</p>
        </div>
      </nav>
      
      <main className="flex-1 overflow-y-auto">
        {renderContent()}
      </main>

      {selectedCheck && <ScanResultModal check={selectedCheck} onClose={handleCloseModal} />}
    </div>
  );
};

export default App;
