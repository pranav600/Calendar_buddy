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
  color?: string;
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
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Sanitize incoming data to ensure all stickies have unique IDs
    // This handles cases where backend might return empty IDs causing duplicate key errors
    const sanitizedStickies = (initialData.stickies || []).map(s => ({
        ...s,
        id: s.id || `sticky-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    }));

    setData({
        ...initialData,
        stickies: sanitizedStickies
    });
  }, [initialData]);

  const handleAddSticky = () => {
    let initialX = 100;
    let initialY = 100;

    if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        // Center the note (note is w-64 = 16rem = 256px)
        // We'll add some randomness so they don't stack perfectly
        initialX = (clientWidth / 2) - 128 + (Math.random() * 40 - 20);
        initialY = (clientHeight / 2) - 128 + (Math.random() * 40 - 20);
    }

    const newSticky: StickyNoteItem = {
      // Use a more robust ID generation combining timestamp and random string
      id: `sticky-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      x: initialX,
      y: initialY,
      content: '',
      color: 'bg-yellow-200'
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

  const handleUpdateStickyColor = (id: string, color: string) => {
    setData(prev => ({
      ...prev,
      stickies: prev.stickies.map(s => s.id === id ? { ...s, color } : s)
    }));
  };

  const handleDeleteSticky = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = () => {
    if (itemToDelete) {
        setData(prev => ({
            ...prev,
            stickies: prev.stickies.filter(s => s.id !== itemToDelete)
        }));
        setItemToDelete(null);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && selectedDate && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed inset-0 z-50 bg-gray-50 dark:bg-gray-900 flex flex-col font-mono"
        >
             {/* Header */}
             <motion.div 
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm z-10"
             >
                <h2 className="text-2xl font-mono text-gray-800 dark:text-white">
                    {format(selectedDate, "EEEE, MMM d.yyyy")}
                </h2>
                <div className="flex gap-4">
                     <motion.button 
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => onSave(data)}
                        className="px-6 py-2 font-mono bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors shadow-sm"
                     >
                        Save
                     </motion.button>
                    <motion.button 
                        whileHover={{ rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </motion.button>
                </div>
             </motion.div>

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
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleAddSticky}
                    className="absolute font-mono top-6 left-6 z-20 flex items-center gap-2 px-5 py-3 bg-yellow-400 hover:bg-yellow-500 text-yellow-950 rounded-full shadow-lg font-bold transition-all"
                >
                    <PlusIcon className="w-5 h-5" />
                    Add Sticky Note
                </motion.button>

                {/* Stickies */}
                <AnimatePresence>
                    {data.stickies.map(sticky => (
                        <DraggableStickyNote
                            key={sticky.id}
                            id={sticky.id}
                            initialX={sticky.x}
                            initialY={sticky.y}
                            initialContent={sticky.content}
                            initialColor={sticky.color || 'bg-yellow-200'}
                            containerRef={containerRef}
                            onUpdateContent={handleUpdateStickyContent}
                            onUpdatePosition={handleUpdateStickyPosition}
                            onUpdateColor={handleUpdateStickyColor}
                            onDelete={handleDeleteSticky}
                        />
                    ))}
                </AnimatePresence>
             </div>

             {/* Bottom Notes Area */}
             <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="h-[30vh] border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 flex flex-col shadow-[0_-5px_15px_rgba(0,0,0,0.05)] z-10"
             >
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
             </motion.div>

             {/* Delete Confirmation Modal */}
             {itemToDelete && (
                 <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
                     <motion.div
                         initial={{ scale: 0.9, opacity: 0 }}
                         animate={{ scale: 1, opacity: 1 }}
                         exit={{ scale: 0.9, opacity: 0 }}
                         className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-sm w-full border border-gray-200 dark:border-gray-700"
                     >
                         <h3 className="text-lg font-mono font-bold text-gray-900 dark:text-white mb-2">Delete Note !</h3>
                         <p className="text-gray-600 font-mono dark:text-gray-300 mb-6">Are you sure you want to delete this sticky note ?</p>
                         <div className="flex justify-end gap-3">
                             <button
                                 onClick={() => setItemToDelete(null)}
                                 className="px-4 py-2 font-mono text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors font-medium"
                             >
                                 Cancel
                             </button>
                             <button
                                 onClick={confirmDelete}
                                 className="px-4 py-2 font-mono bg-red-500 hover:bg-red-600 text-white rounded-lg shadow-sm transition-colors font-medium"
                             >
                                 Delete
                             </button>
                         </div>
                     </motion.div>
                 </div>
             )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
