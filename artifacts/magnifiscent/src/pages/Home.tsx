import React from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ProductCard } from "@/components/ui/product-card";
import { Package, RefreshCw, ShieldCheck, Star } from "lucide-react";

import chicImg from "@assets/image_1774960377576.png";
import darkAngelImg from "@assets/image_1774960421561.png";
import risingSunImg from "@assets/image_1774960455085.png";
import sigmaImg from "@assets/image_1774960467602.png";
import questImg from "@assets/image_1774960352441.png";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0a0f18] text-white selection:bg-[#D4AF37] selection:text-black">
      <Header />

      {/* Hero Section */}
      <section id="home" className="relative h-[100dvh] w-full flex items-center justify-center overflow-hidden">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img 
            src="/hero-bg.png" 
            alt="Magnifiscent Luxury Perfumes" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-[#0a0f18]" />
        </motion.div>

        <div className="relative z-10 container mx-auto px-6 text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          >
            <h2 className="text-[#D4AF37] font-serif italic text-2xl md:text-3xl mb-6 tracking-wide">Discover True Elegance</h2>
            <h1 className="font-serif text-6xl md:text-8xl lg:text-[10rem] text-white mb-10 leading-[0.9] tracking-tight drop-shadow-2xl">
              THE ART OF <br /> <span className="text-transparent border-text" style={{ WebkitTextStroke: '2px white' }}>SCENT</span>
            </h1>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-12">
              <button className="px-10 py-5 bg-[#D4AF37] text-black font-semibold uppercase tracking-[0.2em] text-sm hover:bg-white transition-colors duration-300 min-w-[240px]">
                Shop Now
              </button>
              <button className="px-10 py-5 bg-transparent border-2 border-white text-white font-semibold uppercase tracking-[0.2em] text-sm hover:bg-white hover:text-black transition-colors duration-300 min-w-[240px]">
                Explore Collection
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Strip */}
      <section className="bg-[#0a0f18] py-16 border-b border-white/5 relative z-20">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            {[
              { icon: Package, text: "Free Shipping (above $100)" },
              { icon: RefreshCw, text: "20-Day Returns" },
              { icon: ShieldCheck, text: "100% Authentic" },
              { icon: Star, text: "Premium Quality" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                className="flex flex-col items-center text-center gap-5 group"
              >
                <div className="w-16 h-16 rounded-full border border-[#D4AF37]/30 flex items-center justify-center text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-300">
                  <feature.icon size={24} strokeWidth={1.5} />
                </div>
                <p className="text-sm font-medium tracking-widest uppercase text-white/80 group-hover:text-white transition-colors">{feature.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Top Categories */}
      <section id="collections" className="py-32 bg-[#0a0f18] relative z-20">
        <div className="container mx-auto px-6">
          <motion.div 
            className="text-center mb-20"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">Top Categories</h2>
            <div className="w-24 h-[2px] bg-[#D4AF37] mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <a href="#men" className="block">
              <motion.div 
                className="group relative aspect-[4/5] overflow-hidden cursor-pointer bg-[#111]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <img 
                  src="/men-banner.png" 
                  alt="Men's Collection" 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 p-6 text-center">
                  <h3 className="font-serif text-5xl md:text-6xl text-white mb-6 uppercase tracking-widest drop-shadow-2xl group-hover:text-[#D4AF37] transition-colors duration-500">Men</h3>
                  <span className="px-8 py-4 border border-white/50 text-white font-medium uppercase tracking-[0.2em] text-xs backdrop-blur-sm group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                    Discover More
                  </span>
                </div>
              </motion.div>
            </a>

            <a href="#women" className="block">
              <motion.div 
                className="group relative aspect-[4/5] overflow-hidden cursor-pointer bg-[#111]"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <img 
                  src="/women-banner.png" 
                  alt="Women's Collection" 
                  className="w-full h-full object-cover transition-transform duration-[1.5s] group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-500" />
                <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 p-6 text-center">
                  <h3 className="font-serif text-5xl md:text-6xl text-white mb-6 uppercase tracking-widest drop-shadow-2xl group-hover:text-[#D4AF37] transition-colors duration-500">Women</h3>
                  <span className="px-8 py-4 border border-white/50 text-white font-medium uppercase tracking-[0.2em] text-xs backdrop-blur-sm group-hover:bg-white group-hover:text-black group-hover:border-white transition-all duration-300">
                    Discover More
                  </span>
                </div>
              </motion.div>
            </a>
          </div>
        </div>
      </section>

      {/* Women's Collection */}
      <section id="women" className="py-32 bg-[#0d131f] relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">Women's Collection</h2>
              <div className="w-24 h-[2px] bg-[#D4AF37]" />
            </motion.div>
            <motion.button 
              className="text-[#D4AF37] uppercase tracking-[0.2em] text-sm font-semibold hover:text-white transition-colors flex items-center gap-3 group"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              View All <span className="text-xl group-hover:translate-x-2 transition-transform">&rarr;</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
            <ProductCard image={chicImg} name="CHIC" price="$120.00" />
            <ProductCard image={darkAngelImg} name="Dark Angel" price="$145.00" />
            <ProductCard image={risingSunImg} name="Rising Sun" price="$110.00" />
            <ProductCard image={sigmaImg} name="SIGMA" price="$135.00" />
          </div>
        </div>
      </section>

      {/* Men's Collection */}
      <section id="men" className="py-32 bg-[#0a0f18] relative z-20">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="font-serif text-5xl md:text-6xl text-white mb-6">Men's Collection</h2>
              <div className="w-24 h-[2px] bg-[#D4AF37]" />
            </motion.div>
            <motion.button 
              className="text-[#D4AF37] uppercase tracking-[0.2em] text-sm font-semibold hover:text-white transition-colors flex items-center gap-3 group"
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              View All <span className="text-xl group-hover:translate-x-2 transition-transform">&rarr;</span>
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            <ProductCard image={questImg} name="QUEST" price="$115.00" />
            <ProductCard image="/noir-product.png" name="NOIR" price="$150.00" />
            <ProductCard image="/storm-product.png" name="STORM" price="$125.00" />
          </div>
        </div>
      </section>

      {/* Shop By Gender - Split Panels */}
      <section className="flex flex-col md:flex-row min-h-[80vh] w-full">
        <a href="#men" className="flex-1 relative group overflow-hidden block h-[50vh] md:h-auto">
          <img 
            src="/men-split.png" 
            alt="Shop Men" 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <h3 className="font-serif text-5xl md:text-7xl text-white uppercase tracking-widest drop-shadow-2xl mb-8">For Him</h3>
            <div className="w-0 group-hover:w-24 h-[2px] bg-[#D4AF37] transition-all duration-500" />
          </div>
        </a>
        <a href="#women" className="flex-1 relative group overflow-hidden block h-[50vh] md:h-auto">
          <img 
            src="/women-split.png" 
            alt="Shop Women" 
            className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
            <h3 className="font-serif text-5xl md:text-7xl text-white uppercase tracking-widest drop-shadow-2xl mb-8">For Her</h3>
            <div className="w-0 group-hover:w-24 h-[2px] bg-[#D4AF37] transition-all duration-500" />
          </div>
        </a>
      </section>

      {/* Brand Story */}
      <section id="about" className="py-40 relative overflow-hidden bg-[#05080c]">
        <motion.div 
          className="absolute inset-0 z-0"
          initial={{ y: -50 }}
          whileInView={{ y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img 
            src="/story-bg.png" 
            alt="Magnifiscent Ingredients" 
            className="w-full h-full object-cover opacity-20 mix-blend-luminosity"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0f18] via-[#0a0f18]/90 to-transparent" />
        </motion.div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h3 className="text-[#D4AF37] font-serif italic text-2xl mb-4">Heritage</h3>
              <h2 className="font-serif text-5xl md:text-7xl text-white mb-8">The Magnifiscent Story</h2>
              <div className="w-32 h-[2px] bg-[#D4AF37] mb-12" />
              
              <div className="space-y-8 text-white/70 leading-relaxed font-light text-lg md:text-xl">
                <p>
                  Born from a passion for the extraordinary, Magnifiscent represents the pinnacle of modern perfumery. We believe that a fragrance is more than just a scent—it is an invisible crown, a silent introduction, an unforgettable memory.
                </p>
                <p>
                  Our master perfumers source only the rarest and most exquisite ingredients from around the globe. From the deep, resonant oud of the East to the delicate, blooming roses of Grasse, every note is chosen with uncompromising standards.
                </p>
                <p className="text-white font-medium italic font-serif">
                  "Step into a world where elegance is bottled. Wear your story."
                </p>
              </div>
              
              <button className="mt-16 px-10 py-5 border border-[#D4AF37] text-[#D4AF37] font-semibold uppercase tracking-[0.2em] text-sm hover:bg-[#D4AF37] hover:text-black transition-colors duration-300">
                Discover Our Heritage
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-32 bg-[#0d131f] border-t border-white/5 text-center relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent" />
        <div className="container mx-auto px-6 max-w-4xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-serif text-4xl md:text-6xl text-white mb-6">Join the Magnifiscent World</h2>
            <p className="text-white/60 mb-12 font-light text-lg md:text-xl max-w-2xl mx-auto">
              Subscribe to receive updates, access to exclusive releases, and insights into the art of perfumery.
            </p>
            
            <form className="flex flex-col sm:flex-row gap-0 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="ENTER YOUR EMAIL" 
                className="flex-1 bg-white/5 border border-white/20 px-8 py-5 text-white focus:outline-none focus:border-[#D4AF37] focus:bg-white/10 transition-all duration-300 placeholder:text-white/40 tracking-[0.1em] text-sm"
                required
              />
              <button type="submit" className="px-12 py-5 bg-[#D4AF37] text-black font-semibold uppercase tracking-[0.2em] text-sm hover:bg-white transition-colors duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
