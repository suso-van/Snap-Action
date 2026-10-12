import React, { useState } from 'react';
import {
  Plane,
  CreditCard,
  Package,
  MapPin,
  CheckSquare,
  Calendar,
  User,
  Link2,
  Github,
  FileText,
  Sparkles,
  Copy,
  Check,
  ExternalLink,
  Phone,
  Mail,
  AlertTriangle,
  Clock,
  ShieldCheck,
  Bookmark,
  Archive,
  Trash2,
  Edit3,
  Download,
  Share2,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ScreenshotItem, SuggestedAction, ExtractedEntity } from '../../types';
import { ProvenanceBadge } from './ProvenanceBadge';
import { downloadVCardFile } from '../../utils/vcard';

interface ResourceCardProps {
  screenshot: ScreenshotItem;
  onExecuteAction: (action: SuggestedAction) => void;
  onEditEntity?: (entityKey: string, newValue: string) => void;
  onOpenEditModal?: () => void;
  onToggleSaveLibrary?: (id: string) => void;
  onToggleArchive?: (id: string) => void;
  onDelete?: (id: string) => void;
  onViewScreenshot?: () => void;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({
  screenshot,
  onExecuteAction,
  onEditEntity,
  onOpenEditModal,
  onToggleSaveLibrary,
  onToggleArchive,
  onDelete,
  onViewScreenshot,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isTaskDone, setIsTaskDone] = useState(false);

  const getEntity = (key: string): ExtractedEntity | undefined => {
    return screenshot.extractedEntities.find(
      (e) => e.key.toLowerCase() === key.toLowerCase() || e.label.toLowerCase() === key.toLowerCase()
    );
  };

  const getEntityValue = (key: string, fallback = '—'): string => {
    const e = getEntity(key);
    return e?.value || fallback;
  };

  const handleCopy = (text: string, keyName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(keyName);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleCopyAllAsText = () => {
    const lines = [
      `SNAPACTION RESOURCE: ${screenshot.title}`,
      `Category: ${screenshot.category.toUpperCase()}`,
      `Summary: ${screenshot.summary}`,
      `Extracted Entities:`,
      ...screenshot.extractedEntities.map((e) => `• ${e.label}: ${e.value} [${e.provenance || 'extracted'}]`),
    ];
    handleCopy(lines.join('\n'), 'all_text');
  };

  const category = screenshot.category;

  // Render specific layout based on category
  return (
    <div className="space-y-4">
      {/* Warnings & Inferred Notice Banner */}
      {((screenshot.warnings && screenshot.warnings.length > 0) ||
        screenshot.extractedEntities.some((e) => e.isWarning || e.provenance === 'inferred')) && (
        <div className="rounded-2xl p-3.5 bg-amber-500/10 border border-amber-500/25 text-amber-200 text-xs space-y-1.5 animate-fadeIn">
          <div className="flex items-center space-x-2 font-semibold text-amber-300">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-400" />
            <span>Verification &amp; Inferred Data Notice</span>
          </div>
          {screenshot.warnings && screenshot.warnings.length > 0 ? (
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-200/90 pl-1">
              {screenshot.warnings.map((w, idx) => (
                <li key={idx}>{w}</li>
              ))}
            </ul>
          ) : (
            <p className="text-[11px] text-amber-200/90">
              Some values on this card were estimated by AI. Check highlighted values before booking or paying.
            </p>
          )}
        </div>
      )}

      {/* Main Specialized Resource Card */}
      <div className="rounded-3xl bg-[#111] border border-[#262626] shadow-2xl overflow-hidden">
        {/* Card Header Bar with Status Badges and Quick Library Actions */}
        <div className="px-5 py-3.5 bg-[#161616] border-b border-[#222] flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A0A0A0] flex items-center space-x-1.5">
              <span>{getCategoryIcon(category)}</span>
              <span>{getCategoryLabel(category)}</span>
            </span>
          </div>

          <div className="flex items-center space-x-1">
            {onToggleSaveLibrary && (
              <button
                onClick={() => onToggleSaveLibrary(screenshot.id)}
                title={screenshot.isSavedToLibrary ? 'Saved in Library' : 'Save to Library'}
                className={`p-1.5 rounded-xl text-xs transition-colors ${
                  screenshot.isSavedToLibrary
                    ? 'text-amber-400 bg-amber-500/15'
                    : 'text-[#888] hover:text-[#EDEDED] hover:bg-[#222]'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${screenshot.isSavedToLibrary ? 'fill-amber-400' : ''}`} />
              </button>
            )}

            {onToggleArchive && (
              <button
                onClick={() => onToggleArchive(screenshot.id)}
                title={screenshot.isArchived ? 'Unarchive' : 'Archive resource'}
                className={`p-1.5 rounded-xl text-xs transition-colors ${
                  screenshot.isArchived
                    ? 'text-blue-400 bg-blue-500/15'
                    : 'text-[#888] hover:text-[#EDEDED] hover:bg-[#222]'
                }`}
              >
                <Archive className="w-4 h-4" />
              </button>
            )}

            {onOpenEditModal && (
              <button
                onClick={onOpenEditModal}
                title="Edit extracted data"
                className="p-1.5 rounded-xl text-xs text-[#888] hover:text-blue-400 hover:bg-[#222] transition-colors"
              >
                <Edit3 className="w-4 h-4" />
              </button>
            )}

            {onDelete && (
              <button
                onClick={() => onDelete(screenshot.id)}
                title="Delete resource"
                className="p-1.5 rounded-xl text-xs text-[#888] hover:text-rose-400 hover:bg-[#222] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Category-Specific Body Layout */}
        <div className="p-5">
          {category === 'ticket' || category === 'travel' ? (
            <FlightTicketLayout
              screenshot={screenshot}
              getEntity={getEntity}
              handleCopy={handleCopy}
              copiedKey={copiedKey}
            />
          ) : category === 'payment' ? (
            <PaymentLayout
              screenshot={screenshot}
              getEntity={getEntity}
              handleCopy={handleCopy}
              copiedKey={copiedKey}
            />
          ) : category === 'receipt' ? (
            <ReceiptLayout
              screenshot={screenshot}
              getEntity={getEntity}
              handleCopy={handleCopy}
              copiedKey={copiedKey}
            />
          ) : category === 'package' ? (
            <PackageLayout
              screenshot={screenshot}
              getEntity={getEntity}
              handleCopy={handleCopy}
              copiedKey={copiedKey}
            />
          ) : category === 'address' ? (
            <AddressLayout
              screenshot={screenshot}
              getEntity={getEntity}
              handleCopy={handleCopy}
              copiedKey={copiedKey}
            />
          ) : category === 'task' ? (
            <TaskLayout
              screenshot={screenshot}
              getEntity={getEntity}
              isDone={isTaskDone}
              onToggleDone={() => setIsTaskDone(!isTaskDone)}
              handleCopy={handleCopy}
              copiedKey={copiedKey}
            />
          ) : category === 'event' ? (
            <EventLayout
              screenshot={screenshot}
              getEntity={getEntity}
              handleCopy={handleCopy}
              copiedKey={copiedKey}
            />
          ) : category === 'contact' ? (
            <ContactLayout
              screenshot={screenshot}
              getEntity={getEntity}
              handleCopy={handleCopy}
              copiedKey={copiedKey}
            />
          ) : category === 'link' ? (
            <LinkLayout
              screenshot={screenshot}
              getEntity={getEntity}
              handleCopy={handleCopy}
              copiedKey={copiedKey}
            />
          ) : category === 'github' ? (
            <GithubLayout
              screenshot={screenshot}
              getEntity={getEntity}
              handleCopy={handleCopy}
              copiedKey={copiedKey}
            />
          ) : (
            <DocumentLayout
              screenshot={screenshot}
              getEntity={getEntity}
              handleCopy={handleCopy}
              copiedKey={copiedKey}
            />
          )}
        </div>

        {/* Card Bottom Bar with Quick Actions & Share */}
        <div className="px-5 py-3 bg-[#0C0C0C] border-t border-[#1E1E1E] flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-2">
            <button
              onClick={handleCopyAllAsText}
              className="text-xs text-[#888] hover:text-[#EDEDED] flex items-center space-x-1.5 transition-colors"
            >
              {copiedKey === 'all_text' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400 font-medium">Copied Text</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy All Info</span>
                </>
              )}
            </button>
            {onViewScreenshot && (
              <button
                onClick={onViewScreenshot}
                className="text-xs text-[#888] hover:text-blue-400 flex items-center space-x-1 transition-colors pl-3 border-l border-[#222]"
              >
                <span>View Screenshot</span>
              </button>
            )}
          </div>

          <span className="text-[11px] text-[#555]">
            ID: {screenshot.id.slice(-8)}
          </span>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 1. FLIGHT / TICKET BOARDING PASS LAYOUT
// ==========================================
const FlightTicketLayout: React.FC<{
  screenshot: ScreenshotItem;
  getEntity: (k: string) => ExtractedEntity | undefined;
  handleCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}> = ({ screenshot, getEntity, handleCopy, copiedKey }) => {
  const flightNum = getEntity('flight_number') || getEntity('flight') || { value: 'AI-302', label: 'Flight' };
  const origin = getEntity('origin') || getEntity('departure_city') || { value: 'CCU · Kolkata', label: 'Origin' };
  const dest = getEntity('destination') || getEntity('arrival_city') || { value: 'DEL · New Delhi', label: 'Destination' };
  const depTime = getEntity('departure_time') || getEntity('departure') || { value: 'Aug 18 · 8:40 PM', label: 'Departure' };
  const arrTime = getEntity('arrival_time') || getEntity('arrival') || { value: 'Aug 18 · 10:55 PM', label: 'Arrival' };
  const terminal = getEntity('terminal') || { value: 'Terminal 2', label: 'Terminal' };
  const gate = getEntity('gate') || { value: '14B', label: 'Gate' };
  const checkinDeadline = getEntity('checkin_deadline') || { value: 'Aug 18 · 7:40 PM', label: 'Check-in Deadline', provenance: 'inferred' as const };
  const pnr = getEntity('pnr') || getEntity('booking_ref') || { value: 'AI889Q4', label: 'PNR' };

  return (
    <div className="space-y-4">
      {/* Top Banner / Route */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-rose-950/40 via-[#181818] to-blue-950/30 border border-rose-900/30">
        <div className="flex items-center justify-between pb-3 border-b border-white/5">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-white tracking-wider font-mono">{flightNum.value}</span>
            <ProvenanceBadge provenance={flightNum.provenance} compact />
          </div>
          <div className="flex items-center space-x-1.5 bg-[#222] px-2.5 py-1 rounded-xl">
            <span className="text-[11px] text-[#888]">PNR:</span>
            <span className="text-xs font-mono font-bold text-white">{pnr.value}</span>
            <button
              onClick={() => handleCopy(pnr.value, 'pnr')}
              className="text-[#888] hover:text-white ml-1"
              title="Copy PNR"
            >
              {copiedKey === 'pnr' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        {/* Airport Flight Path */}
        <div className="pt-3 grid grid-cols-3 items-center text-center">
          <div className="text-left">
            <span className="text-2xl font-black text-white tracking-tight">
              {origin.value.split('·')[0].trim()}
            </span>
            <p className="text-xs text-[#AAA] truncate">{origin.value.split('·')[1]?.trim() || origin.value}</p>
            <p className="text-xs font-semibold text-rose-400 mt-1">{depTime.value}</p>
          </div>

          <div className="flex flex-col items-center">
            <Plane className="w-5 h-5 text-rose-400 rotate-90 my-1 animate-pulse" />
            <div className="w-full border-t border-dashed border-[#444]" />
            <span className="text-[10px] text-[#888] mt-1">{terminal.value}</span>
          </div>

          <div className="text-right">
            <span className="text-2xl font-black text-white tracking-tight">
              {dest.value.split('·')[0].trim()}
            </span>
            <p className="text-xs text-[#AAA] truncate">{dest.value.split('·')[1]?.trim() || dest.value}</p>
            <p className="text-xs font-semibold text-blue-400 mt-1">{arrTime.value}</p>
          </div>
        </div>
      </div>

      {/* Meta Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
        <div className="p-3 rounded-xl bg-[#161616] border border-[#222]">
          <span className="text-[10px] uppercase font-bold text-[#666] block">Gate</span>
          <span className="text-sm font-bold text-white font-mono mt-0.5 block">{gate.value}</span>
          <ProvenanceBadge provenance={gate.provenance} compact />
        </div>

        <div className="p-3 rounded-xl bg-[#161616] border border-[#222]">
          <span className="text-[10px] uppercase font-bold text-[#666] block">Terminal</span>
          <span className="text-sm font-bold text-white mt-0.5 block">{terminal.value}</span>
          <ProvenanceBadge provenance={terminal.provenance} compact />
        </div>

        <div className="p-3 rounded-xl bg-[#161616] border border-[#222] col-span-2 sm:col-span-1">
          <span className="text-[10px] uppercase font-bold text-rose-400 block">Check-in Closes</span>
          <span className="text-xs font-bold text-white mt-0.5 block">{checkinDeadline.value}</span>
          <ProvenanceBadge provenance={checkinDeadline.provenance || 'inferred'} compact />
        </div>
      </div>

      {/* Simulated Boarding Barcode */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
        <div className="font-mono text-[10px] tracking-widest text-[#888] select-all">
          ||| | |||| || | ||||| ||| |||| | ||| | ||||
        </div>
        <span className="text-[10px] font-mono font-bold text-[#AAA]">BOARDING PASS STUB</span>
      </div>
    </div>
  );
};

// ==========================================
// 2. PAYMENT / BILL CARD LAYOUT
// ==========================================
const PaymentLayout: React.FC<{
  screenshot: ScreenshotItem;
  getEntity: (k: string) => ExtractedEntity | undefined;
  handleCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}> = ({ screenshot, getEntity, handleCopy, copiedKey }) => {
  const amount = getEntity('amount') || { value: '₹2,499.00', label: 'Amount' };
  const merchant = getEntity('merchant') || getEntity('payee') || { value: 'BESCOM Electricity', label: 'Merchant' };
  const dueDate = getEntity('due_date') || getEntity('date') || { value: 'Aug 15, 2026', label: 'Due Date' };
  const billNum = getEntity('bill_number') || getEntity('reference') || { value: 'EB-992014', label: 'Bill #' };
  const lateFee = getEntity('late_fee') || { value: '+₹150.00 post due', label: 'Late Fee', provenance: 'extracted' as const };
  const upiId = getEntity('upi_id') || { value: 'bescom.electric@icici', label: 'UPI ID' };

  return (
    <div className="space-y-4">
      {/* Bill Amount Header */}
      <div className="rounded-2xl p-4 bg-gradient-to-br from-emerald-950/40 via-[#181818] to-slate-900/30 border border-emerald-900/30 flex items-center justify-between">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs uppercase font-bold text-[#888]">Total Amount Due</span>
            <ProvenanceBadge provenance={amount.provenance} compact />
          </div>
          <div className="text-3xl font-extrabold text-white mt-1 font-mono tracking-tight">
            {amount.value}
          </div>
          <span className="text-xs text-emerald-400 font-semibold mt-1 block">
            Payee: {merchant.value}
          </span>
        </div>

        <div className="text-right space-y-1">
          <span className="inline-block px-2.5 py-1 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300 font-bold text-xs">
            Due {dueDate.value}
          </span>
          <span className="text-[10px] text-rose-400 block font-medium">{lateFee.value}</span>
        </div>
      </div>

      {/* Payment Reference Details */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-[#161616] border border-[#222]">
          <span className="text-[10px] uppercase font-bold text-[#666] block">Bill / Ref #</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-mono font-bold text-white truncate">{billNum.value}</span>
            <button
              onClick={() => handleCopy(billNum.value, 'bill_ref')}
              className="text-[#888] hover:text-white"
            >
              {copiedKey === 'bill_ref' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#161616] border border-[#222]">
          <span className="text-[10px] uppercase font-bold text-[#666] block">Payment Channel / UPI</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-mono text-[#DDD] truncate">{upiId.value}</span>
            <button
              onClick={() => handleCopy(upiId.value, 'upi')}
              className="text-[#888] hover:text-white"
            >
              {copiedKey === 'upi' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 3. RECEIPT & WARRANTY CARD LAYOUT
// ==========================================
const ReceiptLayout: React.FC<{
  screenshot: ScreenshotItem;
  getEntity: (k: string) => ExtractedEntity | undefined;
  handleCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}> = ({ screenshot, getEntity, handleCopy, copiedKey }) => {
  const merchant = getEntity('merchant') || getEntity('store') || { value: 'Apple Store', label: 'Store' };
  const product = getEntity('product') || getEntity('item') || { value: 'MacBook Pro 16" M3 Max', label: 'Product' };
  const purchaseDate = getEntity('purchase_date') || getEntity('date') || { value: 'Oct 01, 2026', label: 'Purchase Date' };
  const purchaseAmount = getEntity('total_amount') || getEntity('amount') || { value: '$2,499.00', label: 'Total Paid' };
  const warrantyDate = getEntity('warranty_expiry') || getEntity('warranty') || {
    value: 'Oct 01, 2027 (1-Year AppleCare)',
    label: 'Warranty Expiry',
    provenance: 'verified' as const,
  };
  const receiptNumber = getEntity('receipt_number') || { value: 'RCP-8839210', label: 'Receipt #' };

  return (
    <div className="space-y-4">
      {/* Official Receipt Banner */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-slate-900 via-[#181818] to-purple-950/30 border border-purple-900/30">
        <div className="flex items-center justify-between pb-2 border-b border-[#262626]">
          <div>
            <span className="text-base font-bold text-white">{merchant.value}</span>
            <span className="text-xs text-[#888] block">Proof of Purchase Verified</span>
          </div>
          <span className="text-xl font-extrabold text-white font-mono">{purchaseAmount.value}</span>
        </div>

        <div className="pt-3 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-[#666] uppercase font-bold">Purchased Product</span>
            <p className="text-sm font-semibold text-[#EDEDED]">{product.value}</p>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[#666] uppercase font-bold">Purchase Date</span>
            <p className="text-xs font-mono text-[#AAA]">{purchaseDate.value}</p>
          </div>
        </div>
      </div>

      {/* Explicit Warranty Callout Banner */}
      <div className="rounded-2xl p-3.5 bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-emerald-300">Warranty Coverage Active</span>
            <ProvenanceBadge provenance={warrantyDate.provenance || 'verified'} compact />
          </div>
          <p className="text-xs text-[#DDD]">
            Expires: <span className="font-bold text-white">{warrantyDate.value}</span>
          </p>
        </div>
        <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/60 px-2 py-1 rounded-lg border border-emerald-800/40">
          Under Warranty
        </span>
      </div>

      {/* Receipt # reference */}
      <div className="p-3 rounded-xl bg-[#161616] border border-[#222] flex items-center justify-between">
        <span className="text-xs text-[#888]">Receipt ID: <span className="font-mono text-white">{receiptNumber.value}</span></span>
        <button
          onClick={() => handleCopy(receiptNumber.value, 'receipt_num')}
          className="text-xs text-blue-400 hover:text-blue-300 flex items-center space-x-1"
        >
          {copiedKey === 'receipt_num' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>Copy</span>
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 4. PACKAGE / DELIVERY TRACKING LAYOUT
// ==========================================
const PackageLayout: React.FC<{
  screenshot: ScreenshotItem;
  getEntity: (k: string) => ExtractedEntity | undefined;
  handleCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}> = ({ screenshot, getEntity, handleCopy, copiedKey }) => {
  const carrier = getEntity('carrier') || { value: 'Amazon Logistics', label: 'Carrier' };
  const trackingNumber = getEntity('tracking_number') || getEntity('tracking_id') || { value: 'AMZN-IN-8893120', label: 'Tracking #' };
  const estDelivery = getEntity('estimated_delivery') || getEntity('delivery_date') || { value: 'Aug 12 · by 8:00 PM', label: 'Estimated Delivery' };
  const destination = getEntity('destination') || getEntity('delivery_address') || { value: 'San Francisco, CA 94102', label: 'Destination', provenance: 'verified' as const };
  const item = getEntity('item') || getEntity('product') || { value: 'Sony WH-1000XM5 Headphones', label: 'Package Contents' };

  return (
    <div className="space-y-4">
      {/* Top Delivery Status */}
      <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-950/40 via-[#181818] to-amber-950/30 border border-blue-900/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
              IN TRANSIT
            </span>
            <ProvenanceBadge provenance={trackingNumber.provenance || 'verified'} compact />
          </div>
          <span className="text-xs font-bold text-[#AAA]">{carrier.value}</span>
        </div>

        <div className="mt-3">
          <span className="text-xs text-[#888]">Estimated Delivery:</span>
          <div className="text-xl font-bold text-white mt-0.5">{estDelivery.value}</div>
          <p className="text-xs text-[#BBB] mt-1">{item.value}</p>
        </div>

        {/* Milestone Steps */}
        <div className="mt-4 pt-3 border-t border-[#262626]">
          <div className="flex items-center justify-between text-[10px] text-[#888] mb-1.5">
            <span className="text-blue-400 font-bold">Ordered</span>
            <span className="text-blue-400 font-bold">Shipped</span>
            <span className="text-amber-400 font-bold">In Transit</span>
            <span>Delivered</span>
          </div>
          <div className="w-full bg-[#262626] h-2 rounded-full overflow-hidden flex">
            <div className="w-3/4 bg-gradient-to-r from-blue-500 to-amber-500 h-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Tracking Number & Verified Destination */}
      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-[#161616] border border-[#222]">
          <span className="text-[10px] uppercase font-bold text-[#666] block">Tracking #</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-mono font-bold text-white truncate">{trackingNumber.value}</span>
            <button
              onClick={() => handleCopy(trackingNumber.value, 'pkg_track')}
              className="text-[#888] hover:text-white"
            >
              {copiedKey === 'pkg_track' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#161616] border border-[#222]">
          <span className="text-[10px] uppercase font-bold text-[#666] block">Verified Destination</span>
          <span className="text-xs font-medium text-[#EDEDED] truncate mt-1 block">{destination.value}</span>
          <ProvenanceBadge provenance={destination.provenance || 'verified'} compact />
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. ADDRESS & PLACE CARD LAYOUT
// ==========================================
const AddressLayout: React.FC<{
  screenshot: ScreenshotItem;
  getEntity: (k: string) => ExtractedEntity | undefined;
  handleCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}> = ({ screenshot, getEntity, handleCopy, copiedKey }) => {
  const place = getEntity('place_name') || getEntity('name') || { value: 'Blue Bottle Coffee', label: 'Place Name' };
  const address = getEntity('address') || getEntity('location') || { value: '315 Linden St, San Francisco, CA 94102', label: 'Address' };
  const phone = getEntity('phone') || { value: '+1 (415) 252-7535', label: 'Phone' };
  const hours = getEntity('hours') || { value: 'Open · Closes 6:00 PM', label: 'Hours' };
  const rating = getEntity('rating') || { value: '★ 4.7 (1,840 reviews)', label: 'Rating' };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-gradient-to-r from-sky-950/40 via-[#181818] to-slate-900/40 border border-sky-900/30">
        <div className="flex items-center justify-between">
          <span className="text-xs text-emerald-400 font-semibold">{hours.value}</span>
          <span className="text-xs text-[#AAA]">{rating.value}</span>
        </div>
        <h3 className="text-xl font-bold text-white mt-1">{place.value}</h3>
        <p className="text-xs text-[#DDD] mt-2 flex items-start space-x-1.5">
          <MapPin className="w-4 h-4 text-sky-400 flex-shrink-0 mt-0.5" />
          <span>{address.value}</span>
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-[#161616] border border-[#222]">
          <span className="text-[10px] uppercase font-bold text-[#666] block">Phone Contact</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-mono text-white truncate">{phone.value}</span>
            <button
              onClick={() => handleCopy(phone.value, 'phone')}
              className="text-[#888] hover:text-white"
            >
              {copiedKey === 'phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#161616] border border-[#222]">
          <span className="text-[10px] uppercase font-bold text-[#666] block">Quick Copy</span>
          <button
            onClick={() => handleCopy(address.value, 'addr')}
            className="w-full text-left text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center justify-between mt-1"
          >
            <span>{copiedKey === 'addr' ? 'Address Copied!' : 'Copy Full Address'}</span>
            <Copy className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 6. TASK & DEADLINE CARD LAYOUT
// ==========================================
const TaskLayout: React.FC<{
  screenshot: ScreenshotItem;
  getEntity: (k: string) => ExtractedEntity | undefined;
  isDone: boolean;
  onToggleDone: () => void;
  handleCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}> = ({ screenshot, getEntity, isDone, onToggleDone, handleCopy, copiedKey }) => {
  const taskDesc = getEntity('task_description') || getEntity('task') || {
    value: 'Finish QA sign-off and submit Security Audit Checklist',
    label: 'Task',
  };
  const deadline = getEntity('deadline') || getEntity('due_date') || { value: 'Tomorrow · 5:00 PM', label: 'Deadline' };
  const priority = getEntity('priority') || { value: 'High', label: 'Priority', provenance: 'extracted' as const };
  const project = getEntity('project') || { value: 'Apollo Release v3.2', label: 'Project' };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-950/40 via-[#181818] to-purple-950/30 border border-blue-900/30">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            checked={isDone}
            onChange={onToggleDone}
            className="w-5 h-5 rounded-md mt-0.5 accent-blue-600 cursor-pointer"
          />
          <div className="flex-1">
            <p className={`text-sm font-semibold ${isDone ? 'line-through text-[#666]' : 'text-white'}`}>
              {taskDesc.value}
            </p>
            <div className="flex items-center space-x-2 mt-2">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs font-bold text-amber-300">Deadline: {deadline.value}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 7. EVENT & APPOINTMENT CARD LAYOUT
// ==========================================
const EventLayout: React.FC<{
  screenshot: ScreenshotItem;
  getEntity: (k: string) => ExtractedEntity | undefined;
  handleCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}> = ({ screenshot, getEntity, handleCopy, copiedKey }) => {
  const title = getEntity('event_title') || getEntity('title') || { value: 'Design Systems & AI Conf 2026', label: 'Event' };
  const date = getEntity('date') || { value: 'Oct 24, 2026', label: 'Date' };
  const time = getEntity('time') || { value: '10:00 AM – 12:30 PM PDT', label: 'Time' };
  const venue = getEntity('location') || getEntity('link') || { value: 'Hall B · San Jose Conv Center / Virtual', label: 'Location' };
  const organizer = getEntity('organizer') || { value: 'Design Systems Guild', label: 'Organizer' };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-950/40 via-[#181818] to-cyan-950/30 border border-blue-900/30 flex items-center space-x-4">
        {/* Calendar Day Block */}
        <div className="w-16 h-18 rounded-xl bg-[#222] border border-[#333] flex flex-col items-center justify-center overflow-hidden flex-shrink-0">
          <div className="w-full bg-blue-600 py-0.5 text-center text-[10px] font-bold text-white uppercase tracking-wider">
            {date.value.split(' ')[0] || 'OCT'}
          </div>
          <div className="text-xl font-black text-white font-mono py-1">
            {date.value.split(' ')[1]?.replace(',', '') || '24'}
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <span className="text-[10px] text-blue-400 uppercase font-bold tracking-wider">{organizer.value}</span>
          <h3 className="text-base font-bold text-white truncate">{title.value}</h3>
          <p className="text-xs text-[#BBB] mt-0.5">{time.value}</p>
        </div>
      </div>

      <div className="p-3 rounded-xl bg-[#161616] border border-[#222] flex items-center justify-between">
        <div className="flex items-center space-x-2 truncate">
          <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
          <span className="text-xs text-[#EDEDED] truncate">{venue.value}</span>
        </div>
        <button
          onClick={() => handleCopy(venue.value, 'event_loc')}
          className="text-[#888] hover:text-white flex-shrink-0 ml-2"
        >
          {copiedKey === 'event_loc' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 8. CONTACT / BUSINESS CARD LAYOUT
// ==========================================
const ContactLayout: React.FC<{
  screenshot: ScreenshotItem;
  getEntity: (k: string) => ExtractedEntity | undefined;
  handleCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}> = ({ screenshot, getEntity, handleCopy, copiedKey }) => {
  const name = getEntity('contact_name') || getEntity('name') || { value: 'Sarah Chen', label: 'Name' };
  const title = getEntity('title') || getEntity('role') || { value: 'VP Engineering', label: 'Title' };
  const company = getEntity('organization') || getEntity('company') || { value: 'Stripe', label: 'Company' };
  const phone = getEntity('phone') || { value: '+1 (415) 890-2134', label: 'Phone' };
  const email = getEntity('email') || { value: 'sarah.chen@stripe.com', label: 'Email' };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-gradient-to-r from-teal-950/40 via-[#181818] to-slate-900/30 border border-teal-900/30 flex items-center space-x-3.5">
        <div className="w-12 h-12 rounded-2xl bg-teal-600/20 text-teal-300 border border-teal-500/30 flex items-center justify-center font-bold text-lg">
          {name.value.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-white truncate">{name.value}</h3>
          <p className="text-xs text-teal-400 font-medium">{title.value} · {company.value}</p>
        </div>
        <button
          onClick={() =>
            downloadVCardFile({
              name: name.value,
              title: title.value,
              organization: company.value,
              phone: phone.value,
              email: email.value,
            })
          }
          className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white text-xs font-semibold flex items-center space-x-1"
        >
          <Download className="w-3 h-3" />
          <span>vCard</span>
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2.5">
        <div className="p-3 rounded-xl bg-[#161616] border border-[#222]">
          <span className="text-[10px] uppercase font-bold text-[#666] block">Phone</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-mono text-white truncate">{phone.value}</span>
            <button onClick={() => handleCopy(phone.value, 'c_phone')} className="text-[#888] hover:text-white">
              {copiedKey === 'c_phone' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#161616] border border-[#222]">
          <span className="text-[10px] uppercase font-bold text-[#666] block">Email</span>
          <div className="flex items-center justify-between mt-1">
            <span className="text-xs font-mono text-white truncate">{email.value}</span>
            <button onClick={() => handleCopy(email.value, 'c_email')} className="text-[#888] hover:text-white">
              {copiedKey === 'c_email' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 9. WEB LINK & ARTICLE CARD LAYOUT
// ==========================================
const LinkLayout: React.FC<{
  screenshot: ScreenshotItem;
  getEntity: (k: string) => ExtractedEntity | undefined;
  handleCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}> = ({ screenshot, getEntity, handleCopy, copiedKey }) => {
  const url = getEntity('url') || { value: 'https://ux-systems.dev/latency-free-vision', label: 'URL' };
  const author = getEntity('author') || { value: 'Alex Rivera', label: 'Author' };
  const readTime = getEntity('read_time') || { value: '6 min read', label: 'Read Time' };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-gradient-to-r from-blue-950/40 via-[#181818] to-slate-900/30 border border-blue-900/30">
        <div className="flex items-center justify-between text-xs text-[#888]">
          <span className="font-mono text-blue-400">ux-systems.dev</span>
          <span>{readTime.value} · By {author.value}</span>
        </div>
        <h3 className="text-base font-bold text-white mt-1.5">{screenshot.title}</h3>
        <p className="text-xs text-[#AAA] mt-2 line-clamp-2">{screenshot.summary}</p>
      </div>

      <div className="p-3 rounded-xl bg-[#161616] border border-[#222] flex items-center justify-between">
        <span className="text-xs font-mono text-blue-400 truncate max-w-[240px]">{url.value}</span>
        <button
          onClick={() => handleCopy(url.value, 'link_url')}
          className="text-xs text-[#888] hover:text-white flex items-center space-x-1"
        >
          {copiedKey === 'link_url' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          <span>Copy URL</span>
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 10. GITHUB & TECH REPO CARD LAYOUT
// ==========================================
const GithubLayout: React.FC<{
  screenshot: ScreenshotItem;
  getEntity: (k: string) => ExtractedEntity | undefined;
  handleCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}> = ({ screenshot, getEntity, handleCopy, copiedKey }) => {
  const repo = getEntity('repo_name') || { value: 'shadcn/ui', label: 'Repository' };
  const stars = getEntity('stars') || { value: '★ 68.4k', label: 'Stars' };
  const language = getEntity('language') || { value: 'TypeScript', label: 'Language' };
  const clone = getEntity('clone_command') || { value: 'git clone https://github.com/shadcn-ui/ui.git', label: 'Clone' };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-gradient-to-r from-slate-900 via-[#181818] to-zinc-900/50 border border-[#333]">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Github className="w-5 h-5 text-white" />
            <span className="text-base font-bold text-white font-mono">{repo.value}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-xs text-amber-400 font-bold">{stars.value}</span>
            <span className="text-[10px] text-blue-300 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/30">
              {language.value}
            </span>
          </div>
        </div>
        <p className="text-xs text-[#AAA] mt-2">{screenshot.summary}</p>
      </div>

      {/* Terminal Clone snippet */}
      <div className="p-3 rounded-xl bg-[#090909] border border-[#222] font-mono flex items-center justify-between">
        <span className="text-xs text-emerald-400 truncate max-w-[260px]">{clone.value}</span>
        <button
          onClick={() => handleCopy(clone.value, 'clone')}
          className="text-[#888] hover:text-white ml-2 flex-shrink-0"
        >
          {copiedKey === 'clone' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
      </div>
    </div>
  );
};

// ==========================================
// 11. DOCUMENT / SUMMARY CARD LAYOUT
// ==========================================
const DocumentLayout: React.FC<{
  screenshot: ScreenshotItem;
  getEntity: (k: string) => ExtractedEntity | undefined;
  handleCopy: (t: string, k: string) => void;
  copiedKey: string | null;
}> = ({ screenshot, getEntity, handleCopy, copiedKey }) => {
  const docType = getEntity('document_type') || { value: 'Reference Agreement', label: 'Type' };
  const date = getEntity('date') || { value: new Date().toLocaleDateString(), label: 'Date' };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl p-4 bg-[#161616] border border-[#262626]">
        <div className="flex items-center justify-between pb-2 border-b border-[#222]">
          <span className="text-xs font-bold text-blue-400 uppercase tracking-wider">{docType.value}</span>
          <span className="text-xs text-[#888]">{date.value}</span>
        </div>
        <h3 className="text-base font-bold text-white mt-2">{screenshot.title}</h3>
        <p className="text-xs text-[#AAA] mt-1">{screenshot.summary}</p>
      </div>

      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold text-[#666] tracking-wider block">Key Extracted Takeaways</span>
        <div className="rounded-xl bg-[#141414] border border-[#222] p-3 space-y-1.5">
          {screenshot.extractedEntities.slice(0, 4).map((e) => (
            <div key={e.key} className="flex items-center justify-between text-xs">
              <span className="text-[#888]">{e.label}:</span>
              <span className="font-medium text-white truncate max-w-[200px]">{e.value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// ==========================================
// CATEGORY META HELPERS
// ==========================================
function getCategoryIcon(cat: string) {
  switch (cat) {
    case 'ticket':
    case 'travel':
      return '✈️';
    case 'payment':
      return '💳';
    case 'receipt':
      return '🧾';
    case 'package':
      return '📦';
    case 'address':
      return '📍';
    case 'task':
      return '📝';
    case 'event':
      return '📅';
    case 'contact':
      return '👤';
    case 'link':
      return '🔗';
    case 'github':
      return '🐙';
    case 'document':
      return '📄';
    default:
      return '✨';
  }
}

function getCategoryLabel(cat: string) {
  switch (cat) {
    case 'ticket':
    case 'travel':
      return 'Ticket & Boarding Pass';
    case 'payment':
      return 'Payment & Bill';
    case 'receipt':
      return 'Receipt & Warranty';
    case 'package':
      return 'Package Tracking';
    case 'address':
      return 'Address & Location';
    case 'task':
      return 'Task & Action';
    case 'event':
      return 'Event & Appointment';
    case 'contact':
      return 'Contact & Profile';
    case 'link':
      return 'Web Link & Article';
    case 'github':
      return 'GitHub & Tech Resource';
    case 'document':
      return 'Document & Reference';
    default:
      return 'Extracted Resource';
  }
}
