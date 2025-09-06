export type FishRarity = 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'mythical';

export type FishingZone = {
  id: string;
  name: string;
  description: string;
  unlockLevel: number;
  background: string;
  fishPool: Fish[];
};

export type Fish = {
  id: string;
  name: string;
  rarity: FishRarity;
  baseValue: number;
  description: string;
  emoji: string;
  minSize: number;
  maxSize: number;
  catchDifficulty: number;
  zone: string;
};

export type CaughtFish = Fish & {
  size: number;
  timestamp: Date;
  sellValue: number;
};

export type FishingRod = {
  id: string;
  name: string;
  description: string;
  price: number;
  catchBonus: number;
  rareBonus: number;
  speedBonus: number;
  unlockLevel: number;
  emoji: string;
};

export type Bait = {
  id: string;
  name: string;
  description: string;
  price: number;
  rareBonus: number;
  quantity: number;
  emoji: string;
};

export type PlayerStats = {
  level: number;
  xp: number;
  xpToNextLevel: number;
  coins: number;
  fishCaught: number;
  totalValue: number;
  currentRod: FishingRod;
  currentBait: Bait | null;
  unlockedZones: string[];
};

export type GameState = {
  player: PlayerStats;
  inventory: CaughtFish[];
  fishLog: Record<string, Fish>;
  currentZone: FishingZone;
  isFishing: boolean;
  showMinigame: boolean;
  minigameProgress: number;
  minigameTarget: number;
  minigameSpeed: number;
};