import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface DraggableStickyNoteProps {
  id: string;
  initialX: number;
  initialY: number;
  initialContent: string;
  containerRef: React.RefObject<HTMLDivElement>;
  onUpdateContent: (id: string, content: string) => void;
  onUpdatePosition: (id: string, x: number, y: number) => void;
  onDelete: (id: string) => void;
}

export function DraggableStickyNote({
  id,
  initialX,
  initialY,
  initialContent,
  containerRef,
  onUpdateContent,
  onUpdatePosition,
  onDelete
}: DraggableStickyNoteProps) {
  const [content, setContent] = useState(initialContent);
  const noteRef = useRef<HTMLDivElement>(null);

  return (
    <motion.div
      ref={noteRef}
      drag
      dragConstraints={containerRef}
      dragMomentum={false}
      initial={{ x: initialX, y: initialY, scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      onDragEnd={() => {
        if (noteRef.current && containerRef.current) {
          const noteRect = noteRef.current.getBoundingClientRect();
          const containerRect = containerRef.current.getBoundingClientRect();
          
          const relativeX = noteRect.left - containerRect.left;
          const relativeY = noteRect.top - containerRect.top;
          
          onUpdatePosition(id, relativeX, relativeY);
        }
      }}
      className="absolute w-64 h-64 p-4 shadow-xl bg-yellow-200 rounded-sm flex flex-col group cursor-move"
      style={{ 
        boxShadow: "5px 5px 15px rgba(0,0,0,0.2)"
      }}
    >
      {/* Delete Button (visible on hover) */}
      <button
        onClick={(e) => {
             e.stopPropagation();
             onDelete(id);
        }}
        className="absolute top-2 right-2 p-1 rounded-full bg-yellow-300 hover:bg-yellow-400 opacity-0 group-hover:opacity-100 transition-opacity text-yellow-800"
      >
        <XMarkIcon className="w-4 h-4" />
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
