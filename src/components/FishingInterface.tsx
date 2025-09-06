import { useState, useEffect, useCallback } from 'react';
import { GameState, Fish } from '@/types/game';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card } from '@/components/ui/card';

interface FishingInterfaceProps {
  gameState: GameState;
  setGameState: (state: GameState | ((prev: GameState) => GameState)) => void;
  onFishCaught: (fish: Fish) => void;
  getRandomFish: (zone: string) => Fish | null;
}

export const FishingInterface = ({ 
  gameState, 
  setGameState, 
  onFishCaught, 
  getRandomFish 
}: FishingInterfaceProps) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showRipples, setShowRipples] = useState(false);
  const [minigameActive, setMinigameActive] = useState(false);
  const [targetPosition, setTargetPosition] = useState(50);
  const [playerPosition, setPlayerPosition] = useState(50);
  const [targetSpeed, setTargetSpeed] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5);
  const [currentFish, setCurrentFish] = useState<Fish | null>(null);

  const startFishing = useCallback(() => {
    if (gameState.isFishing) return;
    
    setGameState(prev => ({ ...prev, isFishing: true }));
    setIsAnimating(true);
    setShowRipples(true);
    
    // Use bait if available
    if (gameState.player.currentBait && gameState.player.currentBait.quantity > 0) {
      setGameState(prev => ({
        ...prev,
        player: {
          ...prev.player,
          currentBait: prev.player.currentBait ? {
            ...prev.player.currentBait,
            quantity: prev.player.currentBait.quantity - 1
          } : null,
        },
      }));
    }

    // Random delay before fish bites (1-4 seconds)
    const delay = Math.random() * 3000 + 1000;
    setTimeout(() => {
      const fish = getRandomFish(gameState.currentZone.id);
      if (fish) {
        setCurrentFish(fish);
        startMinigame(fish);
      } else {
        // No fish caught
        setGameState(prev => ({ ...prev, isFishing: false }));
        setIsAnimating(false);
        setShowRipples(false);
      }
    }, delay);
  }, [gameState.isFishing, gameState.player.currentBait, gameState.currentZone.id, getRandomFish, setGameState]);

  const startMinigame = (fish: Fish) => {
    setMinigameActive(true);
    setTargetPosition(Math.random() * 80 + 10);
    setPlayerPosition(50);
    setTargetSpeed(Math.max(0.5, fish.catchDifficulty / 5));
    setTimeLeft(5);
  };

  const endMinigame = (success: boolean) => {
    setMinigameActive(false);
    setGameState(prev => ({ ...prev, isFishing: false }));
    setIsAnimating(false);
    setShowRipples(false);
    
    if (success && currentFish) {
      onFishCaught(currentFish);
    }
    
    setCurrentFish(null);
  };

  // Minigame logic
  useEffect(() => {
    if (!minigameActive) return;

    const interval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0.1) {
          endMinigame(false);
          return 0;
        }
        return prevTime - 0.1;
      });

      setTargetPosition(prev => {
        let newPos = prev + (Math.random() - 0.5) * targetSpeed * 3;
        return Math.max(5, Math.min(95, newPos));
      });
    }, 100);

    return () => clearInterval(interval);
  }, [minigameActive, targetSpeed]);

  const handleMinigameClick = () => {
    if (!minigameActive) return;
    
    const distance = Math.abs(playerPosition - targetPosition);
    const successThreshold = 15; // pixels
    
    if (distance <= successThreshold) {
      endMinigame(true);
    } else {
      // Move player position towards target but don't end game
      setPlayerPosition(prev => {
        const direction = targetPosition > prev ? 1 : -1;
        return prev + direction * 5;
      });
    }
  };

  return (
    <div className="relative">
      {/* Zone Background */}
      <div 
        className={`h-96 rounded-lg ${gameState.currentZone.background} relative overflow-hidden transition-all duration-500`}
      >
        {/* Water Surface Effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20" />
        
        {/* Ripples */}
        {showRipples && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-4 h-4 rounded-full border-2 border-white/50 animate-ripple" />
            <div className="w-4 h-4 rounded-full border-2 border-white/30 animate-ripple animation-delay-500" />
            <div className="w-4 h-4 rounded-full border-2 border-white/20 animate-ripple animation-delay-1000" />
          </div>
        )}

        {/* Fishing Rod */}
        <div className="absolute bottom-4 right-8">
          <div 
            className={`text-6xl transform-gpu ${isAnimating ? 'animate-bob' : ''} transition-transform duration-300`}
          >
            {gameState.player.currentRod.emoji}
          </div>
        </div>

        {/* Zone Info */}
        <div className="absolute top-4 left-4">
          <Card className="p-3 bg-white/90 backdrop-blur-sm">
            <h3 className="font-bold text-ocean-deep">{gameState.currentZone.name}</h3>
            <p className="text-sm text-muted-foreground">{gameState.currentZone.description}</p>
          </Card>
        </div>

        {/* Current Rod & Bait Info */}
        <div className="absolute top-4 right-4">
          <Card className="p-3 bg-white/90 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <span>{gameState.player.currentRod.emoji}</span>
              <span className="font-medium">{gameState.player.currentRod.name}</span>
            </div>
            {gameState.player.currentBait && (
              <div className="flex items-center gap-2 text-sm mt-1">
                <span>{gameState.player.currentBait.emoji}</span>
                <span>{gameState.player.currentBait.name} ({gameState.player.currentBait.quantity})</span>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* Minigame Interface */}
      {minigameActive && (
        <div className="mt-4 p-4 bg-card rounded-lg border shadow-lg">
          <div className="text-center mb-4">
            <h3 className="text-lg font-bold">Fish on the line!</h3>
            <p className="text-sm text-muted-foreground">
              Click when the hook 🎣 is near the fish {currentFish?.emoji}!
            </p>
            <div className="text-sm font-medium mt-2">
              Time left: {timeLeft.toFixed(1)}s
            </div>
          </div>

          <div 
            className="relative h-16 bg-ocean-light/20 rounded-lg cursor-pointer border-2 border-ocean-medium/30"
            onClick={handleMinigameClick}
          >
            {/* Target Fish */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-100"
              style={{ left: `${targetPosition}%` }}
            >
              {currentFish?.emoji}
            </div>
            
            {/* Player Hook */}
            <div 
              className="absolute top-1/2 transform -translate-y-1/2 text-2xl transition-all duration-200"
              style={{ left: `${playerPosition}%` }}
            >
              🎣
            </div>
          </div>
          
          <Progress value={(5 - timeLeft) * 20} className="mt-2" />
        </div>
      )}

      {/* Fishing Controls */}
      <div className="mt-4 text-center">
        <Button
          onClick={startFishing}
          disabled={gameState.isFishing}
          size="lg"
          className="px-8 py-6 text-lg bg-ocean-medium hover:bg-ocean-deep text-white shadow-ocean"
        >
          {gameState.isFishing ? (
            <>
              <div className="animate-spin mr-2">⚪</div>
              Fishing...
            </>
          ) : (
            <>
              🎣 Cast Line
            </>
          )}
        </Button>
        
        {!gameState.player.currentBait && (
          <p className="text-sm text-muted-foreground mt-2">
            💡 Buy bait from the shop to increase your chances of catching rare fish!
          </p>
        )}
      </div>
    </div>
  );
};