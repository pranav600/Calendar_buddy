import React from 'react';

export function SpiralBinding() {
  const rings = Array.from({ length: 14 });

  return (
    <div className="flex justify-between items-end px-4 sm:px-8 w-full h-16 absolute -top-6 left-0 z-20 pointer-events-none">
      {rings.map((_, i) => (
        <div key={i} className="flex flex-col items-center relative h-full w-8">
           {/* Back Ring (Behind Paper) */}
           <div className="absolute bottom-2 w-3.5 h-12 bg-gray-800 rounded-full z-0 transform -translate-y-2 opacity-80" />
           
           {/* The Paper Hole Shadow/Punch (On Top of Paper but Behind Front Ring) */}
           <div className="absolute bottom-1 w-5 h-5 rounded-full bg-[#2a2a2a] shadow-[inset_0_2px_4px_rgba(0,0,0,1)] z-10 box-border border-[3px] border-[#3e342b]/10" />

           {/* Front Ring (Metallic Loop) */}
           {/* It should look like it comes from top and curves into the hole */}
           <div 
             className="absolute -top-1 w-3.5 h-14 rounded-full z-20"
             style={{
               background: 'linear-gradient(90deg, #6b7280 0%, #d1d5db 20%, #f3f4f6 50%, #9ca3af 80%, #4b5563 100%)',
               boxShadow: '-1px 2px 4px rgba(0,0,0,0.4)',
               clipPath: 'polygon(0 0, 100% 0, 100% 85%, 0 85%)' // Cut off bottom so it looks like it enters hole
             }}
           />
        </div>
      ))}
    </div>
  );
}
