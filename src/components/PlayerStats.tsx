import { PlayerStats as PlayerStatsType } from '@/types/game';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface PlayerStatsProps {
  player: PlayerStatsType;
}

export const PlayerStats = ({ player }: PlayerStatsProps) => {
  return (
    <Card className="shadow-ocean border-ocean-light/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-ocean-deep">
          👤 Player Stats
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Level {player.level}</span>
            <span className="text-sm text-muted-foreground">
              {player.xp} / {player.xp + player.xpToNextLevel} XP
            </span>
          </div>
          <Progress 
            value={(player.xp / (player.xp + player.xpToNextLevel)) * 100} 
            className="h-2"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-accent">💰</span>
            <div>
              <div className="font-medium">{player.coins.toLocaleString()}</div>
              <div className="text-muted-foreground">Coins</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-rarity-common">🐟</span>
            <div>
              <div className="font-medium">{player.fishCaught}</div>
              <div className="text-muted-foreground">Fish Caught</div>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Value:</span>
              <span className="font-medium text-accent">
                💰 {player.totalValue.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="text-sm">
            <div className="font-medium mb-1">Current Gear:</div>
            <div className="flex items-center gap-2 text-ocean-medium">
              <span>{player.currentRod.emoji}</span>
              <span>{player.currentRod.name}</span>
            </div>
            {player.currentBait && (
              <div className="flex items-center gap-2 text-rarity-uncommon mt-1">
                <span>{player.currentBait.emoji}</span>
                <span>{player.currentBait.name} ({player.currentBait.quantity})</span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};