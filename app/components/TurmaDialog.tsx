'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dotted-dialog';
import { Users, GraduationCap, Calendar } from 'lucide-react';

interface TurmaDialogProps {
  turmaName: string;
  turmaColor?: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function TurmaDialog({ turmaName, turmaColor = '#3b82f6', isOpen, onClose }: TurmaDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px]">
        <DialogHeader>
          <div className="flex items-center justify-center mb-4">
            <Users className="w-12 h-12 text-blue-500" />
          </div>
          <DialogTitle className="text-xl font-bold text-white text-center mb-2">
            Detalhes da Turma
          </DialogTitle>
          <DialogDescription className="text-gray-300 text-center mb-2">
            Informações sobre a turma selecionada
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: turmaColor }}></div>
            <div>
              <p className="text-sm font-medium text-white">Turma</p>
              <p className="text-sm text-gray-300">{turmaName}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg border border-gray-700">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <div>
              <p className="text-sm font-medium text-white">Status</p>
              <p className="text-sm text-gray-300">Em desenvolvimento</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 