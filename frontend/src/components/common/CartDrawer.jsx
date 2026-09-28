import React from 'react';
import { Link } from 'react-router-dom';
import {
  X,
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  Sprout,
  Store,
  ArrowRight,
  Info,
  Calendar,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import PreOrderCheckoutModal from './PreOrderCheckoutModal';

/**
 * CartDrawer
 * Slide-over shopping basket grouped by farmer stall according to CartResource.
 * Strictly adheres to Fresh Botanical theme & zero-payment in-person market rules.
 * Integrated with PreOrderCheckoutModal for seamless stall pickup slot reservations.
 */
export default function CartDrawer() {
  const {
    cart,
    cartCount,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    loading,
    isCheckoutOpen,
    checkoutStall,
    openCheckout,
    closeCheckout,
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
          {/* Backdrop */}
          <div
            onClick={closeCart}
            className="absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300 cursor-pointer"
            aria-hidden="true"
          />

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
                    <p className="text-[11px] text-[#475569]">
                      Reserved produce for weekend market pickup
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeCart}
                  className="p-2 rounded-xl text-slate-400 hover:text-[#0F172A] hover:bg-slate-100 transition cursor-pointer"
                  aria-label="Close Market Basket"
                >
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
                      <p className="text-xs text-[#475569] max-w-xs mx-auto">
                        Explore seasonal harvests from our verified regional farmers market stalls.
                      </p>
                    </div>
                    <Link
                      to="/products"
                      onClick={closeCart}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition shadow-xs cursor-pointer"
                    >
                      <span>Browse Produce Catalog</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  stalls.map((stall) => (
                    <div
                      key={stall.farmer_id}
                      className="bg-[#F8FAF6] border border-[#E2E8DF] rounded-2xl p-4 space-y-4 shadow-2xs"
                    >
                      {/* Stall Group Header */}
                      <div className="border-b border-slate-200/70 pb-3 flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-1.5">
                            <Sprout className="w-4 h-4 text-[#16A34A]" />
                            <h4 className="text-xs font-black text-[#0F172A] tracking-tight">
                              {stall.stall_name}
                            </h4>
                          </div>
                          {stall.contact_person && (
                            <p className="text-[11px] text-[#475569] pl-5">
                              Grower: {stall.contact_person}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-[#15803D] bg-white px-2 py-0.5 rounded-lg border border-emerald-200">
                            ${Number(stall.stall_subtotal).toFixed(2)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleProceedToPreOrder(stall)}
                            title={`Pre-Order from ${stall.stall_name}`}
                            className="text-[10px] font-bold text-[#16A34A] hover:text-[#15803D] bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200 transition cursor-pointer flex items-center gap-1"
                          >
                            <span>Pre-Order</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Stall Active Markets Note */}
                      {Array.isArray(stall.markets) && stall.markets.length > 0 && (
                        <div className="text-[11px] text-[#475569] flex items-center gap-1.5 bg-white p-2 rounded-xl border border-slate-200/60">
                          <Store className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                          <span className="truncate">
                            Pick up at: <strong>{stall.markets.map((m) => m.name).join(', ')}</strong>
                          </span>
                        </div>
                      )}

                      {/* Items in this Stall */}
                      <div className="space-y-3">
                        {stall.items?.map((item) => {
                          const itemImg =
                            item.product_image ||
                            'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80';
                          const itemPrice = Number(item.unit_price).toFixed(2);
                          const itemSubtotal = Number(item.subtotal).toFixed(2);

                          return (
                            <div
                              key={item.id}
                              className="bg-white border border-[#E2E8DF] rounded-xl p-3 flex items-center gap-3"
                            >
                              <img
                                src={itemImg}
                                alt={item.product_name}
                                className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                              />

                              <div className="flex-1 min-w-0">
                                <h5 className="text-xs font-bold text-[#0F172A] truncate">
                                  {item.product_name}
                                </h5>
                                <p className="text-[11px] text-[#475569]">
                                  ${itemPrice} / {item.unit}
                                </p>

                                {/* Quantity Controls */}
                                <div className="flex items-center gap-2 mt-2">
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, Number(item.quantity) - 1)}
                                    disabled={loading}
                                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-[#0F172A] flex items-center justify-center font-bold text-xs transition cursor-pointer"
                                  >
                                    <Minus className="w-3 h-3" />
                                  </button>
                                  <span className="font-bold text-xs text-[#0F172A] min-w-6 text-center">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => updateQuantity(item.id, Number(item.quantity) + 1)}
                                    disabled={loading || Number(item.quantity) >= Number(item.stock_quantity)}
                                    className="w-6 h-6 rounded-md bg-slate-100 hover:bg-slate-200 text-[#0F172A] flex items-center justify-center font-bold text-xs transition cursor-pointer"
                                  >
                                    <Plus className="w-3 h-3" />
                                  </button>
                                </div>
                              </div>

                              <div className="text-right space-y-2 shrink-0">
                                <span className="text-xs font-black text-[#16A34A] block">
                                  ${itemSubtotal}
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeItem(item.id)}
                                  disabled={loading}
                                  title="Remove item"
                                  className="text-slate-400 hover:text-rose-600 transition cursor-pointer p-1"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
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
                      <p>
                        <strong>In-Person Settlement</strong>: Pay cash or card at the individual stalls upon pickup.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => handleProceedToPreOrder()}
                      disabled={loading}
                      className="w-full py-3.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white font-extrabold text-sm shadow-md shadow-emerald-600/20 transition transform hover:-translate-y-0.5 cursor-pointer flex items-center justify-center gap-2"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>Proceed to Pre-Order Reservation</span>
                    </button>

                    <button
                      type="button"
                      onClick={clearCart}
                      disabled={loading}
                      className="w-full py-2 text-xs font-bold text-slate-500 hover:text-rose-600 transition cursor-pointer flex items-center justify-center gap-1.5"
                    >
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

      {/* Pre-Order Checkout Modal */}
      <PreOrderCheckoutModal
        isOpen={isCheckoutOpen}
        onClose={closeCheckout}
        stall={checkoutStall}
      />
    </>
  );
}
