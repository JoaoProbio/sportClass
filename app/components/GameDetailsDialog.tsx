'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dotted-dialog';
import { Button } from '@/components/ui/button';
import { Construction } from 'lucide-react';

interface Game {
  id: number;
  team1: string;
  team2: string;
  sport: string;
  time: string;
  status: 'live' | 'finished' | 'upcoming' | 'postponed';
  score?: string;
  court: string;
}

interface GameDetailsDialogProps {
  game: Game | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function GameDetailsDialog({ game, isOpen, onClose }: GameDetailsDialogProps) {
  if (!game) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[90vw] max-w-[400px] mx-auto p-4 sm:p-6">
        <DialogHeader className="text-center">
          <DialogTitle className="text-lg sm:text-xl font-bold text-white mb-2">
            Em Construção
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-white mb-4">
            Esta funcionalidade está sendo desenvolvida e estará disponível em breve.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
} 