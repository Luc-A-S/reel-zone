
interface FloatingFavoritesButtonProps {
  onClick: () => void;
}

const FloatingFavoritesButton = ({ onClick }: FloatingFavoritesButtonProps) => {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-40">
      <button
        onClick={onClick}
        className="glass-card w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center smooth-transition hover-glow press-effect animate-neon-pulse"
        aria-label="Ver favoritos"
      >
        <span className="text-2xl sm:text-3xl">💛</span>
      </button>
    </div>
  );
};

export default FloatingFavoritesButton;
