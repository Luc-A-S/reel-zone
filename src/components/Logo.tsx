
const Logo = () => {
  return (
    <div className="flex items-center gap-3">
      <div className="relative">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
          <div className="w-0 h-0 border-l-[8px] border-l-black border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-0.5"></div>
        </div>
        <div className="absolute inset-0 w-10 h-10 rounded-full bg-primary/20 animate-neon-pulse"></div>
      </div>
      <div>
        <h1 className="text-xl font-bold text-foreground">
          Reel<span className="neon-text">Zone</span>
        </h1>
        <p className="text-xs text-muted-foreground font-medium">Plataforma de Conteúdo</p>
      </div>
    </div>
  );
};

export default Logo;
