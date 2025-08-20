import React, { useState } from 'react';
import type { ScanCategory, Check, UserProfile } from '../types';
import { CheckStatus } from '../types';
import { CheckCircleIcon, ExclamationTriangleIcon, XCircleIcon, ClockIcon, PlayIcon, SpinnerIcon } from './icons';
import PvpLobby from './PvpLobby';

interface AttackLabProps {
  scans: ScanCategory[];
  onRunScans: (categoryIds: string[]) => void;
  onViewDetails: (check: Check) => void;
  isScanning: boolean;
  userProfile: UserProfile;
}

const CheckStatusIndicator: React.FC<{ status: CheckStatus }> = ({ status }) => {
  switch (status) {
    case CheckStatus.PASS: return <CheckCircleIcon className="w-5 h-5 text-green-400" />;
    case CheckStatus.WARN: return <ExclamationTriangleIcon className="w-5 h-5 text-yellow-400" />;
    case CheckStatus.FAIL: return <XCircleIcon className="w-5 h-5 text-red-400" />;
    case CheckStatus.PENDING: return <ClockIcon className="w-5 h-5 text-gray-500" />;
    case CheckStatus.RUNNING: return <SpinnerIcon className="w-5 h-5 text-purple-400 animate-spin" />;
    default: return null;
  }
};

const AttackLab: React.FC<AttackLabProps> = ({ scans, onRunScans, onViewDetails, isScanning, userProfile }) => {
  const [activeTab, setActiveTab] = useState<'local' | 'pvp'>('local');
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set(scans.map(s => s.id)));

  const handleToggleCategory = (categoryId: string) => {
    setSelectedCategories(prev => {
      const newSet = new Set(prev);
      newSet.has(categoryId) ? newSet.delete(categoryId) : newSet.add(categoryId);
      return newSet;
    });
  };

  const handleRunClick = () => {
    if(!isScanning && selectedCategories.size > 0) {
      onRunScans(Array.from(selectedCategories));
    }
  };

  const TabButton: React.FC<{tab: 'local' | 'pvp', label: string}> = ({ tab, label }) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`px-4 py-2 text-sm font-semibold rounded-md transition-colors ${
        activeTab === tab ? 'bg-purple-600 text-white' : 'text-gray-400 hover:bg-gray-800'
      }`}
    >
      {label}
    </button>
  );

  return (
    <div className="space-y-6 h-full flex flex-col p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Attack Lab</h1>
        <p className="text-gray-400 mt-1">Hone your skills. Run local scans or engage in PVP simulations.</p>
      </div>

      <div className="flex space-x-2 border-b border-gray-800">
        <TabButton tab="local" label="Local System Scan" />
        <TabButton tab="pvp" label="PVP Arena" />
      </div>

      <div className="flex-grow min-h-0">
        {activeTab === 'local' && (
          <div className="space-y-6 animate-fade-in h-full overflow-y-auto pr-2">
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-bold text-gray-100">Scan Configuration</h2>
                <button onClick={handleRunClick} disabled={isScanning || selectedCategories.size === 0} className="flex items-center justify-center px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors">
                  {isScanning ? <><SpinnerIcon className="w-5 h-5 mr-2 animate-spin" />Scanning...</> : <><PlayIcon className="w-5 h-5 mr-2" />Run Scans</>}
                </button>
              </div>
            </div>
            {scans.map((category) => (
              <div key={category.id} className="bg-gray-900 rounded-lg border border-gray-800">
                <div className="p-4 flex items-center space-x-4 border-b border-gray-800">
                  <input type="checkbox" checked={selectedCategories.has(category.id)} onChange={() => handleToggleCategory(category.id)} className="h-5 w-5 rounded bg-gray-800 border-gray-700 text-purple-500 focus:ring-purple-600" />
                  <div>
                      <h3 className="text-lg font-bold text-gray-100">{category.title}</h3>
                      <p className="text-sm text-gray-400">{category.description}</p>
                  </div>
                </div>
                <ul className="divide-y divide-gray-800">
                  {category.checks.map((check) => (
                    <li key={check.id} onClick={() => onViewDetails(check)} className="p-4 flex justify-between items-center hover:bg-gray-800/50 cursor-pointer transition-colors">
                      <div className="flex items-center space-x-4"><CheckStatusIndicator status={check.status} /><span className="font-medium text-gray-300">{check.title}</span></div>
                      <span className="text-sm text-gray-500">{check.status}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'pvp' && (
          <div className="animate-fade-in h-full">
            <PvpLobby userProfile={userProfile} />
          </div>
        )}
      </div>
    </div>
  );
};

export default AttackLab;
