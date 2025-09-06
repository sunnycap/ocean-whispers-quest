import { useState, useCallback } from 'react';
import { GameState, CaughtFish, Fish, FishRarity } from '@/types/game';
import { FISHING_ZONES, FISH_DATA, FISHING_RODS, BAIT_DATA } from '@/data/gameData';
import { FishingInterface } from './FishingInterface';
import { PlayerStats } from './PlayerStats';
import { FishInventory } from './FishInventory';
import { ShopInterface } from './ShopInterface';
import { FishLogbook } from './FishLogbook';
import { ZoneSelector } from './ZoneSelector';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';

const RARITY_WEIGHTS: Record<FishRarity, number> = {
  common: 50,
  uncommon: 25,
  rare: 15,
  epic: 7,
  legendary: 2.5,
  mythical: 0.5,
};

export const FishingGame = () => {
  const [gameState, setGameState] = useState<GameState>({
    player: {
      level: 1,
      xp: 0,
      xpToNextLevel: 100,
      coins: 100,
      fishCaught: 0,
      totalValue: 0,
      currentRod: FISHING_RODS[0],
      currentBait: null,
      unlockedZones: ['starter-dock'],
    },
    inventory: [],
    fishLog: {},
    currentZone: FISHING_ZONES[0],
    isFishing: false,
    showMinigame: false,
    minigameProgress: 50,
    minigameTarget: 50,
    minigameSpeed: 1,
  });

  const calculateFishValue = (fish: Fish, size: number): number => {
    const sizeMultiplier = size / ((fish.minSize + fish.maxSize) / 2);
    return Math.floor(fish.baseValue * sizeMultiplier);
  };

  const getRandomFish = useCallback((zone: string): Fish | null => {
    const zoneFish = FISH_DATA.filter(f => f.zone === zone);
    if (zoneFish.length === 0) return null;

    // Calculate adjusted weights based on rod and bait bonuses
    const adjustedWeights: Record<string, number> = {};
    
    zoneFish.forEach(fish => {
      let weight = RARITY_WEIGHTS[fish.rarity];
      
      // Apply rod rare bonus
      if (fish.rarity !== 'common') {
        weight += (weight * gameState.player.currentRod.rareBonus) / 100;
      }
      
      // Apply bait rare bonus
      if (gameState.player.currentBait) {
        weight += (weight * gameState.player.currentBait.rareBonus) / 100;
      }
      
      adjustedWeights[fish.id] = weight;
    });

    // Select fish based on weighted random
    const totalWeight = Object.values(adjustedWeights).reduce((sum, weight) => sum + weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const fish of zoneFish) {
      random -= adjustedWeights[fish.id];
      if (random <= 0) {
        return fish;
      }
    }
    
    return zoneFish[0]; // Fallback
  }, [gameState.player.currentRod, gameState.player.currentBait]);

  const addXP = (amount: number) => {
    setGameState(prev => {
      const newXP = prev.player.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const leveledUp = newLevel > prev.player.level;
      
      if (leveledUp) {
        toast.success(`Level Up! You are now level ${newLevel}!`, {
          duration: 3000,
        });
      }
      
      return {
        ...prev,
        player: {
          ...prev.player,
          xp: newXP,
          level: newLevel,
          xpToNextLevel: (newLevel * 100) - newXP,
        },
      };
    });
  };

  const onFishCaught = useCallback((fish: Fish) => {
    const size = Math.random() * (fish.maxSize - fish.minSize) + fish.minSize;
    const sellValue = calculateFishValue(fish, size);
    
    const caughtFish: CaughtFish = {
      ...fish,
      size: Math.round(size * 10) / 10,
      timestamp: new Date(),
      sellValue,
    };

    setGameState(prev => ({
      ...prev,
      inventory: [...prev.inventory, caughtFish],
      fishLog: { ...prev.fishLog, [fish.id]: fish },
      player: {
        ...prev.player,
        fishCaught: prev.player.fishCaught + 1,
        totalValue: prev.player.totalValue + sellValue,
      },
    }));

    // Award XP based on rarity
    const xpReward = {
      common: 10,
      uncommon: 25,
      rare: 50,
      epic: 100,
      legendary: 200,
      mythical: 500,
    }[fish.rarity];

    addXP(xpReward);

    // Show catch notification with rarity styling
    const rarityColors = {
      common: '🟢',
      uncommon: '🔵',
      rare: '🟣',
      epic: '🟠',
      legendary: '🟡',
      mythical: '🌟',
    };

    toast.success(
      `${rarityColors[fish.rarity]} Caught a ${fish.rarity} ${fish.name}! (${caughtFish.size}" - ${sellValue} coins)`,
      { duration: 4000 }
    );
  }, []);

  const sellFish = useCallback((fishToSell: CaughtFish[]) => {
    const totalValue = fishToSell.reduce((sum, fish) => sum + fish.sellValue, 0);
    
    setGameState(prev => ({
      ...prev,
      inventory: prev.inventory.filter(fish => 
        !fishToSell.some(sellFish => 
          sellFish.id === fish.id && sellFish.timestamp === fish.timestamp
        )
      ),
      player: {
        ...prev.player,
        coins: prev.player.coins + totalValue,
      },
    }));

    toast.success(`Sold ${fishToSell.length} fish for ${totalValue} coins!`);
  }, []);

  const buyItem = useCallback((itemType: 'rod' | 'bait', itemId: string, quantity?: number) => {
    if (itemType === 'rod') {
      const rod = FISHING_RODS.find(r => r.id === itemId);
      if (!rod || gameState.player.coins < rod.price || gameState.player.level < rod.unlockLevel) {
        toast.error('Cannot purchase this rod!');
        return;
      }

      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          coins: prev.player.coins - rod.price,
          currentRod: rod,
        },
      }));

      toast.success(`Purchased ${rod.name}!`);
    } else if (itemType === 'bait') {
      const bait = BAIT_DATA.find(b => b.id === itemId);
      const qty = quantity || 1;
      if (!bait || gameState.player.coins < bait.price * qty) {
        toast.error('Cannot purchase this bait!');
        return;
      }

      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          coins: prev.player.coins - (bait.price * qty),
          currentBait: prev.player.currentBait?.id === itemId 
            ? { ...prev.player.currentBait, quantity: prev.player.currentBait.quantity + qty }
            : { ...bait, quantity: qty },
        },
      }));

      toast.success(`Purchased ${qty}x ${bait.name}!`);
    }
  }, [gameState.player.coins, gameState.player.level]);

  const changeZone = useCallback((zoneId: string) => {
    const zone = FISHING_ZONES.find(z => z.id === zoneId);
    if (!zone || !gameState.player.unlockedZones.includes(zoneId)) {
      toast.error('Zone not unlocked!');
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentZone: zone,
    }));

    toast.success(`Moved to ${zone.name}!`);
  }, [gameState.player.unlockedZones]);

  return (
    <div className="min-h-screen bg-water-gradient">
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Fishing Area */}
          <div className="lg:col-span-2">
            <Card className="p-6 shadow-ocean border-ocean-light/20">
              <FishingInterface
                gameState={gameState}
                setGameState={setGameState}
                onFishCaught={onFishCaught}
                getRandomFish={getRandomFish}
              />
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <PlayerStats player={gameState.player} />
            
            <Tabs defaultValue="inventory" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="inventory">Bag</TabsTrigger>
                <TabsTrigger value="shop">Shop</TabsTrigger>
                <TabsTrigger value="log">Log</TabsTrigger>
                <TabsTrigger value="zones">Zones</TabsTrigger>
              </TabsList>
              
              <TabsContent value="inventory">
                <FishInventory 
                  inventory={gameState.inventory}
                  onSellFish={sellFish}
                />
              </TabsContent>
              
              <TabsContent value="shop">
                <ShopInterface
                  player={gameState.player}
                  onBuyItem={buyItem}
                />
              </TabsContent>
              
              <TabsContent value="log">
                <FishLogbook 
                  fishLog={gameState.fishLog}
                  caughtCount={gameState.inventory.length}
                />
              </TabsContent>
              
              <TabsContent value="zones">
                <ZoneSelector
                  currentZone={gameState.currentZone}
                  unlockedZones={gameState.player.unlockedZones}
                  playerLevel={gameState.player.level}
                  onChangeZone={changeZone}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};