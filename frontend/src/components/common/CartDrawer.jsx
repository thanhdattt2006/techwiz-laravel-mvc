import React from 'react';
import { Link } from 'react-router-dom';
import { X, ShoppingBag, Trash2, Sprout, ArrowRight, Info, Calendar } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import PreOrderCheckoutModal from './PreOrderCheckoutModal';
import CartStallGroup from '../cart/CartStallGroup';

/**
 * CartDrawer
 * Slide-over shopping basket grouped by farmer stall according to CartResource.
 * Strictly adheres to Fresh Botanical theme & zero-payment in-person market rules.
 */
export default function CartDrawer() {
  const {
    cart, cartCount, isOpen, closeCart,
    updateQuantity, removeItem, clearCart, loading,
    isCheckoutOpen, checkoutStall, openCheckout, closeCheckout,
  } = useCart();

  const stalls = Array.isArray(cart?.stalls) ? cart.stalls : [];
  const grandTotal = cart?.subtotal ? Number(cart.subtotal).toFixed(2) : '0.00';

  const handleProceedToPreOrder = (stall = null) => {
    closeCart();
    openCheckout(stall);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div onClick={closeCart} className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 cursor-pointer" aria-hidden="true" />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10 pointer-events-none">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col pointer-events-auto transform transition ease-in-out duration-300 border-l border-[#E2E8DF]">
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-[#E2E8DF] flex items-center justify-between bg-[#F8FAF6]">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base font-black text-[#0F172A] flex items-center gap-2">
                      <span>Market Basket</span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#15803D]">
                        {cartCount} {cartCount === 1 ? 'item' : 'items'}
                      </span>
                    </h2>
                    <p className="text-[11px] text-[#475569]">Reserved produce for weekend market pickup</p>
                  </div>
                </div>
                <button type="button" onClick={closeCart} className="p-2 rounded-xl text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer" aria-label="Close Market Basket">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Body */}
              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">
                {stalls.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-[#16A34A] flex items-center justify-center">
                      <Sprout className="w-8 h-8" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-base font-black text-[#0F172A]">Your Basket is Empty</h3>
                      <p className="text-xs text-[#475569] max-w-xs mx-auto">Explore seasonal harvests from our verified regional farmers market stalls.</p>
                    </div>
                    <Link to="/products" onClick={closeCart} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs cursor-pointer">
                      <span>Browse Produce Catalog</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  stalls.map((stall) => (
                    <CartStallGroup
                      key={stall.farmer_id}
                      stall={stall}
                      loading={loading}
                      updateQuantity={updateQuantity}
                      removeItem={removeItem}
                      onPreOrder={handleProceedToPreOrder}
                    />
                  ))
                )}
              </div>

              {/* Drawer Footer */}
              {stalls.length > 0 && (
                <div className="p-6 border-t border-[#E2E8DF] bg-[#F8FAF6] space-y-4">
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[#475569]">
                      <span>Market Pickup Service:</span>
                      <span className="font-bold text-[#16A34A]">$0.00 (Free)</span>
                    </div>
                    <div className="flex items-center justify-between text-base font-black text-[#0F172A] pt-2 border-t border-slate-200">
                      <span>Grand Total:</span>
                      <span className="text-2xl text-[#16A34A] font-black">${grandTotal}</span>
                    </div>
                    <div className="p-2.5 rounded-xl bg-emerald-100/60 border border-emerald-200/80 text-[11px] text-[#15803D] flex items-start gap-2">
                      <Info className="w-3.5 h-3.5 text-[#16A34A] shrink-0 mt-0.5" />
                      <p><strong>In-Person Settlement</strong>: Pay cash or card at the individual stalls upon pickup.</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <button type="button" onClick={() => handleProceedToPreOrder()} disabled={loading} className="w-full py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>Proceed to Pre-Order Reservation</span>
                    </button>
                    <button type="button" onClick={clearCart} disabled={loading} className="w-full py-2 text-xs font-bold text-slate-500 hover:text-rose-600 transition cursor-pointer flex items-center justify-center gap-1.5">
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Clear Shopping Basket</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <PreOrderCheckoutModal isOpen={isCheckoutOpen} onClose={closeCheckout} stall={checkoutStall} />
    </>
  );
}
