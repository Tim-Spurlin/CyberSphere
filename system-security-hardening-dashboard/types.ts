export enum CheckStatus {
  PASS = 'PASS',
  WARN = 'WARN',
  FAIL = 'FAIL',
  PENDING = 'PENDING',
  RUNNING = 'RUNNING',
}

export interface Check {
  id: string;
  title: string;
  description: string;
  status: CheckStatus;
  details?: string; // This will hold AI-generated content
}

export interface ScanCategory {
  id: string;
  title: string;
  description: string;
  checks: Check[];
}

export enum UserRole {
  HACKER = 'Hacker',
  CYBER_SEC = 'Cyber Security',
}

export interface UserProfile {
  username: string;
  role: UserRole;
  avatarUrl: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
}

// PVP Types
export enum PvpGameStage {
  LOBBY = 'LOBBY',
  SEARCHING = 'SEARCHING',
  IN_PROGRESS = 'IN_PROGRESS',
  RESULTS = 'RESULTS',
}

export type PvpActionId = 'phishing_email' | 'ddos_swarm' | 'sql_injection' | 'credential_stuffing' | 'rootkit_install' | 'firewall_update' | 'isolate_endpoint' | 'patch_vulnerability' | 'threat_intelligence_scan' | 'honeypot_deploy';

export interface PvpAction {
  id: PvpActionId;
  name: string;
  description: string;
  cost: number; // "Energy" cost to perform the action
  damage: number; // Damage to opponent's system integrity
  defense: number; // Amount of "shield" or defense it provides
  role: UserRole;
}

export interface PvpPlayer {
  profile: UserProfile;
  systemIntegrity: number; // "Health" of the player's system
  energy: number; // "Mana/AP" for actions
  maxEnergy: number;
}

export interface PvpLogEntry {
  id: string;
  turn: number;
  text: string;
  timestamp: number;
}

export interface PvpMatch {
  id: string;
  players: [PvpPlayer, PvpPlayer];
  currentTurn: string; // username of the player whose turn it is
  turnNumber: number;
  log: PvpLogEntry[];
  winner?: string; // username of the winner
  status: 'active' | 'finished';
}

// AI Hub Types
export enum ChatMessageAuthor {
    USER = 'user',
    AI = 'ai',
    SYSTEM = 'system',
}

export enum ChatMessageType {
    TEXT = 'text',
    AUDIO = 'audio',
    IMAGE = 'image',
    FILE = 'file',
}

export interface ChatMessage {
    id: string;
    author: ChatMessageAuthor;
    type: ChatMessageType;
    textContent?: string;
    mediaUrl?: string; // For images, audio files
    mediaType?: string; // e.g., 'audio/webm'
    fileName?: string;
    isLoading?: boolean;
}
