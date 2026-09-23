import React, { useState } from 'react';
import {
  CreditCard,
  X,
  Lock,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { WeeklyScheduleItem } from '../types';

interface PaymentModalProps {
  isOpen: boolean;
  item: WeeklyScheduleItem | null;
  itemsToPay?: WeeklyScheduleItem[];
  onClose: () => void;
  onConfirmPayment: (slotIds: string[], paymentMethod: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  item,
  itemsToPay,
  onClose,
  onConfirmPayment,
}) => {
  const [paymentMethod, setPaymentMethod] = useState<'paynow' | 'card' | 'student_bill'>('paynow');
  const [payerName, setPayerName] = useState('Alex Tan (SMU Student)');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  // Determine list of items being paid
  const targetItems: WeeklyScheduleItem[] = itemsToPay && itemsToPay.length > 0
    ? itemsToPay
    : item
    ? [item]
    : [];

  if (targetItems.length === 0) return null;

  const totalAmount = targetItems.reduce((sum, it) => sum + (it.price ?? 35), 0);
  const slotIds = targetItems.map((it) => it.slotId).filter((id): id is string => !!id);

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      onConfirmPayment(
        slotIds,
        paymentMethod === 'paynow'
          ? 'PayNow UEN'
          : paymentMethod === 'card'
          ? 'Visa/Mastercard'
          : 'SMU Student Term Bill'
      );
    }, 700);
  };

  const handleDone = () => {
    setIsSuccess(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="payment-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/75 backdrop-blur-xs animate-in fade-in duration-200 overflow-y-auto"
    >
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-slate-900 px-6 py-5 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h2 id="payment-modal-title" className="text-lg font-bold leading-tight">
                {targetItems.length > 1
                  ? `Pay for ${targetItems.length} Booked Classes`
                  : 'Pay for Tutoring Class'}
              </h2>
              <p className="text-xs text-slate-300 font-medium">
                SMU Academic Peer & Faculty Tutoring Gateway
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white p-2 rounded-lg hover:bg-slate-800 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center cursor-pointer"
            aria-label="Close payment dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-6 text-center space-y-4 flex-1 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-1">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900">
              Payment Completed!
            </h3>
            <p className="text-sm text-slate-600 max-w-sm leading-relaxed">
              Your payment of <strong>S${totalAmount.toFixed(2)}</strong> has been processed successfully. Your tutoring appointment is now marked as <strong>PAID & LOCKED</strong>.
            </p>

            {/* Crucial non-cancellation reminder */}
            <div className="bg-rose-50 border border-rose-300 rounded-xl p-3.5 text-xs text-rose-900 text-left w-full flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <strong className="block font-bold">Non-Cancellation Policy Enforced:</strong>
                As notified, once payment is finalized, these tutoring classes cannot be cancelled or refunded to protect professor and student scheduling commitments.
              </div>
            </div>

            <button
              type="button"
              onClick={handleDone}
              className="mt-4 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-colors cursor-pointer min-h-[44px]"
            >
              Return to My Week
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="p-6 space-y-5 overflow-y-auto flex-1">
            {/* MANDATORY STRICT NOTIFICATION: Classes cannot be cancelled once payment is done */}
            <div className="bg-rose-50 border-2 border-rose-400 rounded-xl p-4 flex items-start gap-3 shadow-2xs">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-rose-950">
                  Important Cancellation Policy Notice
                </div>
                <div className="text-sm font-bold text-rose-900 mt-0.5 leading-snug">
                  Once payment is completed, classes cannot be cancelled or refunded.
                </div>
                <p className="text-xs text-rose-800 mt-1 leading-relaxed">
                  Please verify your attendance readiness for the booked day, time, and room before submitting payment. Faculty and reserved rooms will be permanently allocated.
                </p>
              </div>
            </div>

            {/* Items summary */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Classes Being Paid ({targetItems.length})
                </span>
                <span className="text-xs font-semibold text-slate-500">
                  Rate: S$35.00 / session
                </span>
              </div>

              <div className="space-y-2 max-h-48 overflow-y-auto border border-slate-200 rounded-xl p-3 bg-slate-50/70">
                {targetItems.map((it) => (
                  <div
                    key={it.id}
                    className="bg-white border border-slate-200 rounded-lg p-2.5 flex items-center justify-between text-xs"
                  >
                    <div>
                      <div className="font-bold text-slate-900">
                        {it.tutorName} — {it.subject}
                      </div>
                      <div className="text-slate-500 flex items-center gap-2 mt-0.5">
                        <span>{it.day}, {it.dateStr}</span>
                        <span>•</span>
                        <span>{it.time}</span>
                      </div>
                    </div>
                    <div className="font-black text-slate-900 text-sm">
                      S${(it.price ?? 35).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Total Row */}
              <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Total Payable Amount:</span>
                <span className="text-xl font-black text-indigo-700">
                  S${totalAmount.toFixed(2)} SGD
                </span>
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-2">
                Select Payment Method
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('paynow')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'paynow'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="text-xs font-black text-purple-700 bg-purple-100 px-1.5 py-0.5 rounded">
                    PayNow
                  </span>
                  <span>Instant UEN</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'card'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-indigo-600" />
                  <span>Debit / Credit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('student_bill')}
                  className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                    paymentMethod === 'student_bill'
                      ? 'bg-indigo-50 border-indigo-600 text-indigo-900 shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <Building className="w-4 h-4 text-indigo-600" />
                  <span>SMU Term Bill</span>
                </button>
              </div>
            </div>

            {/* Payer details */}
            <div>
              <label
                htmlFor="payer-name-input"
                className="block text-xs font-bold text-slate-700 mb-1"
              >
                Billing Account Name
              </label>
              <input
                id="payer-name-input"
                type="text"
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
              />
            </div>

            {/* Security Guarantee */}
            <div className="bg-slate-50 rounded-xl p-3 flex items-center gap-2.5 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Encrypted payment pipeline with institutional escrow for student peer tutoring.
              </span>
            </div>

            {/* Action buttons */}
            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                disabled={isProcessing}
                className="px-4 py-2.5 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl text-xs font-bold transition-colors cursor-pointer min-h-[44px]"
              >
                Dismiss
              </button>
              <button
                type="submit"
                disabled={isProcessing}
                className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer min-h-[44px] flex items-center gap-2 shadow-sm"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>
                  {isProcessing ? 'Processing...' : `Confirm & Pay S$${totalAmount.toFixed(2)}`}
                </span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
