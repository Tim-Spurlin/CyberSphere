import React, { useState, useEffect, useRef } from 'react';
import type { UserProfile, PvpMatch, PvpPlayer, PvpAction, PvpActionId } from '../types';
import { UserRole } from '../types';
import { HACKER_PAYLOADS, CYBER_SEC_COUNTERMEASURES } from '../constants';
import * as pvpService from '../services/pvpService';
import { TerminalIcon, ServerIcon, FireIcon, ShieldCheckIcon, CrosshairsIcon, BoltIcon } from './icons';

interface PvpBattleProps {
  initialMatch: PvpMatch;
  currentUser: UserProfile;
  onMatchEnd: (finalMatchState: PvpMatch) => void;
}

const PlayerUI: React.FC<{ player: PvpPlayer }> = ({ player }) => (
    <div className="bg-gray-900 p-4 rounded-lg border border-gray-800">
        <div className="flex items-center space-x-3">
            <img src={player.profile.avatarUrl} alt={player.profile.username} className="w-12 h-12 rounded-full" />
            <div>
                <h3 className="font-bold text-white">{player.profile.username}</h3>
                <p className="text-sm text-gray-400">{player.profile.role}</p>
            </div>
        </div>
        <div className="mt-4 space-y-2">
            <div>
                <span className="text-xs font-medium text-red-400">System Integrity</span>
                <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${player.systemIntegrity}%` }}></div>
                </div>
            </div>
            <div>
                <span className="text-xs font-medium text-purple-400">Energy</span>
                 <div className="w-full bg-gray-800 rounded-full h-2.5">
                    <div className="bg-purple-500 h-2.5 rounded-full" style={{ width: `${(player.energy / player.maxEnergy) * 100}%` }}></div>
                </div>
            </div>
        </div>
    </div>
);

const ActionButton: React.FC<{ action: PvpAction; onAction: (id: PvpActionId) => void; disabled: boolean; energy: number }> = ({ action, onAction, disabled, energy }) => {
    const canAfford = energy >= action.cost;
    const isDisabled = disabled || !canAfford;

    return (
        <button
            onClick={() => onAction(action.id)}
            disabled={isDisabled}
            className={`w-full text-left p-3 rounded-lg border-2 transition-all ${isDisabled ? 'bg-gray-800/50 border-gray-700 text-gray-500 cursor-not-allowed' : 'bg-gray-800 border-gray-700 hover:bg-gray-700 hover:border-purple-500'}`}
        >
            <div className="flex justify-between items-center font-bold">
                <span>{action.name}</span>
                <span className="flex items-center"><BoltIcon className="w-4 h-4 mr-1 text-purple-400"/>{action.cost}</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">{action.description}</p>
        </button>
    );
};


const PvpBattle: React.FC<PvpBattleProps> = ({ initialMatch, currentUser, onMatchEnd }) => {
  const [match, setMatch] = useState<PvpMatch>(initialMatch);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const logContainerRef = useRef<HTMLDivElement>(null);

  const me = match.players.find(p => p.profile.username === currentUser.username)!;
  const opponent = match.players.find(p => p.profile.username !== currentUser.username)!;
  const myTurn = match.currentTurn === currentUser.username;

  useEffect(() => {
    const unsubscribe = pvpService.getMatchStream(match.id, (updatedMatch) => {
        setMatch(updatedMatch);
        setIsSubmitting(false); // Re-enable actions on new turn
        if (updatedMatch.status === 'finished') {
            setTimeout(() => onMatchEnd(updatedMatch), 2000);
        }
    });

    return () => unsubscribe();
  }, [match.id, onMatchEnd]);

  useEffect(() => {
    if (logContainerRef.current) {
        logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [match.log]);

  const handleAction = async (actionId: PvpActionId) => {
    if (!myTurn || isSubmitting) return;
    setIsSubmitting(true);
    await pvpService.submitAction(match.id, me.profile.username, actionId);
  };
  
  const availableActions = me.profile.role === UserRole.HACKER ? HACKER_PAYLOADS : CYBER_SEC_COUNTERMEASURES;

  return (
    <div className="w-full h-full flex flex-col space-y-4 animate-fade-in">
        <div className="grid grid-cols-2 gap-4">
            <PlayerUI player={me} />
            <PlayerUI player={opponent} />
        </div>
        <div className="flex-grow grid grid-cols-3 gap-4 min-h-0">
            {/* Action Panel */}
            <div className="col-span-1 bg-gray-900/50 p-4 rounded-lg border border-gray-800 flex flex-col">
                <h3 className="text-lg font-bold text-white mb-2 flex items-center">
                    {me.profile.role === UserRole.HACKER ? <FireIcon className="w-5 h-5 mr-2 text-red-400"/> : <ShieldCheckIcon className="w-5 h-5 mr-2 text-purple-400" />}
                    Available Actions
                </h3>
                <p className="text-sm text-gray-500 mb-4">{myTurn ? "Your turn. Choose an action." : "Waiting for opponent..."}</p>
                <div className="space-y-3 overflow-y-auto pr-2">
                    {availableActions.map(action => (
                        <ActionButton key={action.id} action={action} onAction={handleAction} disabled={!myTurn || isSubmitting} energy={me.energy} />
                    ))}
                </div>
            </div>
            {/* Log Panel */}
            <div className="col-span-2 bg-black/50 p-4 rounded-lg border border-gray-800 flex flex-col font-mono text-sm">
                <h3 className="text-lg font-bold text-gray-300 mb-4 flex items-center"><TerminalIcon className="w-5 h-5 mr-2" />Combat Log</h3>
                <div ref={logContainerRef} className="flex-grow overflow-y-auto pr-2 space-y-2 text-gray-400">
                    {match.log.map(entry => (
                        <p key={entry.id}><span className="text-gray-600 mr-2">{`[T-${entry.turn}]`}</span>{entry.text}</p>
                    ))}
                    {myTurn && match.status === 'active' && <div className="text-green-400 animate-pulse">&gt; Awaiting your command...</div>}
                </div>
            </div>
        </div>
    </div>
  );
};

export default PvpBattle;
