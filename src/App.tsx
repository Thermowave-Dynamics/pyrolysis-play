import { GameContainer } from './features/GameContainer';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <>
      <GameContainer />
      <Toaster position="top-center" theme="dark" />
    </>
  );
}

export default App;
