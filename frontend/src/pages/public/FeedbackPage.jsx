import React, { useState } from 'react';
import { Star, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { useModal } from '../../context/ModalContext';

export default function FeedbackPage() {
  const { showAlert } = useModal();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [requestId, setRequestId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!comment) {
      showAlert({
        title: 'Comment Required',
        message: 'Please write a brief comment describing your emergency transport experience.',
        type: 'warning',
      });
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      showAlert({
        title: 'Feedback Received',
        message: 'Thank you for helping us improve LifeLink emergency response services!',
        type: 'success',
        confirmText: false,
        autoCloseMs: 2200,
      });
    }, 600);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <div className="bg-white border border-[#E2E8F0] rounded-2xl p-6 sm:p-10 shadow-sm space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 border-b border-[#E2E8F0] pb-6">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-2">
            <MessageSquare className="w-6 h-6" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#1F2A37]">
            Patient Care & Dispatch Feedback
          </h1>
          <p className="text-xs sm:text-sm text-[#6B7785]">
            We value your experience. Your feedback directly shapes our paramedic training and rapid response protocols.
          </p>
        </div>

        {submitted ? (
          <div className="py-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-[#198754] flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="text-xl font-bold text-[#1F2A37]">Thank You For Your Feedback!</h2>
            <p className="text-xs text-[#6B7785] max-w-md mx-auto">
              Your review has been recorded into the LifeLink quality assurance database.
            </p>
            <button
              type="button"
              onClick={() => {
                setSubmitted(false);
                setComment('');
                setRequestId('');
                setPatientName('');
              }}
              className="mt-4 px-5 py-2.5 rounded-xl bg-[#0B6EFD] text-white text-xs font-bold hover:bg-[#084298] transition cursor-pointer"
            >
              Submit Another Feedback
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Star Rating */}
            <div className="text-center space-y-2">
              <label className="block text-xs font-bold text-[#1F2A37] uppercase tracking-wider">
                Overall Service Quality Rating
              </label>
              <div className="flex items-center justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1.5 transition transform hover:scale-125 cursor-pointer focus:outline-none"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400'
                          : 'text-slate-200'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <span className="text-xs font-bold text-[#0B6EFD]">
                {rating === 5 && 'Outstanding • Paramedic team was prompt & clinical'}
                {rating === 4 && 'Very Good • Satisfactory transport experience'}
                {rating === 3 && 'Average • Timely response'}
                {rating <= 2 && 'Needs Improvement'}
              </span>
            </div>

            {/* Request ID & Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Trip / Emergency Request ID (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. SOS-2026-081"
                  value={requestId}
                  onChange={(e) => setRequestId(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                  Patient or Reporter Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD]"
                />
              </div>
            </div>

            {/* Comment */}
            <div>
              <label className="block text-xs font-semibold text-[#1F2A37] mb-1">
                Your Feedback & Comments <span className="text-[#DC3545]">*</span>
              </label>
              <textarea
                rows={4}
                required
                placeholder="Share your experience regarding driver speed, on-board equipment quality, communication, and overall care..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs bg-[#F5F8FC] border border-[#E2E8F0] rounded-xl text-[#1F2A37] focus:outline-none focus:border-[#0B6EFD] leading-relaxed"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 rounded-xl bg-[#0B6EFD] hover:bg-[#084298] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 transition cursor-pointer disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting Review...' : 'Submit Patient Feedback'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
