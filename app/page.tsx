"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, ShoppingCart, Heart, Star, Plus, Minus, X, Trash2, ArrowRight, CheckCircle, Package
} from 'lucide-react';

// --- ROBUST UNIQUE DATA ENGINE ---
const CATEGORIES = ["All", "Mens", "Womens", "Electronics", "Beauty"];

const generateUniqueProducts = () => {
  const products = [];
  const brands = ["Nike", "Zyla Pro", "Puma", "Philips", "Roadster", "Levis", "Apple", "Samsung", "MAC"];
  
  const imgData: { [key: string]: number[] } = {
    "Mens": [1043474, 2379004, 842811, 428333, 157675, 1212053, 220453, 373893, 1040637, 839011],
    "Womens": [1130626, 1536619, 1926769, 1183266, 794064, 1852382, 1036623, 1382731, 1462637, 2046107],
    "Electronics": [3394651, 1649771, 205926, 513311, 404280, 1475020, 2582737, 3587905, 1294812, 163056],
    "Beauty": [2533266, 3373739, 3685530, 2848492, 3762412, 3956501, 846741, 1497061, 3736397, 2682333]
  };

  for (let i = 1; i <= 400; i++) {
    const cat = CATEGORIES[(i % (CATEGORIES.length - 1)) + 1];
    const brand = brands[i % brands.length];
    const ids = imgData[cat];
    const uniqueId = ids[i % ids.length];

    const mrp = Math.floor(Math.random() * 4000) + 1200;
    const discount = Math.floor(Math.random() * 50) + 20;
    const price = Math.floor(mrp * (1 - discount / 100));

    products.push({
      id: i,
      category: cat,
      brand: brand,
      name: `${brand} ${cat} Edition #${1000 + i}`,
      price,
      mrp,
      discount,
      rating: (Math.random() * (5 - 4.2) + 4.2).toFixed(1),
      reviews: Math.floor(Math.random() * 3000) + 100,
      image: `https://images.pexels.com/photos/${uniqueId}/pexels-photo-${uniqueId}.jpeg?auto=compress&cs=tinysrgb&w=600`,
    });
  }
  return products;
};

const DB = generateUniqueProducts();

// --- TYPE DEFINITION FOR BUILD FIX ---
type OrderStatus = 'idle' | 'processing' | 'success';

export default function ZylaEliteStore() {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  
  // Explicitly defining the type here to fix the comparison error
  const [orderStatus, setOrderStatus] = useState<OrderStatus>('idle');

  const addToCart = (p: any) => {
    setCart(prev => {
      const exists = prev.find(item => item.id === p.id);
      if (exists) return prev.map(item => item.id === p.id ? { ...item, qty: item.qty + 1 } : item);
      return [...prev, { ...p, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart(prev => prev.map(item => 
      item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item
    ));
  };

  const handlePlaceOrder = () => {
    setOrderStatus('processing');
    setTimeout(() => {
      setOrderStatus('success');
      setCart([]);
    }, 2000);
  };

  const filtered = useMemo(() => {
    return DB.filter(p => 
      (activeCat === "All" || p.category === activeCat) &&
      p.name.toLowerCase().includes(search.toLowerCase())
    ).slice(0, 100);
  }, [activeCat, search]);

  const cartTotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans selection:bg-blue-100">
      
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-[1000] bg-white border-b border-gray-100 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div onClick={() => {setActiveCat("All"); setOrderStatus('idle');}} className="cursor-pointer group">
            <h1 className="text-3xl font-black italic tracking-tighter text-blue-600 flex items-center gap-1">
              ZYLA<span className="text-orange-500">.</span>
              <Package className="group-hover:rotate-12 transition-transform" size={24} />
            </h1>
          </div>
          
          <div className="flex-grow max-w-xl relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" placeholder="Search Menswear, Gadgets, etc..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all border border-transparent focus:border-blue-100"
            />
          </div>

          <button onClick={() => setIsCartOpen(true)} className="relative p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">
            <ShoppingCart size={22} strokeWidth={2.5} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white font-black">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="max-w-7xl mx-auto flex gap-6 mt-4 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(c => (
            <button 
              key={c} onClick={() => {setActiveCat(c); setOrderStatus('idle');}}
              className={`text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap px-4 py-2 rounded-full transition-all ${
                activeCat === c ? 'bg-slate-900 text-white shadow-md' : 'text-gray-400 hover:text-blue-600'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </header>

      {/* --- GRID --- */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div 
                layout initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                key={p.id} className="bg-white p-3 rounded-[2rem] border border-gray-100 group hover:shadow-2xl transition-all"
              >
                <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-4 bg-slate-50">
                  <img src={p.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={p.name} />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-blue-600">Assured</div>
                </div>
                
                <div className="px-2 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.brand}</p>
                  <h3 className="text-sm font-bold text-slate-800 truncate">{p.name}</h3>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xl font-black">₹{p.price}</span>
                    <span className="text-xs font-black text-orange-500">{p.discount}% OFF</span>
                  </div>
                  
                  <button 
                    onClick={() => addToCart(p)}
                    className="w-full mt-4 bg-slate-900 text-white py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* --- CART DRAWER --- */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsCartOpen(false)} className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000]" />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[2001] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b flex justify-between items-center">
                <h2 className="text-2xl font-black italic">Bag ({cart.length})</h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 hover:bg-gray-100 rounded-full"><X/></button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                {orderStatus === 'success' ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle size={48} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">Order Placed!</h3>
                    <p className="text-gray-400 text-sm">Thank you for shopping with Zyla.</p>
                    <button onClick={() => { setIsCartOpen(false); setOrderStatus('idle'); }} className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">Done</button>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-gray-300">
                    <ShoppingCart size={64} />
                    <p className="font-bold uppercase tracking-widest text-sm">Bag is empty</p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 border rounded-[1.5rem] border-gray-100">
                      <img src={item.image} className="w-20 h-24 object-cover rounded-xl shadow-md" />
                      <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-slate-800">{item.name}</h4>
                          <button onClick={() => setCart(cart.filter(i => i.id !== item.id))} className="text-gray-300 hover:text-red-500"><Trash2 size={18}/></button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-black text-lg">₹{item.price * item.qty}</span>
                          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border">
                            <button onClick={() => updateQty(item.id, -1)}><Minus size={14}/></button>
                            <span className="text-xs font-black">{item.qty}</span>
                            <button onClick={() => updateQty(item.id, 1)}><Plus size={14}/></button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && orderStatus !== 'success' && (
                <div className="p-8 bg-slate-50 border-t space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-400 uppercase tracking-widest text-xs">Total Amount</span>
                    <span className="text-3xl font-black text-blue-600">₹{cartTotal.toLocaleString()}</span>
                  </div>
                  <button 
                    onClick={handlePlaceOrder}
                    disabled={orderStatus === 'processing'}
                    className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:bg-blue-300 transition-all"
                  >
                    {orderStatus === 'processing' ? 'Placing Order...' : 'Place Order Now'} <ArrowRight size={18} />
                  </button>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}