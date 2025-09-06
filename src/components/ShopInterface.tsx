import { PlayerStats, FishingRod, Bait } from '@/types/game';
import { FISHING_RODS, BAIT_DATA } from '@/data/gameData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ShopInterfaceProps {
  player: PlayerStats;
  onBuyItem: (itemType: 'rod' | 'bait', itemId: string, quantity?: number) => void;
}

export const ShopInterface = ({ player, onBuyItem }: ShopInterfaceProps) => {
  const canAffordRod = (rod: FishingRod) => {
    return player.coins >= rod.price && player.level >= rod.unlockLevel;
  };

  const canAffordBait = (bait: Bait, quantity = 1) => {
    return player.coins >= bait.price * quantity;
  };

  const isCurrentRod = (rodId: string) => {
    return player.currentRod.id === rodId;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🏪 Fishing Shop
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="rods" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rods">Rods</TabsTrigger>
            <TabsTrigger value="bait">Bait</TabsTrigger>
          </TabsList>
          
          <TabsContent value="rods" className="space-y-3 mt-4">
            {FISHING_RODS.map((rod) => (
              <div
                key={rod.id}
                className={`p-4 rounded-lg border transition-colors ${
                  isCurrentRod(rod.id) 
                    ? 'bg-primary/10 border-primary/30' 
                    : 'bg-card hover:bg-muted/50'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{rod.emoji}</span>
                    <div>
                      <h3 className="font-medium">{rod.name}</h3>
                      {rod.unlockLevel > 1 && (
                        <Badge variant="secondary" className="text-xs">
                          Level {rod.unlockLevel}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  {isCurrentRod(rod.id) ? (
                    <Badge className="bg-rarity-common text-white">Equipped</Badge>
                  ) : (
                    <div className="text-right">
                      <div className="font-medium text-accent">
                        💰 {rod.price.toLocaleString()}
                      </div>
                    </div>
                  )}
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {rod.description}
                </p>
                
                {rod.id !== 'wooden' && (
                  <div className="grid grid-cols-3 gap-2 text-xs mb-3">
                    <div className="text-center">
                      <div className="font-medium text-rarity-uncommon">+{rod.catchBonus}%</div>
                      <div className="text-muted-foreground">Catch</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-rarity-rare">+{rod.rareBonus}%</div>
                      <div className="text-muted-foreground">Rare</div>
                    </div>
                    <div className="text-center">
                      <div className="font-medium text-rarity-epic">+{rod.speedBonus}%</div>
                      <div className="text-muted-foreground">Speed</div>
                    </div>
                  </div>
                )}
                
                {!isCurrentRod(rod.id) && (
                  <Button
                    onClick={() => onBuyItem('rod', rod.id)}
                    disabled={!canAffordRod(rod)}
                    className="w-full"
                    variant={canAffordRod(rod) ? "default" : "secondary"}
                  >
                    {player.level < rod.unlockLevel 
                      ? `Requires Level ${rod.unlockLevel}`
                      : player.coins < rod.price
                      ? 'Cannot Afford'
                      : 'Buy Rod'
                    }
                  </Button>
                )}
              </div>
            ))}
          </TabsContent>
          
          <TabsContent value="bait" className="space-y-3 mt-4">
            {BAIT_DATA.map((bait) => (
              <div key={bait.id} className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{bait.emoji}</span>
                    <div>
                      <h3 className="font-medium">{bait.name}</h3>
                      {bait.rareBonus > 0 && (
                        <Badge className="bg-rarity-rare text-white text-xs">
                          +{bait.rareBonus}% Rare
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium text-accent">
                      💰 {bait.price}
                    </div>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mb-3">
                  {bait.description}
                </p>
                
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    onClick={() => onBuyItem('bait', bait.id, 1)}
                    disabled={!canAffordBait(bait, 1)}
                    variant="outline"
                    size="sm"
                  >
                    Buy 1
                  </Button>
                  <Button
                    onClick={() => onBuyItem('bait', bait.id, 5)}
                    disabled={!canAffordBait(bait, 5)}
                    variant="outline"
                    size="sm"
                  >
                    Buy 5
                  </Button>
                  <Button
                    onClick={() => onBuyItem('bait', bait.id, 10)}
                    disabled={!canAffordBait(bait, 10)}
                    variant="outline"
                    size="sm"
                  >
                    Buy 10
                  </Button>
                </div>
              </div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};