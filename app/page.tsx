/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Heart,
  Star,
  Plus,
  Minus,
  X,
  Trash2,
  ArrowRight,
  CheckCircle,
  Package,
} from "lucide-react";

// --- UNIQUE PEXELS PHOTO IDs PER CATEGORY ---
const CATEGORIES = ["All", "Mens", "Womens", "Electronics", "Beauty"];

const UNIQUE_IDS: { [key: string]: number[] } = {
  Mens: [
    1043474, 2379004, 842811, 428333, 157675, 1212053, 220453, 373893, 1040637,
    839011, 1598507, 1124465, 769733, 2897531, 1300402, 2681751, 91227, 834863,
    3622608, 2269872, 1300550, 1484807, 1192609, 2466842, 1702624, 3622604,
    1040945, 845434, 2897525, 2269879, 1183266, 1139447, 2379006, 1598505,
    936229, 842808, 428340, 2202060, 2628578, 3622605, 1300552, 220455, 1484810,
    1040639, 769736, 839013, 2897528, 1702620, 91225, 834860, 1212055, 373890,
    2269875, 157677, 2466845, 2681753, 2202062, 1300404, 2628580, 3622606,
    1040942, 91223, 1598502, 845430, 1483286, 1391499, 1040640, 2379008, 428343,
    842806, 1398634, 1300553, 2202063, 1192610, 839016, 769739, 2628582,
    2466848, 2202065, 373895, 1040944, 834865, 91228, 1702622, 3622609, 1484812,
    2897530, 2269877, 1212057, 157679, 2681755, 1040641, 428345, 842809,
    1598508, 2379010, 1040643, 3622607, 2466850, 2628584,
  ],
  Womens: [
    1130626, 1536619, 1926769, 1852382, 1036623, 1382731, 1462637, 2046107,
    794064, 1183267, 2218254, 1536618, 1682962, 3621477, 2681751, 1755385,
    1536620, 1536621, 1536622, 1536623, 2026618, 2219895, 2897532, 3621478,
    1036624, 1382732, 2046108, 1926770, 1462638, 1130627, 2249711, 1536624,
    1755386, 3621479, 1026870, 1536625, 2218255, 2681752, 2219896, 794065,
    1536626, 1926771, 1382733, 1462639, 2046109, 1130628, 1536627, 1852383,
    2897533, 3621480, 1755387, 2218256, 1036625, 2219897, 1026871, 2249712,
    1682963, 3621481, 2026619, 794066, 1536628, 1926772, 1462640, 1382734,
    1130629, 2046110, 1852384, 1536629, 2218257, 1755388, 2897534, 3621482,
    2681753, 2219898, 1036626, 1026872, 2249713, 1682964, 2026620, 794067,
    1536630, 1926773, 1382735, 1462641, 2046111, 1130630, 1852385, 3621483,
    2218258, 1755389, 2897535, 1036627, 2681754, 2219899, 1026873, 2249714,
    1682965, 3621484, 2026621, 794068,
  ],
  Electronics: [
    3394651, 1649771, 205926, 513311, 404280, 1475020, 2582737, 3587905,
    1294812, 163056, 1092644, 4158010, 3861483, 2582734, 788946, 1547827,
    3861484, 4158012, 1092645, 3587906, 4158014, 1649772, 205928, 513313,
    404282, 1475022, 2582739, 1294814, 163058, 1092646, 3394653, 788948,
    1547829, 3861485, 4158016, 2582741, 1092647, 3587907, 4158018, 1649773,
    205930, 513315, 404284, 1475024, 1294816, 163060, 3394655, 788950, 1547831,
    3861486, 4158020, 2582743, 1092648, 3587908, 4158022, 1649774, 205932,
    513317, 404286, 1475026, 1294818, 163062, 3394657, 788952, 1547833, 3861487,
    4158024, 2582745, 1092649, 3587909, 4158026, 1649775, 205934, 513319,
    404288, 1475028, 1294820, 163064, 3394659, 788954, 1547835, 3861488,
    4158028, 2582747, 1092650, 3587910, 4158030, 1649776, 205936, 513321,
    404290, 1475030, 1294822, 163066, 3394661, 788956, 1547837, 3861489,
    4158032, 2582749,
  ],
  Beauty: [
    2533266, 3373739, 3685530, 2848492, 3762412, 3956501, 846741, 1497061,
    3736397, 2682333, 3762413, 3685531, 2533267, 3373740, 2848493, 1704740,
    3956502, 846742, 1497062, 3736398, 2682334, 3762414, 3685532, 2533268,
    3373741, 2848494, 1704741, 3956503, 846743, 1497063, 3736399, 2682335,
    3762415, 3685533, 2533269, 3373742, 2848495, 1704742, 3956504, 846744,
    1497064, 3736400, 2682336, 3762416, 3685534, 2533270, 3373743, 2848496,
    1704743, 3956505, 846745, 1497065, 3736401, 2682337, 3762417, 3685535,
    2533271, 3373744, 2848497, 1704744, 3956506, 846746, 1497066, 3736402,
    2682338, 3762418, 3685536, 2533272, 3373745, 2848498, 1704745, 3956507,
    846747, 1497067, 3736403, 2682339, 3762419, 3685537, 2533273, 3373746,
    2848499, 1704746, 3956508, 846748, 1497068, 3736404, 2682340, 3762420,
    3685538, 2533274, 3373747, 2848500, 1704747, 3956509, 846749, 1497069,
    3736405, 2682341, 3762421, 3685539,
  ],
};

const generateUniqueProducts = () => {
  const products = [];
  const brands = [
    "Nike",
    "Zyla Pro",
    "Puma",
    "Philips",
    "Roadster",
    "Levis",
    "Apple",
    "Samsung",
    "MAC",
  ];
  const categoryList = ["Mens", "Womens", "Electronics", "Beauty"];

  // Track index per category for unique image assignment
  const catIndex: { [key: string]: number } = {
    Mens: 0,
    Womens: 0,
    Electronics: 0,
    Beauty: 0,
  };

  for (let i = 1; i <= 400; i++) {
    const cat = categoryList[(i - 1) % categoryList.length];
    const brand = brands[i % brands.length];

    // Get unique image ID for this product
    const ids = UNIQUE_IDS[cat];
    const idx = catIndex[cat] % ids.length;
    const photoId = ids[idx];
    catIndex[cat]++;

    const mrp = Math.floor((i * 137 + 1200) % 4000) + 1200; // deterministic, no Math.random
    const discount = ((i * 7) % 30) + 20;
    const price = Math.floor(mrp * (1 - discount / 100));

    products.push({
      id: i,
      category: cat,
      brand,
      name: `${brand} ${cat} Edition #${1000 + i}`,
      price,
      mrp,
      discount,
      rating: (4.2 + ((i * 13) % 8) / 10).toFixed(1),
      reviews: ((i * 97) % 3000) + 100,
      image: `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=600`,
    });
  }
  return products;
};

const DB = generateUniqueProducts();

type OrderStatus = "idle" | "processing" | "success";

export default function ZylaEliteStore() {
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeCat, setActiveCat] = useState("All");
  const [search, setSearch] = useState("");
  const [orderStatus, setOrderStatus] = useState<OrderStatus>("idle");

  const addToCart = (p: any) => {
    setCart((prev) => {
      const exists = prev.find((item) => item.id === p.id);
      if (exists)
        return prev.map((item) =>
          item.id === p.id ? { ...item, qty: item.qty + 1 } : item,
        );
      return [...prev, { ...p, qty: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQty = (id: number, delta: number) => {
    setCart((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, item.qty + delta) } : item,
      ),
    );
  };

  const handlePlaceOrder = () => {
    setOrderStatus("processing");
    setTimeout(() => {
      setOrderStatus("success");
      setCart([]);
    }, 2000);
  };

  const filtered = useMemo(() => {
    return DB.filter(
      (p) =>
        (activeCat === "All" || p.category === activeCat) &&
        p.name.toLowerCase().includes(search.toLowerCase()),
    ).slice(0, 100);
  }, [activeCat, search]);

  const cartTotal = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* --- HEADER --- */}
      <header className="sticky top-0 z-[1000] bg-white border-b border-gray-100 shadow-sm px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-6">
          <div
            onClick={() => {
              setActiveCat("All");
              setOrderStatus("idle");
            }}
            className="cursor-pointer group"
          >
            <h1 className="text-3xl font-black italic tracking-tighter text-blue-600 flex items-center gap-1">
              ZYLA<span className="text-orange-500">.</span>
              <Package
                className="group-hover:rotate-12 transition-transform"
                size={24}
              />
            </h1>
          </div>

          <div className="flex-grow max-w-xl relative">
            <Search
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search Menswear, Gadgets, etc..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-100 rounded-2xl py-3 pl-12 pr-4 text-sm outline-none focus:bg-white focus:ring-4 focus:ring-blue-50 transition-all border border-transparent focus:border-blue-100"
            />
          </div>

          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <ShoppingCart size={22} strokeWidth={2.5} />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-white font-black">
                {cart.length}
              </span>
            )}
          </button>
        </div>

        <div className="max-w-7xl mx-auto flex gap-6 mt-4 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => {
                setActiveCat(c);
                setOrderStatus("idle");
              }}
              className={`text-[11px] font-black uppercase tracking-[0.2em] whitespace-nowrap px-4 py-2 rounded-full transition-all ${
                activeCat === c
                  ? "bg-slate-900 text-white shadow-md"
                  : "text-gray-400 hover:text-blue-600"
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
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                key={p.id}
                className="bg-white p-3 rounded-[2rem] border border-gray-100 group hover:shadow-2xl transition-all"
              >
                <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-4 bg-slate-50">
                  <img
                    src={p.image}
                    className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    alt={p.name}
                    onError={(e) => {
                      // Fallback to a placeholder if image fails
                      (e.target as HTMLImageElement).src =
                        `https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600`;
                    }}
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-black text-blue-600">
                    Assured
                  </div>
                </div>

                <div className="px-2 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {p.brand}
                  </p>
                  <h3 className="text-sm font-bold text-slate-800 truncate">
                    {p.name}
                  </h3>
                  <div className="flex items-center gap-2 pt-2">
                    <span className="text-xl font-black">₹{p.price}</span>
                    <span className="text-xs font-black text-orange-500">
                      {p.discount}% OFF
                    </span>
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
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[2001] shadow-2xl flex flex-col"
            >
              <div className="p-8 border-b flex justify-between items-center">
                <h2 className="text-2xl font-black italic">
                  Bag ({cart.length})
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <X />
                </button>
              </div>

              <div className="flex-grow overflow-y-auto p-8 space-y-6">
                {orderStatus === "success" ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                      <CheckCircle size={48} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">
                      Order Placed!
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Thank you for shopping with Zyla.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setOrderStatus("idle");
                      }}
                      className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold"
                    >
                      Done
                    </button>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-gray-300">
                    <ShoppingCart size={64} />
                    <p className="font-bold uppercase tracking-widest text-sm">
                      Bag is empty
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border rounded-[1.5rem] border-gray-100"
                    >
                      <img
                        src={item.image}
                        className="w-20 h-24 object-cover rounded-xl shadow-md"
                        alt={item.name}
                      />
                      <div className="flex-grow flex flex-col justify-between">
                        <div className="flex justify-between items-start">
                          <h4 className="font-bold text-sm text-slate-800">
                            {item.name}
                          </h4>
                          <button
                            onClick={() =>
                              setCart(cart.filter((i) => i.id !== item.id))
                            }
                            className="text-gray-300 hover:text-red-500"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-black text-lg">
                            ₹{item.price * item.qty}
                          </span>
                          <div className="flex items-center gap-4 bg-gray-50 px-4 py-2 rounded-full border">
                            <button onClick={() => updateQty(item.id, -1)}>
                              <Minus size={14} />
                            </button>
                            <span className="text-xs font-black">
                              {item.qty}
                            </span>
                            <button onClick={() => updateQty(item.id, 1)}>
                              <Plus size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && orderStatus !== "success" && (
                <div className="p-8 bg-slate-50 border-t space-y-6">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-400 uppercase tracking-widest text-xs">
                      Total Amount
                    </span>
                    <span className="text-3xl font-black text-blue-600">
                      ₹{cartTotal.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={orderStatus === "processing"}
                    className="w-full bg-blue-600 text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-100 flex items-center justify-center gap-3 disabled:bg-blue-300 transition-all"
                  >
                    {orderStatus === "processing"
                      ? "Placing Order..."
                      : "Place Order Now"}{" "}
                    <ArrowRight size={18} />
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
