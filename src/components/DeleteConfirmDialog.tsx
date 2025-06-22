
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Trash2, AlertTriangle } from 'lucide-react';

interface DeleteConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  itemName?: string;
}

const DeleteConfirmDialog = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  itemName = "este item" 
}: DeleteConfirmDialogProps) => {
  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent className="glass-modal border-destructive/20 max-w-md">
        <AlertDialogHeader className="text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center animate-scale-in">
            <div className="w-12 h-12 rounded-full bg-destructive/20 flex items-center justify-center animate-neon-pulse">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
          </div>
          
          <AlertDialogTitle className="text-xl font-bold text-foreground">
            Confirmar Exclusão
          </AlertDialogTitle>
          
          <AlertDialogDescription className="text-muted-foreground text-base leading-relaxed">
            Tem certeza que deseja excluir{' '}
            <span className="font-semibold text-primary neon-text">
              "{title}"
            </span>
            ?
            <br />
            <span className="text-sm text-destructive/80 mt-2 block">
              Esta ação não pode ser desfeita.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <AlertDialogFooter className="gap-3 sm:gap-3">
          <AlertDialogCancel 
            onClick={onClose}
            className="glass-card border-border/50 hover:bg-muted/50 smooth-transition press-effect flex-1"
          >
            Cancelar
          </AlertDialogCancel>
          
          <AlertDialogAction
            onClick={onConfirm}
            className="bg-destructive/90 hover:bg-destructive text-destructive-foreground hover-glow smooth-transition press-effect flex-1 gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteConfirmDialog;
