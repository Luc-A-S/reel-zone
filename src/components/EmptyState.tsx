
const EmptyState = () => {
  return (
    <div className="text-center py-16 px-4">
      <div className="glass-card p-8 rounded-3xl max-w-md mx-auto">
        <div className="text-6xl mb-4">😔</div>
        <h3 className="text-xl font-semibold mb-2">Sem conteúdo ainda</h3>
        <p className="text-muted-foreground">
          Quando houver conteúdo publicado, ele aparecerá aqui.
        </p>
      </div>
    </div>
  );
};

export default EmptyState;
