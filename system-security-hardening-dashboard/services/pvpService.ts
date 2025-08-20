import type { UserProfile, PvpMatch, PvpPlayer, PvpActionId, PvpLogEntry } from '../types';
import { UserRole } from '../types';
import { HACKER_PAYLOADS, CYBER_SEC_COUNTERMEASURES } from '../constants';

// --- Mock Database and State ---
// In a real GCP architecture, this would be Firestore.
let mockMatch: PvpMatch | null = null;
let matchmakingTimeout: number | null = null;
let streamInterval: number | null = null;

const ALL_ACTIONS = [...HACKER_PAYLOADS, ...CYBER_SEC_COUNTERMEASURES];

const createPlayer = (profile: UserProfile): PvpPlayer => ({
  profile,
  systemIntegrity: 100,
  energy: 5,
  maxEnergy: 10,
});

const addLog = (match: PvpMatch, text: string): PvpMatch => {
  const newLogEntry: PvpLogEntry = {
    id: `log-${Date.now()}-${Math.random()}`,
    turn: match.turnNumber,
    text,
    timestamp: Date.now(),
  };
  return { ...match, log: [...match.log, newLogEntry] };
};

// --- Service Functions ---

/**
 * Simulates finding a match. In GCP, this could be a Cloud Function that queries a "lobbies" collection in Firestore.
 */
export const findMatch = (userProfile: UserProfile): Promise<PvpMatch> => {
  return new Promise((resolve) => {
    matchmakingTimeout = window.setTimeout(() => {
      const player1 = createPlayer(userProfile);
      const opponentProfile: UserProfile = {
          username: userProfile.role === UserRole.HACKER ? 'Firewall' : 'Nyx',
          role: userProfile.role === UserRole.HACKER ? UserRole.CYBER_SEC : UserRole.HACKER,
          avatarUrl: `https://i.pravatar.cc/150?u=${userProfile.role === UserRole.HACKER ? 'firewall' : 'nyx'}`,
          level: 14, xp: 100, xpToNextLevel: 1000,
      };
      const player2 = createPlayer(opponentProfile);
      
      const players: [PvpPlayer, PvpPlayer] = [player1, player2];
      
      mockMatch = {
        id: `match-${Date.now()}`,
        players,
        currentTurn: player1.profile.username,
        turnNumber: 1,
        log: [],
        status: 'active',
      };
      mockMatch = addLog(mockMatch, `Match started between ${player1.profile.username} and ${player2.profile.username}!`);
      mockMatch = addLog(mockMatch, `${mockMatch.currentTurn}'s turn.`);

      resolve(JSON.parse(JSON.stringify(mockMatch)));
    }, 2500); // 2.5 second matchmaking delay
  });
};

export const cancelMatchmaking = () => {
    if (matchmakingTimeout) {
        clearTimeout(matchmakingTimeout);
        matchmakingTimeout = null;
    }
};

/**
 * Simulates a Firestore real-time listener (onSnapshot).
 * The callback will be invoked with the latest match state.
 * Returns an unsubscribe function.
 */
export const getMatchStream = (matchId: string, onUpdate: (match: PvpMatch) => void): (() => void) => {
  // In a real app, this would be a simple onSnapshot listener.
  // Here, we simulate the opponent's move with an interval.
  streamInterval = window.setInterval(() => {
    if (!mockMatch || mockMatch.id !== matchId || mockMatch.status === 'finished') return;
    
    const me = mockMatch.players.find(p => p.profile.username !== mockMatch!.currentTurn)!;
    const opponent = mockMatch.players.find(p => p.profile.username === mockMatch!.currentTurn)!;

    // If it's the AI's turn, make a move
    if (opponent.profile.username !== 'Cipher007') { // Simple check to see if it's the AI
      const availableActions = opponent.profile.role === UserRole.HACKER ? HACKER_PAYLOADS : CYBER_SEC_COUNTERMEASURES;
      const possibleActions = availableActions.filter(a => a.cost <= opponent.energy);
      const action = possibleActions[Math.floor(Math.random() * possibleActions.length)];
      
      if(action) {
          submitAction(mockMatch.id, opponent.profile.username, action.id);
          onUpdate(JSON.parse(JSON.stringify(mockMatch)));
      }
    }

  }, 4000); // AI thinks for 4 seconds

  const unsubscribe = () => {
    if (streamInterval) {
      clearInterval(streamInterval);
      streamInterval = null;
    }
  };

  return unsubscribe;
};

/**
 * Simulates updating a Firestore document with a player's action.
 */
export const submitAction = (matchId: string, username: string, actionId: PvpActionId): Promise<void> => {
  return new Promise((resolve) => {
    if (!mockMatch || mockMatch.id !== matchId || mockMatch.currentTurn !== username || mockMatch.status === 'finished') {
      return resolve();
    }

    const action = ALL_ACTIONS.find(a => a.id === actionId)!;
    let actingPlayer = mockMatch.players.find(p => p.profile.username === username)!;
    let targetPlayer = mockMatch.players.find(p => p.profile.username !== username)!;

    if (actingPlayer.energy < action.cost) return resolve(); // Not enough energy

    // 1. Apply costs
    actingPlayer.energy -= action.cost;
    mockMatch = addLog(mockMatch, `${username} uses ${action.name}.`);

    // 2. Apply effects
    if (action.damage > 0) {
      targetPlayer.systemIntegrity -= action.damage;
      mockMatch = addLog(mockMatch, `${action.name} deals ${action.damage} damage to ${targetPlayer.profile.username}.`);
    }
    if (action.defense > 0) {
        // For simplicity, we'll treat defense as a temporary heal.
        actingPlayer.systemIntegrity += action.defense;
        mockMatch = addLog(mockMatch, `${action.name} restores ${action.defense} integrity for ${actingPlayer.profile.username}.`);
    }
    if (action.damage < 0) { // Healing
        actingPlayer.systemIntegrity += Math.abs(action.damage);
        mockMatch = addLog(mockMatch, `${action.name} restores ${Math.abs(action.damage)} integrity.`);
    }

    // Clamp values
    actingPlayer.systemIntegrity = Math.min(100, actingPlayer.systemIntegrity);
    targetPlayer.systemIntegrity = Math.max(0, targetPlayer.systemIntegrity);

    // 3. Update player states
    mockMatch.players = [actingPlayer, targetPlayer].sort((a, b) => a.profile.username === mockMatch!.players[0].profile.username ? -1 : 1) as [PvpPlayer, PvpPlayer];

    // 4. Check for winner
    if (targetPlayer.systemIntegrity <= 0) {
        mockMatch.status = 'finished';
        mockMatch.winner = actingPlayer.profile.username;
        mockMatch = addLog(mockMatch, `${targetPlayer.profile.username}'s system is compromised! ${actingPlayer.profile.username} wins!`);
    } else {
        // 5. Switch turns
        mockMatch.currentTurn = targetPlayer.profile.username;
        mockMatch.turnNumber += 1;
        
        // Grant energy for next turn
        targetPlayer.energy = Math.min(targetPlayer.maxEnergy, targetPlayer.energy + 4);
        mockMatch.players = [actingPlayer, targetPlayer].sort((a, b) => a.profile.username === mockMatch!.players[0].profile.username ? -1 : 1) as [PvpPlayer, PvpPlayer];

        mockMatch = addLog(mockMatch, `It is now ${mockMatch.currentTurn}'s turn.`);
    }

    resolve();
  });
};
