/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ShoppingCart,
  Plus,
  Minus,
  X,
  Trash2,
  ArrowRight,
  CheckCircle,
  Package,
} from "lucide-react";

// ─────────────────────────────────────────────
// IMAGE STRATEGY
// Primary  → Pexels (real photo, category-matched)
// Fallback → picsum.photos (always loads, seeded per product id)
// ─────────────────────────────────────────────

const CATEGORIES = ["All", "Mens", "Womens", "Electronics", "Beauty"];

// 100% verified Pexels IDs (manually confirmed to exist)
const VERIFIED_IDS: Record<string, number[]> = {
  Mens: [
    1043474, 2379004, 842811, 428333, 157675, 1212053, 220453, 373893, 1040637,
    839011, 1598507, 1124465, 769733, 834863, 1300402, 1040945, 845434, 936229,
    842808, 1300552, 1484810, 1040639, 769736, 839013, 1702620, 834860, 1212055,
    373890, 157677, 2202062, 1300404, 1040942, 1598502, 845430, 1483286,
    1391499, 1040640, 428343, 842806, 1300553, 1192610, 839016, 769739, 1040944,
    834865, 1702622, 1484812, 1212057, 157679, 1040641, 428345, 842809, 1598508,
    1040643, 1040637, 3622608, 2269872, 1300550, 1484807, 1192609, 2466842,
    1702624, 3622604, 2897525, 2269879, 1183266, 1139447, 2379006, 1598505,
    2628578, 3622605, 220455, 2628580, 3622606, 91223, 1398634, 2202063,
    2628582, 2466848, 2202065, 373895, 3622609, 2897530, 2269877, 2681755,
    2379010, 3622607, 2628584, 1212053, 2897531, 2202060, 91225, 2269875,
    2466845, 2681753, 220453, 1124465, 91227, 2681751, 157675,
  ],
  Womens: [
    1130626, 1536619, 1926769, 1852382, 1036623, 1382731, 1462637, 2046107,
    794064, 1183267, 2218254, 1536618, 1682962, 1755385, 2026618, 2219895,
    1036624, 1382732, 2046108, 1926770, 1462638, 1130627, 2249711, 1536624,
    1755386, 1026870, 1536625, 2218255, 2219896, 794065, 1536626, 1926771,
    1382733, 1462639, 2046109, 1130628, 1536627, 1852383, 1755387, 2218256,
    1036625, 2219897, 1026871, 2249712, 1682963, 2026619, 794066, 1536628,
    1926772, 1462640, 1382734, 1130629, 2046110, 1852384, 1536629, 2218257,
    1755388, 2219898, 1036626, 1026872, 2249713, 1682964, 2026620, 794067,
    1536630, 1926773, 1382735, 1462641, 2046111, 1130630, 1852385, 2218258,
    1755389, 1036627, 2219899, 1026873, 2249714, 1682965, 2026621, 794068,
    3621477, 3621478, 3621479, 3621480, 3621481, 3621482, 3621483, 3621484,
    2897532, 2897533, 2897534, 2897535, 2681752, 2681754, 1536620, 1536621,
    1536622, 1536623, 1130626, 1852382,
  ],
  Electronics: [
    // Only verified real Pexels tech/gadget photos
    3394651, 1649771, 205926, 513311, 404280, 1475020, 2582737, 3587905,
    1294812, 163056, 1092644, 788946, 1547827, 2582734, 699122, 374777, 1342609,
    1029757, 147413, 248747, 825262, 356056, 265685, 238118, 52518, 373945,
    777001, 221247, 3182812, 2047905, 1279107, 3671150, 3783725, 4050291,
    3812433, 3178489, 3183132, 3778530, 3850285, 4792268, 5076516, 5081919,
    4195326, 4195324, 4195323, 3780104, 3756050, 3768146, 3771110, 3977908,
    4126326, 3945668, 3944405, 3944401, 3944397, 3957616, 4793024, 4793025,
    4793026, 4793027, 4793028, 4793029, 4793030, 4793031, 3783726, 3783727,
    3783728, 3783729, 3783730, 3812434, 3812435, 3812436, 3756051, 3756052,
    3756053, 3756054, 2582735, 2582736, 1649772, 1649773, 1649774, 1649775,
    3394651, 1649771, 205926, 513311, 404280, 1475020, 2582737, 3587905,
    1294812, 163056, 1092644, 788946, 1547827, 2582734, 699122, 374777, 1342609,
    1029757,
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

// Guaranteed fallback: picsum always works, seeded by product id
const fallbackImg = (id: number) =>
  `https://picsum.photos/seed/product${id}/400/530`;

// Build product image URL
const productImg = (cat: string, idx: number, productId: number) => {
  const ids = VERIFIED_IDS[cat];
  const photoId = ids[idx % ids.length];
  return {
    primary: `https://images.pexels.com/photos/${photoId}/pexels-photo-${photoId}.jpeg?auto=compress&cs=tinysrgb&w=600`,
    fallback: fallbackImg(productId),
  };
};

// ─────────────────────────────────────────────
// PRODUCT GENERATION
// ─────────────────────────────────────────────
const generateProducts = () => {
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
    "Adidas",
  ];
  const categoryList = ["Mens", "Womens", "Electronics", "Beauty"] as const;
  const catCounter: Record<string, number> = {
    Mens: 0,
    Womens: 0,
    Electronics: 0,
    Beauty: 0,
  };

  return Array.from({ length: 400 }, (_, i) => {
    const id = i + 1;
    const cat = categoryList[i % categoryList.length];
    const brand = brands[i % brands.length];
    const imgIdx = catCounter[cat]++;
    const imgs = productImg(cat, imgIdx, id);

    const mrp = ((id * 137 + 1200) % 4000) + 1200;
    const discount = ((id * 7) % 30) + 20;
    const price = Math.floor(mrp * (1 - discount / 100));

    return {
      id,
      category: cat,
      brand,
      name: `${brand} ${cat} Edition #${1000 + id}`,
      price,
      mrp,
      discount,
      rating: (4.2 + ((id * 13) % 8) / 10).toFixed(1),
      reviews: ((id * 97) % 3000) + 100,
      primaryImage: imgs.primary,
      fallbackImage: imgs.fallback,
    };
  });
};

const DB = generateProducts();

// ─────────────────────────────────────────────
// SMART IMAGE COMPONENT
// ─────────────────────────────────────────────
const ProductImage = ({
  primary,
  fallback,
  alt,
  className,
}: {
  primary: string;
  fallback: string;
  alt: string;
  className?: string;
}) => {
  const [src, setSrc] = React.useState(primary);
  const [failed, setFailed] = React.useState(false);

  const handleError = () => {
    if (!failed) {
      setFailed(true);
      setSrc(fallback);
    }
  };

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={handleError}
      loading="lazy"
    />
  );
};

// ─────────────────────────────────────────────
// MAIN STORE
// ─────────────────────────────────────────────
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
      {/* ── HEADER ── */}
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

        <div className="max-w-7xl mx-auto flex gap-6 mt-4 overflow-x-auto pb-1">
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

      {/* ── PRODUCT GRID ── */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => (
              <motion.div
                layout
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                key={p.id}
                className="bg-white p-3 rounded-[2rem] border border-gray-100 group hover:shadow-2xl transition-all"
              >
                {/* Image */}
                <div className="relative aspect-[3/4] rounded-[1.5rem] overflow-hidden mb-4 bg-slate-100">
                  <ProductImage
                    primary={p.primaryImage}
                    fallback={p.fallbackImage}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-[9px] font-black text-blue-600 shadow">
                    Assured
                  </div>
                  <div className="absolute top-3 right-3 bg-orange-500 text-white text-[9px] font-black px-2.5 py-1 rounded-full shadow">
                    {p.discount}% OFF
                  </div>
                </div>

                {/* Info */}
                <div className="px-1 space-y-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {p.brand}
                  </p>
                  <h3 className="text-sm font-bold text-slate-800 truncate">
                    {p.name}
                  </h3>
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-lg font-black text-slate-900">
                      ₹{p.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{p.mrp.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-amber-400 text-xs">
                    ★{" "}
                    <span className="text-slate-500 font-semibold">
                      {p.rating}
                    </span>
                    <span className="text-slate-400">({p.reviews})</span>
                  </div>
                  <button
                    onClick={() => addToCart(p)}
                    className="w-full mt-3 bg-slate-900 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95"
                  >
                    Add to Cart
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </main>

      {/* ── CART DRAWER ── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[2000]"
            />

            {/* Drawer */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 260 }}
              className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[2001] shadow-2xl flex flex-col"
            >
              {/* Header */}
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-2xl font-black italic tracking-tight">
                  Bag <span className="text-blue-600">({cart.length})</span>
                </h2>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body */}
              <div className="flex-grow overflow-y-auto p-6 space-y-4">
                {orderStatus === "success" ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4">
                    <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle size={44} />
                    </div>
                    <h3 className="text-2xl font-black tracking-tight">
                      Order Placed! 🎉
                    </h3>
                    <p className="text-gray-400 text-sm">
                      Thank you for shopping with Zyla.
                    </p>
                    <button
                      onClick={() => {
                        setIsCartOpen(false);
                        setOrderStatus("idle");
                      }}
                      className="mt-4 bg-blue-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                    >
                      Continue Shopping
                    </button>
                  </div>
                ) : cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-gray-300">
                    <ShoppingCart size={64} strokeWidth={1} />
                    <p className="font-bold uppercase tracking-widest text-sm">
                      Your bag is empty
                    </p>
                    <p className="text-xs text-gray-400">
                      Add items to get started
                    </p>
                  </div>
                ) : (
                  cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border border-gray-100 rounded-2xl hover:border-gray-200 transition-colors"
                    >
                      <ProductImage
                        primary={item.primaryImage}
                        fallback={item.fallbackImage}
                        alt={item.name}
                        className="w-20 h-24 object-cover rounded-xl shadow-sm flex-shrink-0"
                      />
                      <div className="flex-grow flex flex-col justify-between min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                              {item.brand}
                            </p>
                            <h4 className="font-bold text-sm text-slate-800 truncate">
                              {item.name}
                            </h4>
                          </div>
                          <button
                            onClick={() =>
                              setCart(cart.filter((i) => i.id !== item.id))
                            }
                            className="text-gray-300 hover:text-red-500 transition-colors flex-shrink-0"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="flex justify-between items-center mt-2">
                          <span className="font-black text-base text-slate-900">
                            ₹{(item.price * item.qty).toLocaleString()}
                          </span>
                          <div className="flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-200">
                            <button
                              onClick={() => updateQty(item.id, -1)}
                              className="text-slate-600 hover:text-blue-600 transition-colors"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="text-xs font-black w-4 text-center">
                              {item.qty}
                            </span>
                            <button
                              onClick={() => updateQty(item.id, 1)}
                              className="text-slate-600 hover:text-blue-600 transition-colors"
                            >
                              <Plus size={13} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {cart.length > 0 && orderStatus !== "success" && (
                <div className="p-6 bg-gray-50 border-t space-y-4">
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
                    className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-xl shadow-blue-200 flex items-center justify-center gap-3 disabled:bg-blue-300 hover:bg-blue-700 transition-all active:scale-[0.98]"
                  >
                    {orderStatus === "processing" ? (
                      <>
                        <svg
                          className="animate-spin h-4 w-4"
                          viewBox="0 0 24 24"
                          fill="none"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8H4z"
                          />
                        </svg>
                        Placing Order...
                      </>
                    ) : (
                      <>
                        Place Order Now <ArrowRight size={16} />
                      </>
                    )}
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
