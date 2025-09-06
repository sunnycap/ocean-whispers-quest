import { FishingGame } from '@/components/FishingGame';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="bg-ocean-gradient text-white shadow-ocean">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-2">🎣 Ocean Fisher</h1>
            <p className="text-ocean-foam text-lg">
              Cast your line and discover the mysteries of the deep!
            </p>
          </div>
        </div>
      </header>
      
      <main>
        <FishingGame />
      </main>
      
      <footer className="bg-ocean-deep text-white mt-12">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-ocean-foam">
            🌊 Dive into the ultimate fishing adventure • Catch rare fish • Level up your gear
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
