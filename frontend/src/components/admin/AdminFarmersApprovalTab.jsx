import React from 'react';
import { Store, User, Phone, MapPin, CheckCircle2, XCircle, Loader2, AlertCircle, RefreshCw, Award } from 'lucide-react';
import RejectFarmerModal from './RejectFarmerModal';

/**
 * AdminFarmersApprovalTab (Phase 4.15)
 * Review and approve or reject incoming farmer stall applications.
 */
export default function AdminFarmersApprovalTab({ hook }) {
  const {
    pendingFarmers,
    loading,
    error,
    actionLoadingId,
    rejectModalOpen,
    selectedFarmer,
    submittingReject,
    handleApprove,
    openRejectModal,
    closeRejectModal,
    handleReject,
    refetch,
  } = hook;

  return (
    <div className="bg-white border border-[#E2E8DF] rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E2E8DF]">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-[#0F172A]">Farmer Stall Applications</h2>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
              {pendingFarmers.length} Pending Approval
            </span>
          </div>
          <p className="text-xs text-[#475569] mt-0.5">
            Review grower credentials and authorize stall booths for pre-order pickup.
          </p>
        </div>

        <button
          type="button"
          onClick={refetch}
          className="p-2.5 rounded-xl border border-[#E2E8DF] text-slate-500 hover:text-[#16A34A] hover:bg-slate-50 transition cursor-pointer self-start sm:self-auto"
          title="Refresh applications"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <div className="py-16 text-center space-y-3">
          <Loader2 className="w-8 h-8 text-[#16A34A] animate-spin mx-auto" />
          <p className="text-xs text-[#475569] font-medium">Loading pending applications...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
          <button type="button" onClick={refetch} className="underline font-bold hover:text-rose-900 cursor-pointer">
            Try Again
          </button>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && pendingFarmers.length === 0 && (
        <div className="text-center py-12 px-4 border border-dashed border-[#CBD5E1] rounded-2xl bg-[#F8FAF6] space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-[#16A34A] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h4 className="text-sm font-bold text-[#0F172A]">All Applications Reviewed</h4>
          <p className="text-xs text-[#475569] max-w-sm mx-auto">
            There are currently no farmer stall applications awaiting administrative decision.
          </p>
        </div>
      )}

      {/* Applications List */}
      {!loading && !error && pendingFarmers.length > 0 && (
        <div className="space-y-4">
          {pendingFarmers.map((farmer) => {
            const isLoading = actionLoadingId === farmer.id;
            const applicantUser = farmer.user || {};

            return (
              <div
                key={farmer.id}
                className="p-5 rounded-2xl border border-[#E2E8DF] bg-[#F8FAF6] hover:border-emerald-300 transition space-y-4 shadow-2xs"
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <Store className="w-4 h-4 text-[#16A34A]" />
                      <h3 className="text-sm font-bold text-[#0F172A]">
                        {farmer.stall_name || applicantUser.fullname || 'New Farm Stall'}
                      </h3>
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded-md uppercase">
                        Pending
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-[#475569] flex-wrap pt-1">
                      <span className="flex items-center gap-1 font-semibold text-[#0F172A]">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        {applicantUser.fullname || farmer.contact_person || 'Lead Grower'}
                      </span>
                      {applicantUser.email && (
                        <span>• {applicantUser.email}</span>
                      )}
                      {(farmer.contact_phone || applicantUser.phone) && (
                        <span className="flex items-center gap-1 font-mono">
                          <Phone className="w-3.5 h-3.5 text-slate-400" />
                          {farmer.contact_phone || applicantUser.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => handleApprove(farmer)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle2 className="w-4 h-4" />
                      )}
                      <span>Approve Stall</span>
                    </button>

                    <button
                      type="button"
                      disabled={isLoading}
                      onClick={() => openRejectModal(farmer)}
                      className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-rose-200 bg-white text-rose-600 hover:bg-rose-50 text-xs font-bold transition shadow-2xs cursor-pointer disabled:opacity-50"
                    >
                      <XCircle className="w-4 h-4" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

                {/* Address & Farm Bio */}
                <div className="pt-2 border-t border-[#E2E8DF] grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Farm Location</span>
                    <p className="text-[#0F172A] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />
                      <span>{farmer.address || 'Address provided on application'}</span>
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Description / Specialty</span>
                    <p className="text-[#475569] mt-0.5 line-clamp-2">
                      {farmer.description || 'Fresh local organic produce grower.'}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Reject Modal */}
      <RejectFarmerModal
        isOpen={rejectModalOpen}
        onClose={closeRejectModal}
        onConfirm={handleReject}
        farmer={selectedFarmer}
        submitting={submittingReject}
      />
    </div>
  );
}
