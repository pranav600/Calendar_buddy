import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { DraggableStickyNote } from './DraggableStickyNote';

export type StickyNoteItem = {
  id: string;
  x: number;
  y: number;
  content: string;
};

export type DayWorkspaceData = {
  note: string;
  stickies: StickyNoteItem[];
};

interface WhiteboardWorkspaceProps {
  isOpen: boolean;
  selectedDate: Date | null;
  initialData: DayWorkspaceData;
  onClose: () => void;
  onSave: (data: DayWorkspaceData) => void;
}

export function WhiteboardWorkspace({
  isOpen,
  selectedDate,
  initialData,
  onClose,
  onSave
}: WhiteboardWorkspaceProps) {
  const [data, setData] = useState<DayWorkspaceData>(initialData);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  const handleAddSticky = () => {
    const newSticky: StickyNoteItem = {
      id: Date.now().toString(),
      x: 50 + Math.random() * 100,
      y: 50 + Math.random() * 100,
      content: '',
    };
    setData(prev => ({
      ...prev,
      stickies: [...prev.stickies, newSticky]
    }));
  };

  const handleUpdateStickyContent = (id: string, content: string) => {
    setData(prev => ({
      ...prev,
      stickies: prev.stickies.map(s => s.id === id ? { ...s, content } : s)
    }));
  };

  const handleUpdateStickyPosition = (id: string, x: number, y: number) => {
    setData(prev => ({
      ...prev,
      stickies: prev.stickies.map(s => s.id === id ? { ...s, x, y } : s)
    }));
  };

  const handleDeleteSticky = (id: string) => {
    setData(prev => ({
      ...prev,
      stickies: prev.stickies.filter(s => s.id !== id)
    }));
  };

  return (
    <AnimatePresence>
      {isOpen && selectedDate && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col font-sans"
        >
             {/* Header */}
             <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm z-10">
                <h2 className="text-2xl font-mono text-gray-800 dark:text-white">
                    {format(selectedDate, "EEEE, MMM d.yyyy")}
                </h2>
                <div className="flex gap-4">
                     <button 
                        onClick={() => onSave(data)}
                        className="px-6 py-2 font-mono bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                     >
                        Save & Close
                     </button>
                    <button 
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>
             </div>

             {/* Whiteboard Area */}
             <div className="flex-1 relative overflow-hidden" ref={containerRef}>
                {/* Dot Grid Pattern */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ 
                         backgroundImage: 'radial-gradient(circle, #888 1px, transparent 1px)', 
                         backgroundSize: '24px 24px' 
                     }} 
                />

                {/* Floating Add Button */}
                <button
                    onClick={handleAddSticky}
                    className="absolute font-mono top-6 left-6 z-20 flex items-center gap-2 px-5 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 rounded-full shadow-lg font-bold transition-all hover:scale-105 active:scale-95"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Sticky Note
                </button>

                {/* Stickies */}
                {data.stickies.map(sticky => (
                    <DraggableStickyNote
                        key={sticky.id}
                        id={sticky.id}
                        initialX={sticky.x}
                        initialY={sticky.y}
                        initialContent={sticky.content}
                        containerRef={containerRef}
                        onUpdateContent={handleUpdateStickyContent}
                        onUpdatePosition={handleUpdateStickyPosition}
                        onDelete={handleDeleteSticky}
                    />
                ))}
             </div>

             {/* Bottom Notes Area */}
             <div className="h-[30vh] border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex flex-col shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-10">
                <div className="max-w-4xl mx-auto w-full h-full flex flex-col">
                    <h3 className="text-lg font-mono text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        Daily Notes
                    </h3>
                    <textarea
                        value={data.note}
                        onChange={(e) => setData(prev => ({ ...prev, note: e.target.value }))}
                        placeholder="Write your detailed daily journal, tasks, or reflections here..."
                        className="flex-1 font-mono w-full p-4 bg-gray-50 dark:bg-gray-800 border-none rounded-xl resize-none focus:ring-2 focus:ring-blue-500/20 text-gray-700 dark:text-gray-200"
                    />
                </div>
             </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
