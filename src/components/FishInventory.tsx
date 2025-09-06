import { useState } from 'react';
import { CaughtFish, FishRarity } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

interface FishInventoryProps {
  inventory: CaughtFish[];
  onSellFish: (fish: CaughtFish[]) => void;
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

export const FishInventory = ({ inventory, onSellFish }: FishInventoryProps) => {
  const [selectedFish, setSelectedFish] = useState<Set<string>>(new Set());

  const handleSelectFish = (fishKey: string, checked: boolean) => {
    const newSelected = new Set(selectedFish);
    if (checked) {
      newSelected.add(fishKey);
    } else {
      newSelected.delete(fishKey);
    }
    setSelectedFish(newSelected);
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      const allKeys = inventory.map((fish, index) => `${fish.id}-${fish.timestamp.getTime()}-${index}`);
      setSelectedFish(new Set(allKeys));
    } else {
      setSelectedFish(new Set());
    }
  };

  const handleSellSelected = () => {
    const fishToSell = inventory.filter((fish, index) => {
      const fishKey = `${fish.id}-${fish.timestamp.getTime()}-${index}`;
      return selectedFish.has(fishKey);
    });
    
    if (fishToSell.length > 0) {
      onSellFish(fishToSell);
      setSelectedFish(new Set());
    }
  };

  const totalSelectedValue = inventory
    .filter((fish, index) => {
      const fishKey = `${fish.id}-${fish.timestamp.getTime()}-${index}`;
      return selectedFish.has(fishKey);
    })
    .reduce((sum, fish) => sum + fish.sellValue, 0);

  if (inventory.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <div className="text-6xl mb-4">🎣</div>
          <h3 className="text-lg font-semibold mb-2">No Fish Yet</h3>
          <p className="text-muted-foreground">
            Cast your line to start catching fish!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            🎒 Fish Bag ({inventory.length})
          </span>
          <div className="flex items-center gap-2">
            <Checkbox
              checked={selectedFish.size === inventory.length}
              onCheckedChange={handleSelectAll}
              id="select-all"
            />
            <label htmlFor="select-all" className="text-sm">All</label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {inventory.map((fish, index) => {
            const fishKey = `${fish.id}-${fish.timestamp.getTime()}-${index}`;
            const isSelected = selectedFish.has(fishKey);
            
            return (
              <div
                key={fishKey}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${
                  isSelected ? 'bg-primary/5 border-primary/20' : 'hover:bg-muted/50'
                }`}
              >
                <Checkbox
                  checked={isSelected}
                  onCheckedChange={(checked) => handleSelectFish(fishKey, checked as boolean)}
                />
                
                <div className="text-2xl">{fish.emoji}</div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium truncate">{fish.name}</span>
                    <Badge className={`${getRarityColor(fish.rarity)} text-xs`}>
                      {fish.rarity}
                    </Badge>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {fish.size}" • 💰 {fish.sellValue}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {selectedFish.size > 0 && (
          <div className="mt-4 pt-4 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">
                Selected: {selectedFish.size} fish
              </span>
              <span className="text-sm font-medium text-accent">
                💰 {totalSelectedValue.toLocaleString()}
              </span>
            </div>
            <Button
              onClick={handleSellSelected}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground"
            >
              Sell Selected Fish
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};