import React, { useState, useEffect, useCallback } from 'react';
import type { UserProfile, PvpMatch } from '../types';
import { PvpGameStage } from '../types';
import * as pvpService from '../services/pvpService';
import PvpBattle from './PvpBattle';
import { SwordsIcon, SpinnerIcon } from './icons';

interface PvpLobbyProps {
  userProfile: UserProfile;
}

const PvpLobby: React.FC<PvpLobbyProps> = ({ userProfile }) => {
  const [stage, setStage] = useState<PvpGameStage>(PvpGameStage.LOBBY);
  const [match, setMatch] = useState<PvpMatch | null>(null);

  useEffect(() => {
    // Cleanup function to leave matchmaking if the component unmounts
    return () => {
      if (stage === PvpGameStage.SEARCHING) {
        pvpService.cancelMatchmaking();
      }
    };
  }, [stage]);
  
  const handleFindMatch = useCallback(async () => {
    setStage(PvpGameStage.SEARCHING);
    try {
      const newMatch = await pvpService.findMatch(userProfile);
      setMatch(newMatch);
      setStage(PvpGameStage.IN_PROGRESS);
    } catch (error) {
      console.error("Matchmaking failed:", error);
      setStage(PvpGameStage.LOBBY); // Reset on failure
    }
  }, [userProfile]);

  const handleCancelSearch = () => {
    pvpService.cancelMatchmaking();
    setStage(PvpGameStage.LOBBY);
  };
  
  const handleMatchEnd = (finalMatchState: PvpMatch) => {
    setMatch(finalMatchState);
    setStage(PvpGameStage.RESULTS);
  }

  const handleReturnToLobby = () => {
      setMatch(null);
      setStage(PvpGameStage.LOBBY);
  }

  const renderContent = () => {
    switch (stage) {
      case PvpGameStage.SEARCHING:
        return (
          <div className="text-center">
            <SpinnerIcon className="w-16 h-16 text-purple-500 mx-auto animate-spin mb-6" />
            <h2 className="text-3xl font-bold text-white">Searching for Opponent...</h2>
            <p className="text-gray-400 mt-2">Connecting to the global network.</p>
            <button
                onClick={handleCancelSearch}
                className="mt-6 px-6 py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors"
            >
                Cancel
            </button>
          </div>
        );
      
      case PvpGameStage.IN_PROGRESS:
        if (match) {
            return <PvpBattle initialMatch={match} currentUser={userProfile} onMatchEnd={handleMatchEnd} />;
        }
        return null; // Should not happen

      case PvpGameStage.RESULTS:
        const winner = match?.winner;
        const isVictor = winner === userProfile.username;
        return (
            <div className="text-center">
                <h2 className={`text-5xl font-bold mb-4 ${isVictor ? 'text-green-400' : 'text-red-400'}`}>
                    {isVictor ? 'VICTORY' : 'DEFEAT'}
                </h2>
                <p className="text-gray-300 text-lg mb-8">
                    {winner ? `${winner} has won the engagement.` : 'The match ended in a draw.'}
                </p>
                <button
                    onClick={handleReturnToLobby}
                    className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-transform hover:scale-105"
                >
                    Return to Arena Lobby
                </button>
            </div>
        )

      case PvpGameStage.LOBBY:
      default:
        return (
          <div className="text-center">
            <SwordsIcon className="w-20 h-20 text-purple-500 mx-auto mb-6" />
            <h2 className="text-4xl font-bold text-white">PVP Arena</h2>
            <p className="text-lg text-gray-400 mt-2 mb-8">Challenge other operatives and prove your dominance.</p>
            <button
              onClick={handleFindMatch}
              className="px-8 py-3 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700 transition-transform hover:scale-105"
            >
              Find Match
            </button>
          </div>
        );
    }
  };

  return (
    <div className="bg-gray-900/50 border border-gray-800 rounded-lg h-full flex items-center justify-center p-8">
        {renderContent()}
    </div>
  );
};

export default PvpLobby;
