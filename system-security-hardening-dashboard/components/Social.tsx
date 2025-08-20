import React from 'react';
import { UsersIcon } from './icons';

// Mock data
const mockFriends = [
    { name: 'Nyx', level: 15, role: 'Hacker', online: true },
    { name: 'Firewall', level: 14, role: 'Cyber Security', online: true },
    { name: 'Glitch', level: 11, role: 'Hacker', online: false },
    { name: 'Proxy', level: 9, role: 'Cyber Security', online: false },
];

const mockLeaderboard = [
    { rank: 1, name: 'Vector', score: 9850 },
    { rank: 2, name: 'Nyx', score: 9500 },
    { rank: 3, name: 'Root', score: 9210 },
    { rank: 4, name: 'Firewall', score: 8900 },
    { rank: 5, name: 'Cipher007', score: 8750 },
];

const Social: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto p-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-100">Social Hub</h1>
        <p className="text-gray-400 mt-1">Connect with allies and rivals.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Friends List */}
        <div className="lg:col-span-1 bg-gray-900 border border-gray-800 rounded-lg p-6">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center"><UsersIcon className="w-6 h-6 mr-2 text-gray-400" />Friends</h2>
            <div className="space-y-4">
                {mockFriends.map(friend => (
                    <div key={friend.name} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${friend.online ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                            <div>
                                <p className="font-semibold text-gray-200">{friend.name}</p>
                                <p className="text-xs text-gray-400">Lvl {friend.level} {friend.role}</p>
                            </div>
                        </div>
                        <button className="text-xs text-purple-400 hover:underline">View</button>
                    </div>
                ))}
            </div>
            <button className="mt-4 w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700">Find Players</button>
        </div>

        {/* Leaderboard */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-lg">
             <div className="p-6 border-b border-gray-800">
                <h2 className="text-xl font-bold text-white">Global Leaderboard</h2>
                <p className="text-sm text-gray-400">Based on overall security & attack score.</p>
             </div>
             <table className="w-full text-left">
                <thead>
                    <tr className="border-b border-gray-800">
                        <th className="p-4 text-sm font-semibold text-gray-400">Rank</th>
                        <th className="p-4 text-sm font-semibold text-gray-400">Player</th>
                        <th className="p-4 text-sm font-semibold text-gray-400 text-right">Score</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {mockLeaderboard.map(player => (
                        <tr key={player.rank} className={`${player.name === 'Cipher007' ? 'bg-purple-500/10' : ''}`}>
                            <td className="p-4 font-bold text-gray-200">{player.rank}</td>
                            <td className="p-4 font-semibold text-gray-300">{player.name}</td>
                            <td className="p-4 font-mono text-purple-400 text-right">{player.score.toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
             </table>
        </div>
      </div>
    </div>
  );
};

export default Social;
