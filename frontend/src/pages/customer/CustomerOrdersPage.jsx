import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  Store,
  Calendar,
  Clock,
  ArrowRight,
  Printer,
  DollarSign,
  Star,
  CheckCircle2,
  XCircle,
  FileText,
  Sprout,
  Receipt,
  Search,
} from 'lucide-react';

const MOCK_ORDERS = [
  {
    id: 'MLB-2026-8819',
    marketName: 'Green City Market',
    neighborhood: 'Lincoln Park',
    stallNumber: 'Stall #04',
    farmerName: 'Prairie Organic Grove (Sarah Jenkins)',
    farmerPhone: '(312) 555-7821',
    pickupDate: 'Saturday, Oct 24, 2026',
    pickupSlot: '08:00 AM - 10:00 AM',
    status: 'Ready for Pickup',
    statusColor: 'emerald',
    createdAt: 'Oct 22, 2026 • 04:15 PM',
    items: [
      { name: 'Organic Heirloom Tomatoes', qty: 2, unit: 'lbs', price: 9.0 },
      { name: 'Raw Wildflower Honey', qty: 1, unit: 'jar', price: 9.5 },
    ],
    cashTotal: 18.5,
    hasReviewed: false,
  },
  {
    id: 'MLB-2026-5521',
    marketName: 'Lincoln Park Farmers Market',
    neighborhood: 'Armitage Ave',
    stallNumber: 'Stall #12',
    farmerName: 'Rolling Hills Dairy (Marcus Vance)',
    farmerPhone: '(312) 555-4309',
    pickupDate: 'Saturday, Oct 24, 2026',
    pickupSlot: '10:00 AM - 12:00 PM',
    status: 'Harvested & Packed',
    statusColor: 'amber',
    createdAt: 'Oct 23, 2026 • 08:30 AM',
    items: [
      { name: 'Pasture-Raised Brown Eggs', qty: 2, unit: 'dozen', price: 11.0 },
      { name: 'Farmstead Goat Cheese Log', qty: 1, unit: 'pack', price: 6.5 },
    ],
    cashTotal: 17.5,
    hasReviewed: false,
  },
  {
    id: 'MLB-2026-4412',
    marketName: 'Logan Square Farmers Market',
    neighborhood: 'Logan Blvd',
    stallNumber: 'Stall #08',
    farmerName: 'Heritage Artisan Bakehouse (Claire Dubois)',
    farmerPhone: '(312) 555-6671',
    pickupDate: 'Sunday, Oct 18, 2026',
    pickupSlot: '09:00 AM - 11:00 AM',
    status: 'Completed Pickup',
    statusColor: 'slate',
    createdAt: 'Oct 16, 2026 • 11:00 AM',
    items: [
      { name: 'Artisan Sourdough Boule', qty: 1, unit: 'loaf', price: 6.5 },
    ],
    cashTotal: 6.5,
    hasReviewed: true,
  },
  {
    id: 'MLB-2026-1092',
    marketName: 'Pilsen Community Market',
    neighborhood: '18th Street Plaza',
    stallNumber: 'Stall #03',
    farmerName: 'Windy City Hydroponics (David Cho)',
    farmerPhone: '(312) 555-1980',
    pickupDate: 'Sunday, Oct 11, 2026',
    pickupSlot: '08:00 AM - 10:00 AM',
    status: 'Cancelled',
    statusColor: 'rose',
    createdAt: 'Oct 09, 2026 • 02:45 PM',
    items: [
      { name: 'Hydroponic Baby Spinach', qty: 3, unit: 'bags', price: 11.25 },
    ],
    cashTotal: 11.25,
    hasReviewed: false,
  },
];

export default function CustomerOrdersPage() {
  const [orders] = useState(MOCK_ORDERS);
  const [filterTab, setFilterTab] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSlipOrder, setSelectedSlipOrder] = useState(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesFilter =
      filterTab === 'ALL'
        ? true
        : filterTab === 'ACTIVE'
        ? ord.status === 'Ready for Pickup' || ord.status === 'Harvested & Packed'
        : filterTab === 'COMPLETED'
        ? ord.status === 'Completed Pickup'
        : ord.status === 'Cancelled';

    const q = searchTerm.trim().toLowerCase();
    const matchesSearch =
      q === '' ||
      ord.id.toLowerCase().includes(q) ||
      ord.marketName.toLowerCase().includes(q) ||
      ord.farmerName.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  const handleOpenSlip = (order) => {
    setSelectedSlipOrder(order);
  };

  const handlePrintSlip = () => {
    window.print();
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Ready for Pickup':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-[#16A34A] border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse" />
            <span>Ready for Pickup</span>
          </span>
        );
      case 'Harvested & Packed':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Harvested & Packed</span>
          </span>
        );
      case 'Completed Pickup':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-[#475569] border border-slate-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-slate-500" />
            <span>Completed & Paid at Stall</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-200">
            <XCircle className="w-3.5 h-3.5" />
            <span>Cancelled</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-[#16A34A] text-xs font-bold">
            <Receipt className="w-3.5 h-3.5" />
            <span>Order History & In-Person Cash Settlement</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">
            My Pre-Order Reservations
          </h1>
          <p className="text-xs sm:text-sm text-[#475569]">
            Review all stall pickup passes, inspect reserved crate items, and access itemized inspection slips for cash settlement.
          </p>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold shadow-xs transition self-start md:self-center"
        >
          <Store className="w-4 h-4" />
          <span>New Pre-Order</span>
        </Link>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <button
            type="button"
            onClick={() => setFilterTab('ALL')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterTab === 'ALL'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('ACTIVE')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterTab === 'ACTIVE'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            Active & Ready (2)
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('COMPLETED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterTab === 'COMPLETED'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            Completed (1)
          </button>
          <button
            type="button"
            onClick={() => setFilterTab('CANCELLED')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer whitespace-nowrap ${
              filterTab === 'CANCELLED'
                ? 'bg-[#16A34A] text-white shadow-xs'
                : 'bg-white text-[#475569] border border-[#E2E8DF] hover:bg-[#F8FAF6]'
            }`}
          >
            Cancelled (1)
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-[#475569] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by code or market..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-[#E2E8DF] bg-white text-xs text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#16A34A]"
          />
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="bg-white border border-[#E2E8DF] rounded-3xl p-12 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-[#475569] flex items-center justify-center mx-auto">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[#0F172A]">No Pre-Orders Found</h3>
            <p className="text-xs text-[#475569] max-w-sm mx-auto">
              No reservation matching your filter criteria. Browse weekly fresh produce to place your first reservation!
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#16A34A] text-white text-xs font-bold"
            >
              <span>Explore Harvest</span>
            </Link>
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-white border border-[#E2E8DF] rounded-3xl p-6 shadow-xs hover:border-emerald-300 transition space-y-6"
            >
              {/* Order Header Row */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[#E2E8DF]">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-black text-[#0F172A]">{ord.id}</span>
                    {getStatusBadge(ord.status)}
                  </div>
                  <p className="text-[11px] text-[#475569]">Reserved on {ord.createdAt}</p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <button
                    type="button"
                    onClick={() => handleOpenSlip(ord)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#E2E8DF] bg-[#F8FAF6] hover:bg-slate-100 text-xs font-bold text-[#0F172A] transition cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-[#16A34A]" />
                    <span>Inspection Slip</span>
                  </button>

                  <Link
                    to={`/tracking/${ord.id}`}
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-2xs"
                  >
                    <span>Track</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* Order Body: Info Columns */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                {/* Stall & Market */}
                <div className="space-y-1 bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2E8DF]">
                  <div className="flex items-center gap-1.5 text-[#16A34A] font-bold">
                    <Store className="w-4 h-4" />
                    <span>{ord.stallNumber}</span>
                  </div>
                  <p className="font-bold text-[#0F172A]">{ord.marketName}</p>
                  <p className="text-[11px] text-[#475569]">{ord.neighborhood}</p>
                  <p className="text-[11px] text-[#475569] pt-1">
                    Grower: <span className="font-semibold text-[#0F172A]">{ord.farmerName}</span>
                  </p>
                </div>

                {/* Pickup Window */}
                <div className="space-y-1 bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2E8DF]">
                  <div className="flex items-center gap-1.5 text-[#16A34A] font-bold">
                    <Calendar className="w-4 h-4" />
                    <span>Pickup Window</span>
                  </div>
                  <p className="font-bold text-[#0F172A]">{ord.pickupDate}</p>
                  <p className="text-xs font-bold text-[#16A34A]">{ord.pickupSlot}</p>
                  <p className="text-[11px] text-[#475569] pt-1">
                    Direct line: <span className="font-mono text-[#0F172A]">{ord.farmerPhone}</span>
                  </p>
                </div>

                {/* Settlement Amount */}
                <div className="space-y-1 bg-[#F8FAF6] p-4 rounded-2xl border border-[#E2E8DF] flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-[#16A34A] font-bold">
                      <DollarSign className="w-4 h-4" />
                      <span>Cash Settlement</span>
                    </div>
                    <p className="text-xl font-black text-[#0F172A] mt-1">${ord.cashTotal.toFixed(2)} USD</p>
                    <p className="text-[11px] text-amber-700 font-medium">
                      Zero Online Fees • Pay at stall
                    </p>
                  </div>

                  {ord.status === 'Completed Pickup' && (
                    <div className="pt-2">
                      <Link
                        to={`/feedback?requestId=${ord.id}`}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#16A34A] hover:underline"
                      >
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                        <span>Leave Stall Feedback</span>
                      </Link>
                    </div>
                  )}
                </div>
              </div>

              {/* Items List Inside Crate */}
              <div className="pt-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569] mb-2">
                  Reserved Produce ({ord.items.length} item{ord.items.length > 1 ? 's' : ''})
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {ord.items.map((it, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-[#E2E8DF] bg-white text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <Sprout className="w-3.5 h-3.5 text-[#16A34A]" />
                        <span className="font-bold text-[#0F172A]">{it.name}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#0F172A]">
                          {it.qty} {it.unit}
                        </span>
                        <span className="text-[#475569] ml-2">(${it.price.toFixed(2)})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Itemized Cash Inspection Slip */}
      {selectedSlipOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-[#E2E8DF] space-y-6 relative animate-in fade-in zoom-in-95">
            <div className="text-center space-y-1 pb-4 border-b border-dashed border-[#CBD5E1]">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto mb-2">
                <Receipt className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-black text-[#0F172A]">Stall Inspection & Cash Slip</h3>
              <p className="text-xs text-[#475569]">
                Order Code: <span className="font-mono font-bold text-[#0F172A]">{selectedSlipOrder.id}</span>
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-[#475569]">Market & Stall:</span>
                <span className="font-bold text-[#0F172A]">
                  {selectedSlipOrder.marketName} ({selectedSlipOrder.stallNumber})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569]">Grower / Farmer:</span>
                <span className="font-bold text-[#0F172A]">{selectedSlipOrder.farmerName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569]">Scheduled Pickup:</span>
                <span className="font-bold text-[#16A34A]">{selectedSlipOrder.pickupSlot}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#475569]">Inspection Status:</span>
                <span className="font-bold text-[#0F172A]">{selectedSlipOrder.status}</span>
              </div>
            </div>

            {/* Produce breakdown */}
            <div className="border-t border-b border-[#E2E8DF] py-3 space-y-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-[#475569]">Produce Items</p>
              {selectedSlipOrder.items.map((it, idx) => (
                <div key={idx} className="flex justify-between text-xs">
                  <span>
                    {it.name} <span className="text-[#475569] font-mono">x{it.qty} {it.unit}</span>
                  </span>
                  <span className="font-bold text-[#0F172A]">${it.price.toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center text-sm font-black">
              <span>Total Due at Stall:</span>
              <span className="text-base text-[#16A34A]">${selectedSlipOrder.cashTotal.toFixed(2)} USD</span>
            </div>

            <p className="text-[11px] text-[#475569] text-center bg-[#F8FAF6] p-3 rounded-xl border border-[#E2E8DF]">
              💡 <strong>Zero Payment Gateway Constraint</strong>: Please hand cash or tap card directly to the stall operator after inspecting your vegetables.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={handlePrintSlip}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#0F172A] hover:bg-slate-50 transition cursor-pointer"
              >
                <Printer className="w-4 h-4 text-[#16A34A]" />
                <span>Print Slip</span>
              </button>
              <button
                type="button"
                onClick={() => setSelectedSlipOrder(null)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-[#16A34A] text-white text-xs font-bold hover:bg-[#15803D] transition cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
