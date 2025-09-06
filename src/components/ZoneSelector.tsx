import { FishingZone } from '@/types/game';
import { FISHING_ZONES } from '@/data/gameData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Lock } from 'lucide-react';

interface ZoneSelectorProps {
  currentZone: FishingZone;
  unlockedZones: string[];
  playerLevel: number;
  onChangeZone: (zoneId: string) => void;
}

export const ZoneSelector = ({ 
  currentZone, 
  unlockedZones, 
  playerLevel, 
  onChangeZone 
}: ZoneSelectorProps) => {
  const isZoneUnlocked = (zone: FishingZone) => {
    return playerLevel >= zone.unlockLevel || unlockedZones.includes(zone.id);
  };

  const isCurrentZone = (zoneId: string) => {
    return currentZone.id === zoneId;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🗺️ Fishing Zones
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-80 overflow-y-auto">
          {FISHING_ZONES.map((zone) => {
            const unlocked = isZoneUnlocked(zone);
            const current = isCurrentZone(zone.id);
            
            return (
              <div
                key={zone.id}
                className={`p-4 rounded-lg border transition-colors ${
                  current
                    ? 'bg-primary/10 border-primary/30'
                    : unlocked
                    ? 'bg-card hover:bg-muted/50 cursor-pointer'
                    : 'bg-muted/20 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{zone.name}</h3>
                      {current && (
                        <Badge className="bg-rarity-common text-white text-xs">
                          Current
                        </Badge>
                      )}
                      {!unlocked && (
                        <Lock className="w-4 h-4 text-muted-foreground" />
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-2">
                      {zone.description}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs">
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Level:</span>
                        <Badge variant="secondary" className="text-xs">
                          {zone.unlockLevel}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-muted-foreground">Fish:</span>
                        <span className="font-medium">{zone.fishPool.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Zone Preview */}
                <div className={`h-12 rounded ${zone.background} mb-3 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex gap-1">
                      {zone.fishPool.slice(0, 3).map((fish, index) => (
                        <span key={fish.id} className="text-lg opacity-80 animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                          {unlocked ? fish.emoji : '❓'}
                        </span>
                      ))}
                      {zone.fishPool.length > 3 && (
                        <span className="text-sm text-white/60 self-center">+{zone.fishPool.length - 3}</span>
                      )}
                    </div>
                  </div>
                </div>

                {!current && (
                  <Button
                    onClick={() => onChangeZone(zone.id)}
                    disabled={!unlocked}
                    className="w-full"
                    variant={unlocked ? "default" : "secondary"}
                  >
                    {!unlocked 
                      ? `Requires Level ${zone.unlockLevel}`
                      : 'Travel Here'
                    }
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="mt-4 pt-4 border-t border-border">
          <div className="text-sm text-muted-foreground">
            💡 Unlock new zones by leveling up through fishing!
          </div>
        </div>
      </CardContent>
    </Card>
  );
};