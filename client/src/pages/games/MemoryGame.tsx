import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useSpeech } from "@/hooks/use-speech";
import VoiceDescription from "@/components/accessibility/VoiceDescription";
import { Bot, Brain, Trophy, Clock, ArrowLeft, Layers, Zap, Award } from "lucide-react";
import { Link } from "wouter";

// Kart simgeleri
const cardIcons = [
  Bot, Brain, Trophy, Clock, Zap, Award,
  // Daha fazla simge eklenebilir
];

// Oyun zorluk seviyeleri
enum GameDifficulty {
  EASY = "easy",
  MEDIUM = "medium",
  HARD = "hard"
}

interface DifficultyConfig {
  name: string;
  description: string;
  pairCount: number;
  timeLimit: number; // Saniye cinsinden
}

const difficultySettings: Record<GameDifficulty, DifficultyConfig> = {
  [GameDifficulty.EASY]: {
    name: "Kolay",
    description: "Başlangıç seviyesi",
    pairCount: 6,
    timeLimit: 120
  },
  [GameDifficulty.MEDIUM]: {
    name: "Orta",
    description: "Biraz zorlayıcı",
    pairCount: 8,
    timeLimit: 120
  },
  [GameDifficulty.HARD]: {
    name: "Zor",
    description: "Uzmanlara özel",
    pairCount: 12,
    timeLimit: 180
  }
};

// Kart arayüzü
interface MemoryCard {
  id: number;
  value: number;
  flipped: boolean;
  matched: boolean;
  icon: React.ElementType;
}

// Oyun sonucu
interface GameResult {
  difficulty: GameDifficulty;
  score: number;
  moves: number;
  timeSpent: number;
}

export default function MemoryGame() {
  const [difficulty, setDifficulty] = useState<GameDifficulty>(GameDifficulty.EASY);
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [congratsDialogOpen, setCongratsDialogOpen] = useState(false);
  const [difficultySelectOpen, setDifficultySelectOpen] = useState(true);
  const [gameResults, setGameResults] = useState<GameResult[]>([]);
  const { speak } = useSpeech();

  // Kartları oluştur ve karıştır
  const initializeGame = (selectedDifficulty: GameDifficulty) => {
    const config = difficultySettings[selectedDifficulty];
    const pairs = config.pairCount;
    const gameIcons = [...cardIcons].slice(0, pairs);
    
    // Eşleşen kart çiftleri oluştur
    let cardDeck: MemoryCard[] = [];
    let cardId = 0;
    
    for (let i = 0; i < pairs; i++) {
      const Icon = gameIcons[i];
      
      // Her simgeden iki kart (çift) oluştur
      cardDeck.push({
        id: cardId++,
        value: i,
        flipped: false,
        matched: false,
        icon: Icon
      });
      
      cardDeck.push({
        id: cardId++,
        value: i,
        flipped: false,
        matched: false,
        icon: Icon
      });
    }
    
    // Kartları karıştır
    for (let i = cardDeck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [cardDeck[i], cardDeck[j]] = [cardDeck[j], cardDeck[i]];
    }
    
    setCards(cardDeck);
    setFlippedCards([]);
    setMoves(0);
    setScore(0);
    setGameOver(false);
    setGameWon(false);
    setTimeRemaining(config.timeLimit);
    setGameStarted(true);
    setDifficultySelectOpen(false);
    
    speak(`${config.name} zorluk seviyesinde hafıza oyunu başladı. Eşleşen kartları bulun.`);
  };

  // Kart tıklama işlevi
  const handleCardClick = (cardId: number) => {
    // Eğer oyun bittiyse, kart zaten açıksa veya eşleştiyse işlem yapma
    const clickedCard = cards.find(card => card.id === cardId);
    
    if (
      gameOver || 
      !clickedCard || 
      clickedCard.flipped || 
      clickedCard.matched || 
      flippedCards.length >= 2
    ) {
      return;
    }
    
    // Kartı çevir
    const updatedCards = cards.map(card => 
      card.id === cardId ? { ...card, flipped: true } : card
    );
    
    const updatedFlippedCards = [...flippedCards, cardId];
    
    setCards(updatedCards);
    setFlippedCards(updatedFlippedCards);
    
    // Eğer iki kart çevrildiyse kontrol et
    if (updatedFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const firstCardId = updatedFlippedCards[0];
      const secondCardId = updatedFlippedCards[1];
      
      const firstCard = updatedCards.find(card => card.id === firstCardId);
      const secondCard = updatedCards.find(card => card.id === secondCardId);
      
      if (firstCard && secondCard && firstCard.value === secondCard.value) {
        // Eşleşme durumu
        setTimeout(() => {
          const matchedCards = updatedCards.map(card => 
            (card.id === firstCardId || card.id === secondCardId) 
              ? { ...card, matched: true } 
              : card
          );
          
          setCards(matchedCards);
          setFlippedCards([]);
          setScore(score + 10);
          
          // Tüm kartlar eşleşti mi kontrol et
          if (matchedCards.every(card => card.matched)) {
            const timeSpent = difficultySettings[difficulty].timeLimit - timeRemaining;
            const finalScore = calculateFinalScore(score, moves, timeSpent, difficulty);
            
            const gameResult: GameResult = {
              difficulty,
              score: finalScore,
              moves,
              timeSpent
            };
            
            setGameResults([...gameResults, gameResult]);
            setScore(finalScore);
            setGameWon(true);
            setGameOver(true);
            setCongratsDialogOpen(true);
            speak("Tebrikler! Tüm kartları eşleştirdiniz.");
          } else {
            speak("Eşleşme buldunuz!");
          }
        }, 1000);
      } else {
        // Eşleşmeyen kartları geri çevir
        setTimeout(() => {
          const flippedBackCards = updatedCards.map(card => 
            (card.id === firstCardId || card.id === secondCardId) 
              ? { ...card, flipped: false } 
              : card
          );
          
          setCards(flippedBackCards);
          setFlippedCards([]);
          speak("Eşleşme bulunamadı.");
        }, 1500);
      }
    }
  };

  // Final skor hesaplama
  const calculateFinalScore = (baseScore: number, moveCount: number, time: number, gameDifficulty: GameDifficulty) => {
    const difficultyBonus = 
      gameDifficulty === GameDifficulty.EASY ? 1 :
      gameDifficulty === GameDifficulty.MEDIUM ? 1.5 : 2;
    
    const timeBonus = Math.max(1, (difficultySettings[gameDifficulty].timeLimit / Math.max(time, 1)) * 0.5);
    const moveEfficiency = Math.max(0.5, 1 - (moveCount / (difficultySettings[gameDifficulty].pairCount * 2)) * 0.5);
    
    return Math.round(baseScore * difficultyBonus * timeBonus * moveEfficiency);
  };

  // Zamanlayıcı
  useEffect(() => {
    let timer: NodeJS.Timeout | null = null;
    
    if (gameStarted && !gameOver && timeRemaining > 0) {
      timer = setInterval(() => {
        setTimeRemaining(prevTime => {
          if (prevTime <= 1) {
            setGameOver(true);
            speak("Süre doldu! Oyun bitti.");
            clearInterval(timer as NodeJS.Timeout);
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [gameStarted, gameOver, timeRemaining, speak]);

  // Oyunu yeniden başlat
  const resetGame = () => {
    setCongratsDialogOpen(false);
    setDifficultySelectOpen(true);
    setGameStarted(false);
  };

  // Kart geri formatı
  const getCardBackContent = (card: MemoryCard) => {
    if (card.matched) {
      const Icon = card.icon;
      return <Icon className="w-8 h-8 opacity-30" />;
    }
    
    return <Layers className="w-8 h-8 text-[#1565C0]" />;
  };

  // Zaman formatı (mm:ss)
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  // Zorluk seviyesi kartlarını oluştur
  const renderDifficultyCards = () => {
    return Object.entries(difficultySettings).map(([key, config]) => (
      <Card 
        key={key} 
        className="cursor-pointer hover:border-[#1565C0] transition-all"
        onClick={() => initializeGame(key as GameDifficulty)}
      >
        <CardHeader>
          <CardTitle className="flex items-center">
            {key === GameDifficulty.EASY && <Bot className="w-5 h-5 mr-2 text-green-500" />}
            {key === GameDifficulty.MEDIUM && <Zap className="w-5 h-5 mr-2 text-amber-500" />}
            {key === GameDifficulty.HARD && <Brain className="w-5 h-5 mr-2 text-red-500" />}
            {config.name}
          </CardTitle>
          <CardDescription>{config.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center">
              <Layers className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{config.pairCount} çift kart</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-4 h-4 mr-2 text-muted-foreground" />
              <span>{formatTime(config.timeLimit)} süre</span>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full bg-[#1565C0] hover:bg-[#0D47A1]">
            Oyna
          </Button>
        </CardFooter>
      </Card>
    ));
  };

  // Son oyun sonuçlarını göster
  const renderGameResults = () => {
    if (gameResults.length === 0) return null;
    
    return (
      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-2">Son Oyunlarınız</h3>
        <div className="space-y-2">
          {gameResults.slice(-3).map((result, index) => (
            <div key={index} className="bg-muted/30 p-3 rounded-md">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-[#1565C0]" />
                  <span className="font-medium">
                    {difficultySettings[result.difficulty].name}
                  </span>
                </div>
                <Badge variant="outline" className="bg-[#1565C0] text-white">
                  {result.score} puan
                </Badge>
              </div>
              <div className="text-sm text-muted-foreground mt-1">
                {result.moves} hamle • {formatTime(result.timeSpent)} süre
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link href="/">
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Hafıza Oyunu</h1>
      </div>
      
      {/* Zorluk seviyesi seçimi */}
      <Dialog open={difficultySelectOpen} onOpenChange={setDifficultySelectOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="text-xl">Zorluk Seviyesi Seçin</DialogTitle>
            <DialogDescription>
              Hafızanızı test etmek için bir zorluk seviyesi seçin. Kartları açarak eşleştirmeye çalışın.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4">
            {renderDifficultyCards()}
          </div>
          
          {renderGameResults()}
        </DialogContent>
      </Dialog>
      
      {/* Oyun alanı */}
      {gameStarted && (
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-4">
              <Badge variant="outline" className="text-base py-1 px-3">
                <Trophy className="w-4 h-4 mr-2" />
                {score} puan
              </Badge>
              <Badge variant="outline" className="text-base py-1 px-3">
                <Zap className="w-4 h-4 mr-2" />
                {moves} hamle
              </Badge>
            </div>
            <Badge 
              variant="outline" 
              className={`text-base py-1 px-3 ${
                timeRemaining < 20 ? "bg-red-100 text-red-700" : ""
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              {formatTime(timeRemaining)}
            </Badge>
          </div>
          
          <VoiceDescription
            description={`Hafıza oyunu. Zorluk seviyesi: ${difficultySettings[difficulty].name}. 
                         Toplam puan: ${score}. Hamle sayısı: ${moves}. 
                         Kalan süre: ${formatTime(timeRemaining)}.`}
            buttonPosition="top-right"
            showOnHover={false}
          >
            <div 
              className={`grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3`}
            >
              {cards.map(card => (
                <div 
                  key={card.id}
                  onClick={() => handleCardClick(card.id)}
                  className={`
                    aspect-square rounded-lg 
                    transition-all duration-300 transform 
                    ${card.flipped || card.matched ? 'rotate-y-180' : ''}
                    ${gameOver ? 'opacity-70' : ''}
                    ${!card.matched && !card.flipped ? 'hover:scale-105 cursor-pointer' : ''}
                  `}
                >
                  <div className="relative w-full h-full">
                    {/* Kart ön yüzü (simge) */}
                    <div 
                      className={`
                        absolute inset-0 flex items-center justify-center
                        bg-white shadow-md rounded-lg border border-slate-200
                        backface-hidden ${card.flipped || card.matched ? 'rotate-y-180' : 'rotate-y-0'}
                      `}
                    >
                      {getCardBackContent(card)}
                    </div>
                    
                    {/* Kart arka yüzü */}
                    <div 
                      className={`
                        absolute inset-0 flex items-center justify-center
                        bg-[#1565C0] text-white shadow-md rounded-lg
                        backface-hidden ${card.flipped || card.matched ? 'rotate-y-0' : 'rotate-y-180'}
                      `}
                    >
                      {card.icon && <card.icon className="w-8 h-8" />}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </VoiceDescription>
        </div>
      )}
      
      {/* Yeni oyun butonu */}
      {gameStarted && (
        <div className="flex justify-center">
          <Button 
            variant="outline" 
            onClick={resetGame}
            className="mt-4"
          >
            Yeni Oyun
          </Button>
        </div>
      )}
      
      {/* Tebrikler diyaloğu */}
      <Dialog open={congratsDialogOpen} onOpenChange={setCongratsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl flex items-center">
              <Trophy className="w-6 h-6 mr-2 text-amber-500" />
              Tebrikler!
            </DialogTitle>
            <DialogDescription>
              Tüm kartları başarıyla eşleştirdiniz.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="bg-muted/30 p-4 rounded-lg mb-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-sm text-muted-foreground">Zorluk</div>
                  <div className="font-medium">{difficultySettings[difficulty].name}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Puan</div>
                  <div className="font-medium">{score}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Hamle</div>
                  <div className="font-medium">{moves}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Süre</div>
                  <div className="font-medium">
                    {formatTime(difficultySettings[difficulty].timeLimit - timeRemaining)}
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button onClick={resetGame} className="bg-[#1565C0] hover:bg-[#0D47A1]">
              Yeni Oyun
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}