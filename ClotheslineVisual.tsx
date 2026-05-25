import React from "react";
import { motion } from "motion/react";

interface ClotheslineVisualProps {
  statusJemuran: "masuk" | "keluar" | "move-in" | "move-out";
}

export default function ClotheslineVisual({ statusJemuran }: ClotheslineVisualProps) {
  // Determine physical displacement of clothes
  // "keluar" = extended to the right (under the sun)
  // "masuk" = retracted to the left (under the house roof/indoor shelter)
  const isExtended = statusJemuran === "keluar" || statusJemuran === "move-out";
  const isMoving = statusJemuran === "move-in" || statusJemuran === "move-out";

  return (
    <div id="clothesline_svg_container" className="relative w-full h-[180px] bg-[#0c0a1a] border border-[#211b3b] rounded-lg overflow-hidden flex flex-col justify-between p-3 select-none">
      
      {/* Background Skies, Stars or glowing Sun */}
      <div className="absolute inset-0 pointer-events-none">
        
        {/* Sun/Moon Glow element on the upper right side matching screenshot */}
        <div className="absolute top-4 right-12 w-10 h-10 rounded-full bg-amber-400/20 blur-md flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-[#ffb300]" />
        </div>

        {/* Small soft cloud or stars */}
        <div className="absolute top-6 left-16 w-8 h-2 bg-slate-700/25 rounded-full blur-xs" />
        <div className="absolute top-10 left-8 w-14 h-3 bg-slate-700/20 rounded-full blur-sm" />
      </div>

      {/* INDOOR SHELTER / HOUSE OVERLAY ON THE LEFT SIDE */}
      <div className="absolute left-0 top-0 bottom-0 w-[80px] bg-gradient-to-r from-[#17132a] to-[#0f0c1f] border-r border-[#2c244b]/50 z-10 flex flex-col items-center justify-start pt-2">
        {/* Small Roof Outline indicator */}
        <div className="w-full h-2 bg-indigo-500/40 rounded-b border-b border-indigo-500/80" />
        <span className="font-mono text-[7px] text-slate-500 uppercase tracking-widest mt-2 block">
          INDOOR
        </span>
        <span className="font-mono text-[8px] text-red-400/80 block mt-1">
          SHELTER
        </span>
        {/* Soft cyan inside light gradient */}
        <div className="absolute bottom-2 left-2 right-2 h-1/2 bg-blue-500/5 rounded blur-md" />
      </div>

      {/* OUTDOOR ZONE INDICATOR */}
      <div className="absolute right-3 top-3 z-10">
        <span className="font-mono text-[8px] text-[#ffb300]/80 tracking-widest uppercase">
          OUTDOOR ZONE
        </span>
      </div>

      {/* MECHANISMS: POLES AND CORE WIRE */}
      <div className="absolute bottom-2 left-[40px] right-8 top-12 pointer-events-none">
        
        {/* Main Wire line */}
        <div className="absolute top-[25px] left-0 right-0 h-[1.5px] bg-[#3a3554] shadow-[0_1px_2px_rgba(0,0,0,0.5)]" />

        {/* Left Post */}
        <div className="absolute left-[39px] bottom-0 w-2 h-[75px] bg-gradient-to-t from-slate-800 to-slate-600 rounded-t" />
        <div className="absolute left-[36px] top-[40px] w-8 h-[3px] bg-slate-500 rounded" />

        {/* Right Post matching pole in screenshot */}
        <div className="absolute right-4 bottom-0 w-2.5 h-[110px] bg-gradient-to-t from-slate-800 to-slate-600 rounded-t" />
        <div className="absolute right-1 top-[20px] w-8 h-1 bg-slate-500 rounded" />
      </div>

      {/* HANGING CLOTHES WITH MOTION TRANSITION */}
      <motion.div
        animate={{
          x: isExtended ? 130 : 15,
        }}
        transition={{
          type: "spring",
          stiffness: 70,
          damping: 14
        }}
        className="absolute left-[40px] top-[14px] z-20 flex gap-6"
      >
        
        {/* 1. BLUE SHIRT */}
        <div className="relative group flex flex-col items-center">
          {/* Hanger Hook */}
          <div className="w-2.5 h-3 border-2 border-slate-400 border-b-0 rounded-t-full -mb-[1px]" />
          {/* Shirt SVG or styled HTML divs */}
          <div className="relative w-9 h-11 bg-[#2563eb] rounded-t-sm shadow-[0_4px_8px_rgba(0,0,0,0.4)] flex flex-col justify-between p-1 border-t border-sky-400">
            {/* Sleeves */}
            <div className="absolute -left-2 top-0 w-2.5 h-4 bg-[#1d4ed8] rounded-l-md transform -skew-y-12" />
            <div className="absolute -right-2 top-0 w-2.5 h-4 bg-[#1d4ed8] rounded-r-md transform skew-y-12" />
            
            {/* Collar */}
            <div className="w-3 h-2 bg-[#0c0a1a] rounded-b-full mx-auto border-t-0 border border-sky-400/30" />
            {/* Small emblem */}
            <div className="w-1.5 h-1.5 rounded-full bg-sky-300/40 mx-auto" />
          </div>
        </div>

        {/* 2. PURPLE PANTS */}
        <div className="relative group flex flex-col items-center">
          {/* Hanger line */}
          <div className="w-3.5 h-2.5 border-2 border-slate-400 border-b-0 rounded-t-full -mb-0.5" />
          {/* Pants wrapper */}
          <div className="relative flex gap-1 justify-center z-10">
            {/* Left leg */}
            <div className="w-4 h-12 bg-[#6d28d9] rounded-b-sm border-t border-[#8b5cf6]/50 shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
            {/* Right leg */}
            <div className="w-4 h-12 bg-[#6d28d9] rounded-b-sm border-t border-[#8b5cf6]/50 shadow-[0_4px_8px_rgba(0,0,0,0.4)]" />
            
            {/* Waist band connector */}
            <div className="absolute -top-[1.2px] left-0 right-0 h-2 bg-[#5b21b6] rounded-t-xs" />
          </div>
        </div>

        {/* 3. RED T-SHIRT */}
        <div className="relative group flex flex-col items-center">
          {/* Hanger Hook */}
          <div className="w-2.5 h-3 border-2 border-slate-400 border-b-0 rounded-t-full -mb-[1px]" />
          {/* T-Shirt Wrapper */}
          <div className="relative w-10 h-10 bg-[#dc2626] rounded-t-sm shadow-[0_4px_8px_rgba(0,0,0,0.4)] flex flex-col justify-between p-1 border-t border-red-300">
            {/* Sleeves */}
            <div className="absolute -left-2.5 top-0 w-3 h-3 bg-[#b91c1c] rounded-l-md transform -skew-y-6" />
            <div className="absolute -right-2.5 top-0 w-3 h-3 bg-[#b91c1c] rounded-r-md transform skew-y-6" />
            
            {/* Crew collar */}
            <div className="w-3.5 h-1.5 bg-[#0c0a1a] rounded-b-full mx-auto" />
            {/* Soft designer pocket */}
            <div className="w-2 h-2.5 bg-red-800/40 rounded-xs self-start ml-1 mt-1" />
          </div>
        </div>

      </motion.div>

      {/* Floating Pill: POSITION INDICATED (matches the image) */}
      <div className="absolute bottom-3 left-[95px] z-30">
        <div className="bg-[#121021]/90 border border-amber-500/30 text-amber-300 px-2.5 py-1 rounded text-[9px] font-mono tracking-widest uppercase font-bold flex items-center gap-1.5 shadow-md">
          <span className="relative flex h-1.5 w-1.5">
            {isMoving && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
            )}
            <span className={`relative inline-flex rounded-full h-1.5 w-1.5 ${isMoving ? "bg-amber-400" : isExtended ? "bg-green-400" : "bg-red-400"}`} />
          </span>
          STATUS: {statusJemuran.toUpperCase()}
        </div>
      </div>
    </div>
  );
}
