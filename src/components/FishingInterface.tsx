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
  const [fishPosition, setFishPosition] = useState(0);
  const [rodPosition] = useState(75); // Fixed rod position
  const [fishSpeed, setFishSpeed] = useState(1);
  const [timeLeft, setTimeLeft] = useState(5);
  const [currentFish, setCurrentFish] = useState<Fish | null>(null);
  const [clicksRequired, setClicksRequired] = useState(1);
  const [clicksMade, setClicksMade] = useState(0);
  const [fishDirection, setFishDirection] = useState(1); // 1 for right, -1 for left

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
    setFishPosition(0);
    setFishDirection(1);
    
    // Set fish speed based on difficulty (faster = harder)
    const baseSpeed = 0.8;
    const speedMultiplier = 1 + (fish.catchDifficulty / 10);
    setFishSpeed(baseSpeed * speedMultiplier);
    
    // Set clicks required based on rarity
    const clickRequirements = {
      common: 1,
      uncommon: 2,
      rare: 3,
      epic: 4,
      legendary: 5,
      mythical: 6,
    };
    setClicksRequired(clickRequirements[fish.rarity]);
    setClicksMade(0);
    
    // Set time based on difficulty
    const baseTime = 8;
    const timeReduction = fish.catchDifficulty / 4;
    setTimeLeft(Math.max(4, baseTime - timeReduction));
  };

  const endMinigame = useCallback((success: boolean) => {
    setMinigameActive(false);
    setIsAnimating(false);
    setShowRipples(false);
    setCurrentFish(null);
    
    // Use setTimeout to prevent React state update warning
    setTimeout(() => {
      setGameState(prev => ({ ...prev, isFishing: false }));
      if (success && currentFish) {
        onFishCaught(currentFish);
      }
    }, 0);
  }, [currentFish, onFishCaught, setGameState]);

  // Fish movement animation
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

      setFishPosition(prev => {
        let newPos = prev + (fishSpeed * fishDirection);
        
        // Bounce off edges
        if (newPos >= 95) {
          setFishDirection(-1);
          newPos = 95;
        } else if (newPos <= 5) {
          setFishDirection(1);
          newPos = 5;
        }
        
        return newPos;
      });
    }, 50); // Smoother animation with 50ms intervals

    return () => clearInterval(interval);
  }, [minigameActive, fishSpeed, fishDirection]);

  const handleMinigameClick = () => {
    if (!minigameActive || !currentFish) return;
    
    const distance = Math.abs(fishPosition - rodPosition);
    const successThreshold = 8; // Fixed threshold for rod alignment
    
    console.log(`Click! Fish pos: ${fishPosition.toFixed(1)}, Rod pos: ${rodPosition}, Distance: ${distance.toFixed(1)}`);
    
    if (distance <= successThreshold) {
      const newClicksMade = clicksMade + 1;
      setClicksMade(newClicksMade);
      
      console.log(`Hit! Clicks: ${newClicksMade}/${clicksRequired}`);
      
      // Visual feedback for successful click
      setFishSpeed(prev => prev * 0.8); // Slow down fish after each hit
      
      if (newClicksMade >= clicksRequired) {
        console.log('Fish caught!');
        endMinigame(true);
      } else {
        // Flash effect or bounce fish for partial success
        setFishDirection(prev => -prev); // Reverse direction
      }
    } else {
      console.log('Miss! Fish not aligned with rod.');
      // Speed up fish slightly as penalty
      setFishSpeed(prev => Math.min(prev * 1.1, 3));
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

        {/* Fishing Rod - Fixed Position */}
        <div className="absolute bottom-4 right-8">
          <div 
            className={`text-6xl transform-gpu ${isAnimating ? 'animate-bob' : ''} transition-transform duration-300`}
          >
            {gameState.player.currentRod.emoji}
          </div>
          {/* Rod Line Indicator */}
          <div 
            className="absolute top-8 left-1/2 w-0.5 h-32 bg-amber-600/60 transform -translate-x-1/2"
            style={{ left: `${rodPosition - 45}%` }}
          />
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
            <h3 className="text-lg font-bold">🎣 {currentFish?.name} swimming by!</h3>
            <p className="text-sm text-muted-foreground">
              Click when the fish {currentFish?.emoji} crosses your fishing line!
            </p>
            <div className="flex justify-between text-sm font-medium mt-2">
              <span>Time: {timeLeft.toFixed(1)}s</span>
              <span className={`${currentFish?.rarity === 'common' ? 'text-rarity-common' : 
                currentFish?.rarity === 'uncommon' ? 'text-rarity-uncommon' :
                currentFish?.rarity === 'rare' ? 'text-rarity-rare' :
                currentFish?.rarity === 'epic' ? 'text-rarity-epic' :
                currentFish?.rarity === 'legendary' ? 'text-rarity-legendary' :
                'text-rarity-mythical'}`}>
                {currentFish?.rarity?.toUpperCase()}
              </span>
            </div>
            <div className="text-sm text-center mt-2">
              <span className="px-2 py-1 bg-primary/10 rounded-full">
                Clicks: {clicksMade}/{clicksRequired} 
                {clicksRequired > 1 && ' 🎯'}
              </span>
            </div>
          </div>

          <div 
            className="relative h-24 bg-ocean-light/20 rounded-lg cursor-pointer border-2 border-ocean-medium/30 hover:bg-ocean-light/30 transition-colors overflow-hidden"
            onClick={handleMinigameClick}
          >
            {/* Fishing Line Indicator */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-amber-600/80 border-x border-amber-700/60"
              style={{ left: `${rodPosition}%` }}
            />
            <div 
              className="absolute top-0 bottom-0 w-6 bg-rarity-common/20 border-x-2 border-rarity-common/40"
              style={{ left: `${rodPosition - 3}%` }}
            />
            
            {/* Swimming Fish */}
            <div 
              className={`absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl transition-all duration-75 ${
                Math.abs(fishPosition - rodPosition) <= 8 ? 'animate-bounce' : 'animate-float'
              } ${fishDirection === 1 ? '' : 'scale-x-[-1]'}`}
              style={{ 
                left: `${fishPosition}%`,
                filter: clicksMade > 0 ? `hue-rotate(${clicksMade * 30}deg) brightness(1.2)` : 'none'
              }}
            >
              {currentFish?.emoji}
            </div>
            
            {/* Success indicator when fish is near line */}
            {Math.abs(fishPosition - rodPosition) <= 8 && (
              <div 
                className="absolute top-1 left-1/2 transform -translate-x-1/2 text-rarity-common font-bold animate-pulse"
              >
                CLICK NOW! 🎯
              </div>
            )}
            
            {/* Instructions */}
            <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">
              Click when fish crosses the yellow line!
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