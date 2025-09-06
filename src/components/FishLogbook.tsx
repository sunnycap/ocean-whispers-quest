import { Fish, FishRarity } from '@/types/game';
import { FISH_DATA } from '@/data/gameData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface FishLogbookProps {
  fishLog: Record<string, Fish>;
  caughtCount: number;
}

const getRarityColor = (rarity: FishRarity): string => {
  const colors = {
    common: 'bg-rarity-common text-white',
    uncommon: 'bg-rarity-uncommon text-white',
    rare: 'bg-rarity-rare text-white',
    epic: 'bg-rarity-epic text-white',
    legendary: 'bg-rarity-legendary text-white',
    mythical: 'bg-rarity-mythical text-white',
  };
  return colors[rarity];
};

const getRarityStats = (fishLog: Record<string, Fish>) => {
  const stats: Record<FishRarity, number> = {
    common: 0,
    uncommon: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
    mythical: 0,
  };

  Object.values(fishLog).forEach(fish => {
    stats[fish.rarity]++;
  });

  return stats;
};

export const FishLogbook = ({ fishLog, caughtCount }: FishLogbookProps) => {
  const discoveredCount = Object.keys(fishLog).length;
  const totalFish = FISH_DATA.length;
  const completionPercentage = (discoveredCount / totalFish) * 100;
  const rarityStats = getRarityStats(fishLog);

  // Group fish by zone
  const fishByZone = FISH_DATA.reduce((acc, fish) => {
    if (!acc[fish.zone]) {
      acc[fish.zone] = [];
    }
    acc[fish.zone].push(fish);
    return acc;
  }, {} as Record<string, Fish[]>);

  const zoneNames: Record<string, string> = {
    'starter-dock': 'Starter Dock',
    'mountain-river': 'Mountain River',
    'deep-ocean': 'Deep Ocean',
    'volcano-depths': 'Volcanic Depths',
    'frozen-lake': 'Frozen Lake',
    'abyssal-trench': 'Abyssal Trench',
    'cosmic-depths': 'Cosmic Depths',
    'temporal-pools': 'Temporal Pools',
    'mystical-cavern': 'Mystical Cavern',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          📖 Fish Logbook
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Overall Progress */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Discovery Progress</span>
            <span className="text-sm text-muted-foreground">
              {discoveredCount}/{totalFish} ({completionPercentage.toFixed(1)}%)
            </span>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </div>

        {/* Rarity Statistics */}
        <div className="grid grid-cols-2 gap-2 mb-6">
          {Object.entries(rarityStats).map(([rarity, count]) => (
            <div key={rarity} className="flex items-center gap-2">
              <Badge className={`${getRarityColor(rarity as FishRarity)} text-xs`}>
                {rarity}
              </Badge>
              <span className="text-sm">{count}</span>
            </div>
          ))}
        </div>

        {/* Fish by Zone */}
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {Object.entries(fishByZone).map(([zoneId, zoneFish]) => (
            <div key={zoneId}>
              <h3 className="font-medium text-ocean-deep mb-2">
                {zoneNames[zoneId] || zoneId}
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {zoneFish.map((fish) => {
                  const discovered = fishLog[fish.id];
                  
                  return (
                    <div
                      key={fish.id}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                        discovered 
                          ? 'bg-card hover:bg-muted/50' 
                          : 'bg-muted/20 opacity-60'
                      }`}
                    >
                      <div className="text-2xl">
                        {discovered ? fish.emoji : '❓'}
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium">
                            {discovered ? fish.name : '???'}
                          </span>
                          {discovered && (
                            <Badge className={`${getRarityColor(fish.rarity)} text-xs`}>
                              {fish.rarity}
                            </Badge>
                          )}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {discovered 
                            ? `${fish.description} • 💰 ${fish.baseValue}`
                            : 'Not discovered yet'
                          }
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {discoveredCount === 0 && (
          <div className="text-center py-8">
            <div className="text-4xl mb-4">🐟</div>
            <h3 className="text-lg font-semibold mb-2">No Fish Discovered</h3>
            <p className="text-muted-foreground">
              Start fishing to discover new species!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};