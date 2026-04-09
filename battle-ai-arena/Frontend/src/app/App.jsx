import { Header } from './components/Header';
import { Chat } from './components/Chat';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const { isDarkMode, toggleDarkMode } = useTheme();

  return (
    <div className="min-h-screen flex flex-col bg-surface font-sans selection:bg-primary-container selection:text-on-surface transition-colors duration-500">
      <Header isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      <Chat />
    </div>
  );
}