
const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <span className="text-black font-bold text-lg">R</span>
        </div>
        <div className="absolute inset-0 w-10 h-10 rounded-xl bg-primary/20 animate-neon-pulse"></div>
      </div>
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Reel<span className="neon-text">Zone</span>
        </h1>
        <p className="text-xs text-muted-foreground font-medium">Content Platform</p>
      </div>
    </div>
  );
};

export default Logo;
