import React from "react";
import { motion } from "framer-motion";

interface ProductCardProps {
  image: string;
  name: string;
  price: string;
  volume?: string;
  type?: string;
}

export function ProductCard({ image, name, price, volume = "100ml • 3.4 Fl.oz", type = "Eau de Parfum" }: ProductCardProps) {
  return (
    <motion.div 
      className="group cursor-pointer flex flex-col"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6 }}
    >
      <div className="relative aspect-[3/4] mb-6 overflow-hidden bg-[#0f1420] border border-white/5 rounded-sm">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
        <img 
          src={image} 
          alt={name} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 z-20">
          <button className="w-full py-3 bg-[#D4AF37] text-black font-semibold uppercase tracking-widest text-sm hover:bg-white transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="font-serif text-2xl mb-1 text-white group-hover:text-[#D4AF37] transition-colors">{name}</h3>
        <p className="text-white/60 text-sm mb-2">{type}</p>
        <p className="text-white/40 text-xs mb-3">{volume}</p>
        <p className="font-medium text-[#D4AF37]">{price}</p>
      </div>
    </motion.div>
  );
}
