import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TrashIcon } from '@heroicons/react/24/outline';

interface DraggableStickyNoteProps {
  id: string;
  initialX: number;
  initialY: number;
  initialContent: string;
  initialColor: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onUpdateContent: (id: string, content: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onUpdateColor: (id: string, color: string) => void;
  onDelete: (id: string) => void;
}

export function DraggableStickyNote({
  id,
  initialX,
  initialY,
  initialContent,
  initialColor,
  containerRef,
  onUpdateContent,
  onUpdatePosition,
  onUpdateColor,
  onDelete
}: DraggableStickyNoteProps) {
  const [content, setContent] = useState(initialContent);
  const [color, setColor] = useState(initialColor);
  const noteRef = useRef<HTMLDivElement>(null);

  const colors = [
    'bg-yellow-200',
    'bg-blue-200',
    'bg-green-200',
    'bg-pink-200',
    'bg-purple-200',
    'bg-orange-200'
  ];

  return (
    <motion.div
      ref={noteRef}
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      initial={{ x: initialX, y: initialY, scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      whileHover={{ scale: 1.02 }}
      whileDrag={{ scale: 1.1, rotate: 2, zIndex: 100 }}
      onDragEnd={() => {
        if (noteRef.current && containerRef.current) {
          const noteRect = noteRef.current.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          
          const relativeX = noteRect.left - containerRect.left;
          const relativeY = noteRect.top - containerRect.top;
          
          onUpdatePosition(id, relativeX, relativeY);
        }
      }}
      className={`absolute w-64 h-64 p-4 shadow-xl ${color} rounded-sm flex flex-col group cursor-move`}
      style={{ 
        boxShadow: "5px 5px 15px rgba(0,0,0,0.2)"
      }}
    >
      {/* Delete Button (visible on hover) */}
      {/* Color Picker (visible on hover) - Positioned vertically on the left */}
      <div 
        className="absolute top-0 -left-6 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity z-20 py-2 cursor-default"
        onPointerDown={(e) => e.stopPropagation()}
      >
        {colors.map((c) => (
          <button
            key={c}
            onClick={(e) => {
              e.stopPropagation();
              setColor(c);
              onUpdateColor(id, c);
            }}
            className={`w-4 h-4 rounded-full border border-gray-300 shadow-sm ${c} hover:scale-125 transition-transform cursor-pointer`}
          />
        ))}
      </div>

      {/* Delete Button (visible on hover) */}
      <button
        onClick={(e) => {
             e.stopPropagation();
             onDelete(id);
        }}
        className="absolute top-2 right-2 p-1 rounded-full bg-white/50 hover:bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity text-gray-700"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      {/* Content Area */}
      <textarea
        value={content}
        onChange={(e) => {
          setContent(e.target.value);
          onUpdateContent(id, e.target.value);
        }}
        onPointerDown={(e) => e.stopPropagation()} // Allow typing without dragging
        className="w-full h-full bg-transparent border-none resize-none focus:ring-0 focus:outline-none font-mono text-gray-800 text-lg leading-relaxed"
        placeholder="Type here..."
      />
    </motion.div>
  );
}
