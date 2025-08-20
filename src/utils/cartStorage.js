// src/utils/cartStorage.js
const KEY = "app.cart.items";

/** อ่านรายการในตะกร้า */
export function getCart() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || [];
  } catch {
    return [];
  }
}

/** เซฟตะกร้า + broadcast event */
export function setCart(items) {
  localStorage.setItem(KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("cart:change"));
}

/** เพิ่มสินค้า 1 ชิ้นต่อ 1 id เท่านั้น (ไม่เพิ่มซ้ำ) */
export function addToCart(item) {
  // expected: { id, title, price, imageUrl, qty }
  const items = getCart();
  const i = items.findIndex((x) => x.id === item.id);

  if (i >= 0) {
    // บังคับไม่ให้เกิน 1 ชิ้น
    items[i] = { ...items[i], qty: 1 };
    setCart(items);
    return { added: false, existed: true };
  }

  items.push({ ...item, qty: 1 });
  setCart(items);
  return { added: true, existed: false };
}

/** ลบสินค้าออกจากตะกร้า */
export function removeFromCart(id) {
  setCart(getCart().filter((x) => x.id !== id));
}

/** อัปเดตจำนวน (ถูกบังคับให้ = 1 เสมอ) */
export function updateQty(id) {
  const items = getCart().map((x) => (x.id === id ? { ...x, qty: 1 } : x));
  setCart(items);
}

/** ล้างตะกร้า */
export function clearCart() {
  setCart([]);
}

/** subscribe การเปลี่ยนแปลงตะกร้า + storage (ข้ามแท็บ) */
export function subscribeCart(cb) {
  const handler = () => cb(getCart());
  window.addEventListener("cart:change", handler);
  window.addEventListener("storage", handler);
  handler(); // init
  return () => {
    window.removeEventListener("cart:change", handler);
    window.removeEventListener("storage", handler);
  };
}

/** ยิง event ให้ Cart เปิดขึ้น */
export function openCart() {
  window.dispatchEvent(new Event("cart:open"));
}
