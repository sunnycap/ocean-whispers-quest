import { Fish, FishingRod, FishingZone, Bait } from '@/types/game';

export const FISH_DATA: Fish[] = [
  // Common Fish
  { id: 'sardine', name: 'Sardine', rarity: 'common', baseValue: 5, description: 'A small, silver fish found in shallow waters.', emoji: '🐟', minSize: 3, maxSize: 6, catchDifficulty: 1, zone: 'starter-dock' },
  { id: 'anchovy', name: 'Anchovy', rarity: 'common', baseValue: 4, description: 'Tiny fish that swim in schools.', emoji: '🐟', minSize: 2, maxSize: 4, catchDifficulty: 1, zone: 'starter-dock' },
  { id: 'mackerel', name: 'Mackerel', rarity: 'common', baseValue: 8, description: 'A common fish with distinctive stripes.', emoji: '🐟', minSize: 8, maxSize: 12, catchDifficulty: 2, zone: 'starter-dock' },
  
  // Uncommon Fish
  { id: 'bass', name: 'Sea Bass', rarity: 'uncommon', baseValue: 25, description: 'A prized catch for any angler.', emoji: '🐠', minSize: 12, maxSize: 18, catchDifficulty: 3, zone: 'starter-dock' },
  { id: 'trout', name: 'Rainbow Trout', rarity: 'uncommon', baseValue: 30, description: 'Beautiful fish with rainbow scales.', emoji: '🐠', minSize: 10, maxSize: 15, catchDifficulty: 3, zone: 'mountain-river' },
  { id: 'salmon', name: 'Atlantic Salmon', rarity: 'uncommon', baseValue: 35, description: 'Strong swimmer with pink flesh.', emoji: '🐠', minSize: 15, maxSize: 25, catchDifficulty: 4, zone: 'mountain-river' },
  
  // Rare Fish
  { id: 'tuna', name: 'Bluefin Tuna', rarity: 'rare', baseValue: 100, description: 'Fast and powerful ocean predator.', emoji: '🐟', minSize: 30, maxSize: 50, catchDifficulty: 6, zone: 'deep-ocean' },
  { id: 'marlin', name: 'Blue Marlin', rarity: 'rare', baseValue: 150, description: 'Magnificent billfish with a sword-like bill.', emoji: '🗡️', minSize: 60, maxSize: 100, catchDifficulty: 7, zone: 'deep-ocean' },
  { id: 'swordfish', name: 'Swordfish', rarity: 'rare', baseValue: 120, description: 'Lightning-fast hunter of the deep.', emoji: '⚔️', minSize: 40, maxSize: 80, catchDifficulty: 7, zone: 'deep-ocean' },
  
  // Epic Fish
  { id: 'shark', name: 'Great White Shark', rarity: 'epic', baseValue: 500, description: 'Apex predator of the ocean.', emoji: '🦈', minSize: 120, maxSize: 200, catchDifficulty: 9, zone: 'deep-ocean' },
  { id: 'lava-fish', name: 'Magma Grouper', rarity: 'epic', baseValue: 400, description: 'Fire-resistant fish living near underwater volcanoes.', emoji: '🌋', minSize: 25, maxSize: 40, catchDifficulty: 8, zone: 'volcano-depths' },
  { id: 'ice-fish', name: 'Crystal Cod', rarity: 'epic', baseValue: 350, description: 'Translucent fish from frozen waters.', emoji: '❄️', minSize: 20, maxSize: 35, catchDifficulty: 8, zone: 'frozen-lake' },
  
  // Legendary Fish
  { id: 'kraken-tentacle', name: 'Kraken Spawn', rarity: 'legendary', baseValue: 1000, description: 'Young offspring of the legendary sea monster.', emoji: '🐙', minSize: 50, maxSize: 80, catchDifficulty: 12, zone: 'abyssal-trench' },
  { id: 'phoenix-fish', name: 'Phoenix Koi', rarity: 'legendary', baseValue: 1200, description: 'Mystical fish that glows with inner fire.', emoji: '🔥', minSize: 30, maxSize: 45, catchDifficulty: 11, zone: 'volcano-depths' },
  { id: 'leviathan', name: 'Baby Leviathan', rarity: 'legendary', baseValue: 1500, description: 'Ancient sea serpent youngling.', emoji: '🐉', minSize: 100, maxSize: 150, catchDifficulty: 13, zone: 'abyssal-trench' },
  
  // Mythical Fish
  { id: 'cosmic-whale', name: 'Starwhale', rarity: 'mythical', baseValue: 5000, description: 'Celestial being said to swim between stars.', emoji: '🌟', minSize: 200, maxSize: 300, catchDifficulty: 15, zone: 'cosmic-depths' },
  { id: 'time-fish', name: 'Chronos Angelfish', rarity: 'mythical', baseValue: 8000, description: 'Fish that exists outside of time itself.', emoji: '⏰', minSize: 15, maxSize: 25, catchDifficulty: 18, zone: 'temporal-pools' },
  { id: 'dream-fish', name: 'Dreamweaver', rarity: 'mythical', baseValue: 10000, description: 'Ethereal fish born from ancient dreams.', emoji: '💫', minSize: 40, maxSize: 60, catchDifficulty: 20, zone: 'mystical-cavern' },
];

export const FISHING_RODS: FishingRod[] = [
  { id: 'wooden', name: 'Wooden Rod', description: 'A simple starter rod made from bamboo.', price: 0, catchBonus: 0, rareBonus: 0, speedBonus: 0, unlockLevel: 1, emoji: '🎣' },
  { id: 'fiberglass', name: 'Fiberglass Rod', description: 'More durable and flexible than wood.', price: 100, catchBonus: 10, rareBonus: 5, speedBonus: 10, unlockLevel: 5, emoji: '🎣' },
  { id: 'carbon', name: 'Carbon Fiber Rod', description: 'Lightweight and incredibly strong.', price: 500, catchBonus: 25, rareBonus: 15, speedBonus: 25, unlockLevel: 15, emoji: '🎣' },
  { id: 'titanium', name: 'Titanium Rod', description: 'Advanced alloy construction for serious anglers.', price: 2000, catchBonus: 50, rareBonus: 30, speedBonus: 40, unlockLevel: 30, emoji: '🎣' },
  { id: 'mystical', name: 'Enchanted Rod', description: 'Imbued with ancient fishing magic.', price: 10000, catchBonus: 100, rareBonus: 75, speedBonus: 60, unlockLevel: 50, emoji: '✨' },
];

export const BAIT_DATA: Bait[] = [
  { id: 'worm', name: 'Earthworm', description: 'Classic bait for common fish.', price: 2, rareBonus: 0, quantity: 1, emoji: '🪱' },
  { id: 'shrimp', name: 'Fresh Shrimp', description: 'Attracts uncommon fish species.', price: 10, rareBonus: 10, quantity: 1, emoji: '🦐' },
  { id: 'squid', name: 'Squid Tentacle', description: 'Irresistible to rare deep-sea fish.', price: 50, rareBonus: 25, quantity: 1, emoji: '🦑' },
  { id: 'golden', name: 'Golden Lure', description: 'Legendary bait that attracts mythical fish.', price: 500, rareBonus: 100, quantity: 1, emoji: '✨' },
];

export const FISHING_ZONES: FishingZone[] = [
  {
    id: 'starter-dock',
    name: 'Starter Dock',
    description: 'Peaceful dock perfect for beginners.',
    unlockLevel: 1,
    background: 'bg-ocean-gradient',
    fishPool: FISH_DATA.filter(f => f.zone === 'starter-dock'),
  },
  {
    id: 'mountain-river',
    name: 'Mountain River',
    description: 'Fast-flowing river with unique freshwater species.',
    unlockLevel: 10,
    background: 'bg-gradient-to-b from-blue-300 to-blue-600',
    fishPool: FISH_DATA.filter(f => f.zone === 'mountain-river'),
  },
  {
    id: 'deep-ocean',
    name: 'Deep Ocean',
    description: 'Vast ocean depths home to large predators.',
    unlockLevel: 20,
    background: 'bg-gradient-to-b from-blue-600 to-blue-900',
    fishPool: FISH_DATA.filter(f => f.zone === 'deep-ocean'),
  },
  {
    id: 'volcano-depths',
    name: 'Volcanic Depths',
    description: 'Dangerous waters near underwater volcanoes.',
    unlockLevel: 35,
    background: 'bg-gradient-to-b from-red-400 to-red-800',
    fishPool: FISH_DATA.filter(f => f.zone === 'volcano-depths'),
  },
  {
    id: 'frozen-lake',
    name: 'Frozen Lake',
    description: 'Icy waters in the far north.',
    unlockLevel: 30,
    background: 'bg-gradient-to-b from-cyan-200 to-cyan-600',
    fishPool: FISH_DATA.filter(f => f.zone === 'frozen-lake'),
  },
  {
    id: 'abyssal-trench',
    name: 'Abyssal Trench',
    description: 'Deepest parts of the ocean where monsters dwell.',
    unlockLevel: 45,
    background: 'bg-gradient-to-b from-purple-900 to-black',
    fishPool: FISH_DATA.filter(f => f.zone === 'abyssal-trench'),
  },
  {
    id: 'cosmic-depths',
    name: 'Cosmic Depths',
    description: 'Mysterious waters that seem to contain stars.',
    unlockLevel: 60,
    background: 'bg-gradient-to-b from-purple-400 via-purple-800 to-black',
    fishPool: FISH_DATA.filter(f => f.zone === 'cosmic-depths'),
  },
  {
    id: 'temporal-pools',
    name: 'Temporal Pools',
    description: 'Waters that exist across multiple timelines.',
    unlockLevel: 70,
    background: 'bg-gradient-to-b from-amber-300 to-amber-800',
    fishPool: FISH_DATA.filter(f => f.zone === 'temporal-pools'),
  },
  {
    id: 'mystical-cavern',
    name: 'Mystical Cavern',
    description: 'Hidden cave where dreams become reality.',
    unlockLevel: 80,
    background: 'bg-rare-gradient',
    fishPool: FISH_DATA.filter(f => f.zone === 'mystical-cavern'),
  },
];