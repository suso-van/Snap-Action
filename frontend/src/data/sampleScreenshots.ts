import { ScreenshotItem, SuggestedAction } from '../types';

// Helper to generate realistic high-contrast mobile screenshots as SVG data URLs
function createSvgDataUrl(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

// 1. Flight Confirmation Boarding Pass SVG
const flightSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <defs>
    <linearGradient id="flightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0f172a" />
      <stop offset="100%" stop-color="#1e293b" />
    </linearGradient>
  </defs>
  <rect width="400" height="700" fill="url(#flightGrad)" rx="28" />
  <text x="32" y="36" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">9:41</text>
  <rect x="370" y="27" width="14" height="9" rx="2" fill="#94a3b8" />
  <rect x="20" y="60" width="360" height="60" rx="16" fill="#1e293b" />
  <text x="40" y="96" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="16" font-weight="700">Air India Express</text>
  <rect x="290" y="78" width="75" height="24" rx="12" fill="#dc2626" />
  <text x="302" y="94" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="700">CONFIRMED</text>

  <g transform="translate(20, 136)">
    <rect width="360" height="420" rx="20" fill="#ffffff" />
    <rect width="360" height="64" rx="20 20 0 0" fill="#dc2626" />
    <text x="24" y="38" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="800">AI-302</text>
    <text x="240" y="38" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600">Economy Class</text>

    <g transform="translate(24, 90)">
      <text x="0" y="24" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="800">CCU</text>
      <text x="0" y="44" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Kolkata</text>
      <text x="0" y="72" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="700">8:40 PM</text>
      <text x="0" y="90" fill="#dc2626" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">Terminal 2</text>

      <line x1="100" y1="40" x2="210" y2="40" stroke="#cbd5e1" stroke-width="2" stroke-dasharray="4,4" />
      <circle cx="155" cy="40" r="14" fill="#fee2e2" />
      <path d="M150 40 L160 36 L158 40 L160 44 Z" fill="#dc2626" />

      <text x="240" y="24" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="28" font-weight="800">DEL</text>
      <text x="240" y="44" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">New Delhi</text>
      <text x="240" y="72" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="20" font-weight="700">10:55 PM</text>
      <text x="240" y="90" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Terminal 3</text>
    </g>

    <line x1="16" y1="210" x2="344" y2="210" stroke="#e2e8f0" stroke-width="1.5" stroke-dasharray="6,6" />
    <g transform="translate(24, 230)">
      <text x="0" y="16" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="600">DATE</text>
      <text x="0" y="36" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="700">Aug 18, 2026</text>
      <text x="160" y="16" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="600">PNR / BOOKING</text>
      <text x="160" y="36" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="700">AI889Q4</text>
      <text x="0" y="76" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="600">GATE</text>
      <text x="0" y="96" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="700">14B</text>
      <text x="160" y="76" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="11" font-weight="600">CHECK-IN CLOSES</text>
      <text x="160" y="96" fill="#dc2626" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="700">7:40 PM (1h prior)</text>
    </g>
    <g transform="translate(40, 356)">
      <rect x="0" y="0" width="280" height="40" fill="#f8fafc" rx="6" />
      <line x1="20" y1="8" x2="20" y2="32" stroke="#0f172a" stroke-width="3" />
      <line x1="32" y1="8" x2="32" y2="32" stroke="#0f172a" stroke-width="4" />
      <line x1="50" y1="8" x2="50" y2="32" stroke="#0f172a" stroke-width="3" />
      <line x1="70" y1="8" x2="70" y2="32" stroke="#0f172a" stroke-width="4" />
      <line x1="110" y1="8" x2="110" y2="32" stroke="#0f172a" stroke-width="3" />
      <line x1="150" y1="8" x2="150" y2="32" stroke="#0f172a" stroke-width="4" />
      <line x1="200" y1="8" x2="200" y2="32" stroke="#0f172a" stroke-width="3" />
      <line x1="240" y1="8" x2="240" y2="32" stroke="#0f172a" stroke-width="4" />
    </g>
  </g>
</svg>
`);

// 2. Payment Bill Due SVG
const paymentSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <rect width="400" height="700" fill="#022c22" rx="28" />
  <text x="32" y="36" fill="#a7f3d0" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">10:14</text>
  <rect x="370" y="27" width="14" height="9" rx="2" fill="#a7f3d0" />
  <g transform="translate(20, 60)">
    <rect width="360" height="60" rx="16" fill="#065f46" />
    <circle cx="44" cy="30" r="16" fill="#10b981" />
    <text x="38" y="36" fill="#ffffff" font-size="16">⚡</text>
    <text x="72" y="28" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="15" font-weight="700">BESCOM Electricity</text>
    <text x="72" y="44" fill="#a7f3d0" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12">Consumer ID: 48291094</text>
  </g>
  <g transform="translate(20, 140)">
    <rect width="360" height="420" rx="20" fill="#ffffff" />
    <text x="24" y="40" fill="#64748b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="13" font-weight="600">TOTAL AMOUNT DUE</text>
    <text x="24" y="85" fill="#0f172a" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="38" font-weight="800">₹2,499.00</text>
    <rect x="24" y="102" width="130" height="26" rx="8" fill="#fee2e2" />
    <text x="34" y="120" fill="#b91c1c" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="700">Due in 6 days</text>
    <line x1="24" y1="148" x2="336" y2="148" stroke="#e2e8f0" stroke-width="1.5" />
    <g transform="translate(24, 170)">
      <text x="0" y="14" fill="#64748b" font-size="12">Due Date</text>
      <text x="180" y="14" fill="#0f172a" font-size="13" font-weight="700" text-anchor="end">Aug 15, 2026</text>
      <text x="0" y="50" fill="#64748b" font-size="12">Bill Number</text>
      <text x="180" y="50" fill="#0f172a" font-size="13" font-weight="700" text-anchor="end">EB-992014</text>
      <text x="0" y="86" fill="#64748b" font-size="12">Late Fee (Post Due)</text>
      <text x="180" y="86" fill="#dc2626" font-size="13" font-weight="700" text-anchor="end">+₹150.00</text>
    </g>
    <rect x="24" y="320" width="312" height="70" rx="12" fill="#f8fafc" stroke="#e2e8f0" />
    <text x="40" y="344" fill="#0f172a" font-size="13" font-weight="700">UPI / Net Banking</text>
    <text x="40" y="364" fill="#64748b" font-size="11">UPI ID: bescom.electric@icici</text>
  </g>
</svg>
`);

// 3. Receipt & Warranty SVG
const receiptSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <rect width="400" height="700" fill="#18181b" rx="28" />
  <text x="32" y="36" fill="#a1a1aa" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">15:10</text>
  <rect x="370" y="27" width="14" height="9" rx="2" fill="#a1a1aa" />
  <g transform="translate(20, 60)">
    <rect width="360" height="580" rx="18" fill="#ffffff" />
    <g transform="translate(24, 30)">
      <text x="0" y="20" fill="#18181b" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="22" font-weight="800">Apple Store</text>
      <text x="0" y="38" fill="#71717a" font-size="12">San Francisco Union Square · Store #R142</text>
      <text x="0" y="54" fill="#71717a" font-size="11">Receipt #: RCP-8839210 · Oct 01, 2026</text>
    </g>
    <line x1="24" y1="100" x2="336" y2="100" stroke="#e4e4e7" stroke-width="1.5" />
    <g transform="translate(24, 120)">
      <text x="0" y="20" fill="#18181b" font-size="14" font-weight="700">MacBook Pro 16" (M3 Max)</text>
      <text x="0" y="38" fill="#71717a" font-size="12">Space Black · 36GB / 1TB · SN: C02XG789L</text>
      <text x="312" y="20" fill="#18181b" font-size="14" font-weight="700" text-anchor="end">$2,499.00</text>
    </g>
    <g transform="translate(24, 175)">
      <rect width="312" height="75" rx="12" fill="#f0fdf4" stroke="#bbf7d0" />
      <text x="16" y="24" fill="#166534" font-size="12" font-weight="700">🛡️ 1-Year AppleCare Warranty Included</text>
      <text x="16" y="44" fill="#15803d" font-size="11">Coverage active through: Oct 01, 2027</text>
      <text x="16" y="60" fill="#4ade80" font-size="10">Verified with Apple Hardware Agreement</text>
    </g>
    <g transform="translate(24, 275)">
      <text x="0" y="20" fill="#71717a" font-size="12">Subtotal</text>
      <text x="312" y="20" fill="#18181b" font-size="12" text-anchor="end">$2,499.00</text>
      <text x="0" y="40" fill="#71717a" font-size="12">Tax (8.625%)</text>
      <text x="312" y="40" fill="#18181b" font-size="12" text-anchor="end">$215.54</text>
      <line x1="0" y1="55" x2="312" y2="55" stroke="#e4e4e7" stroke-width="1.5" />
      <text x="0" y="78" fill="#18181b" font-size="16" font-weight="800">Total Paid</text>
      <text x="312" y="78" fill="#18181b" font-size="18" font-weight="800" text-anchor="end">$2,714.54</text>
      <text x="0" y="104" fill="#71717a" font-size="11">Visa ending in •••• 4092 (Apple Pay)</text>
    </g>
    <g transform="translate(40, 420)">
      <rect width="280" height="40" fill="#f4f4f5" rx="6" />
      <line x1="20" y1="8" x2="20" y2="32" stroke="#18181b" stroke-width="3" />
      <line x1="40" y1="8" x2="40" y2="32" stroke="#18181b" stroke-width="2" />
      <line x1="70" y1="8" x2="70" y2="32" stroke="#18181b" stroke-width="4" />
      <line x1="120" y1="8" x2="120" y2="32" stroke="#18181b" stroke-width="3" />
      <line x1="180" y1="8" x2="180" y2="32" stroke="#18181b" stroke-width="4" />
      <line x1="240" y1="8" x2="240" y2="32" stroke="#18181b" stroke-width="2" />
    </g>
  </g>
</svg>
`);

// 4. Amazon Package SVG
const packageSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <rect width="400" height="700" fill="#0f172a" rx="28" />
  <text x="32" y="36" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">14:22</text>
  <rect x="370" y="27" width="14" height="9" rx="2" fill="#94a3b8" />
  <g transform="translate(20, 60)">
    <rect width="360" height="54" rx="14" fill="#1e293b" />
    <text x="32" y="34" fill="#fbbf24" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="18" font-weight="800">amazon</text>
    <text x="100" y="34" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600">Your Orders</text>
  </g>
  <g transform="translate(20, 130)">
    <rect width="360" height="430" rx="20" fill="#ffffff" />
    <rect x="24" y="24" width="85" height="24" rx="6" fill="#dbeafe" />
    <text x="32" y="40" fill="#1d4ed8" font-size="11" font-weight="700">IN TRANSIT</text>
    <text x="24" y="78" fill="#0f172a" font-size="22" font-weight="800">Arriving Aug 12</text>
    <text x="24" y="98" fill="#64748b" font-size="13">Expected by 8:00 PM</text>
    <g transform="translate(24, 120)">
      <line x1="0" y1="12" x2="312" y2="12" stroke="#e2e8f0" stroke-width="4" stroke-linecap="round" />
      <line x1="0" y1="12" x2="200" y2="12" stroke="#3b82f6" stroke-width="4" stroke-linecap="round" />
      <circle cx="0" cy="12" r="7" fill="#3b82f6" />
      <circle cx="100" cy="12" r="7" fill="#3b82f6" />
      <circle cx="200" cy="12" r="9" fill="#3b82f6" stroke="#ffffff" stroke-width="2" />
      <circle cx="312" cy="12" r="7" fill="#cbd5e1" />
      <text x="0" y="32" fill="#0f172a" font-size="10" font-weight="600">Ordered</text>
      <text x="82" y="32" fill="#0f172a" font-size="10" font-weight="600">Shipped</text>
      <text x="175" y="32" fill="#1d4ed8" font-size="10" font-weight="700">In Transit</text>
      <text x="280" y="32" fill="#94a3b8" font-size="10">Delivered</text>
    </g>
    <g transform="translate(24, 184)">
      <rect width="312" height="80" rx="12" fill="#f8fafc" stroke="#e2e8f0" />
      <text x="20" y="46" font-size="24">🎧</text>
      <text x="64" y="34" fill="#0f172a" font-size="13" font-weight="700">Sony WH-1000XM5</text>
      <text x="64" y="52" fill="#64748b" font-size="11">Noise Canceling Headphones · Black</text>
    </g>
    <g transform="translate(24, 280)">
      <text x="0" y="16" fill="#64748b" font-size="11" font-weight="600">CARRIER</text>
      <text x="0" y="34" fill="#0f172a" font-size="14" font-weight="700">Amazon Logistics</text>
      <text x="160" y="16" fill="#64748b" font-size="11" font-weight="600">TRACKING ID</text>
      <text x="160" y="34" fill="#0f172a" font-size="14" font-weight="700">AMZN-IN-8893120</text>
      <text x="0" y="74" fill="#64748b" font-size="11" font-weight="600">DESTINATION</text>
      <text x="0" y="92" fill="#0f172a" font-size="13" font-weight="600">San Francisco, CA 94102</text>
    </g>
  </g>
</svg>
`);

// 5. Address & Place SVG
const addressSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <rect width="400" height="700" fill="#0f172a" rx="28" />
  <text x="32" y="36" fill="#94a3b8" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">11:30</text>
  <rect x="370" y="27" width="14" height="9" rx="2" fill="#94a3b8" />
  <g transform="translate(20, 60)">
    <rect width="360" height="50" rx="25" fill="#1e293b" />
    <circle cx="40" cy="25" r="12" fill="#3b82f6" />
    <text x="35" y="30" fill="#ffffff" font-size="12">📍</text>
    <text x="64" y="31" fill="#ffffff" font-size="14" font-weight="600">Blue Bottle Coffee Hayes Valley</text>
  </g>
  <g transform="translate(20, 126)">
    <rect width="360" height="434" rx="20" fill="#ffffff" />
    <rect width="360" height="150" rx="20 20 0 0" fill="#0284c7" />
    <text x="30" y="80" fill="#ffffff" font-size="22" font-weight="800">Blue Bottle Coffee</text>
    <text x="30" y="104" fill="#e0f2fe" font-size="13">Artisanal Espresso &amp; Pastries</text>
    <g transform="translate(24, 170)">
      <text x="0" y="16" fill="#059669" font-size="13" font-weight="700">Open · Closes 6:00 PM</text>
      <text x="180" y="16" fill="#64748b" font-size="12">★ 4.7 (1,840 reviews)</text>
      <text x="0" y="54" fill="#64748b" font-size="11" font-weight="600">FULL ADDRESS</text>
      <text x="0" y="76" fill="#0f172a" font-size="14" font-weight="700">315 Linden St, San Francisco, CA 94102</text>
      <text x="0" y="116" fill="#64748b" font-size="11" font-weight="600">PHONE NUMBER</text>
      <text x="0" y="136" fill="#0284c7" font-size="15" font-weight="700">+1 (415) 252-7535</text>
    </g>
  </g>
</svg>
`);

// 6. Task / Slack SVG
const taskSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <rect width="400" height="700" fill="#1e1022" rx="28" />
  <text x="32" y="36" fill="#d8b4e2" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">16:45</text>
  <rect x="370" y="27" width="14" height="9" rx="2" fill="#d8b4e2" />
  <g transform="translate(20, 60)">
    <rect width="360" height="50" rx="14" fill="#35183d" />
    <text x="24" y="32" fill="#ffffff" font-size="15" font-weight="700"># launch-v3-prod</text>
    <circle cx="330" cy="25" r="5" fill="#22c55e" />
  </g>
  <g transform="translate(20, 126)">
    <rect width="360" height="434" rx="20" fill="#ffffff" />
    <g transform="translate(20, 24)">
      <circle cx="20" cy="20" r="18" fill="#e11d48" />
      <text x="14" y="26" fill="#ffffff" font-weight="bold">SK</text>
      <text x="50" y="16" fill="#0f172a" font-size="14" font-weight="700">Sarah Klein (Lead Eng)</text>
      <text x="50" y="34" fill="#64748b" font-size="11">4:42 PM · Today</text>
    </g>
    <g transform="translate(20, 80)">
      <text x="0" y="20" fill="#0f172a" font-size="14" font-weight="600">🚨 ACTION REQUIRED FOR ALL LEADS:</text>
      <rect x="0" y="36" width="320" height="150" rx="10" fill="#f8fafc" stroke="#e2e8f0" />
      <text x="16" y="62" fill="#1e293b" font-size="13" font-weight="500">Please finish QA sign-off and submit the</text>
      <text x="16" y="84" fill="#1e293b" font-size="13" font-weight="700">Security Audit Checklist by tomorrow 5:00 PM.</text>
      <text x="16" y="112" fill="#b91c1c" font-size="12" font-weight="700">⚡ Priority: High</text>
      <text x="16" y="132" fill="#64748b" font-size="12">Project: Apollo Release v3.2</text>
    </g>
  </g>
</svg>
`);

// 7. Event & Meeting Calendar Invite SVG
const eventSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <rect width="400" height="700" fill="#0b132b" rx="28" />
  <text x="32" y="36" fill="#93c5fd" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">08:50</text>
  <rect x="370" y="27" width="14" height="9" rx="2" fill="#93c5fd" />
  <g transform="translate(20, 60)">
    <rect width="360" height="500" rx="20" fill="#ffffff" />
    <rect width="360" height="110" rx="20 20 0 0" fill="#1d4ed8" />
    <text x="24" y="44" fill="#ffffff" font-size="18" font-weight="800">Design Systems &amp; AI Conf 2026</text>
    <text x="24" y="70" fill="#bfdbfe" font-size="13">Annual Developer &amp; Architect Keynote</text>

    <g transform="translate(24, 130)">
      <g transform="translate(0, 0)">
        <rect width="56" height="56" rx="12" fill="#eff6ff" stroke="#bfdbfe" />
        <rect width="56" height="18" rx="12 12 0 0" fill="#3b82f6" />
        <text x="28" y="13" fill="#ffffff" font-size="10" font-weight="700" text-anchor="middle">OCT</text>
        <text x="28" y="42" fill="#1e3a8a" font-size="20" font-weight="900" text-anchor="middle">24</text>
      </g>
      <g transform="translate(70, 8)">
        <text x="0" y="16" fill="#0f172a" font-size="15" font-weight="700">Saturday, October 24, 2026</text>
        <text x="0" y="36" fill="#64748b" font-size="13">10:00 AM – 12:30 PM PDT</text>
      </g>
    </g>

    <line x1="24" y1="210" x2="336" y2="210" stroke="#e2e8f0" stroke-width="1.5" />
    <g transform="translate(24, 230)">
      <text x="0" y="16" fill="#64748b" font-size="11" font-weight="600">HOST &amp; ORGANIZER</text>
      <text x="0" y="36" fill="#0f172a" font-size="14" font-weight="700">Design Systems Guild</text>
      <text x="0" y="76" fill="#64748b" font-size="11" font-weight="600">LOCATION</text>
      <text x="0" y="96" fill="#0f172a" font-size="14" font-weight="700">Hall B · San Jose Conv Center / Meet</text>
      <text x="0" y="136" fill="#64748b" font-size="11" font-weight="600">CALENDAR LINK</text>
      <text x="0" y="156" fill="#2563eb" font-size="13" font-weight="600">meet.google.com/dsg-conf-2026</text>
    </g>
  </g>
</svg>
`);

// 8. Contact & Business Card SVG
const contactSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <rect width="400" height="700" fill="#042f2e" rx="28" />
  <text x="32" y="36" fill="#5eead4" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">12:00</text>
  <rect x="370" y="27" width="14" height="9" rx="2" fill="#5eead4" />
  <g transform="translate(20, 80)">
    <rect width="360" height="460" rx="20" fill="#ffffff" />
    <circle cx="180" cy="70" r="42" fill="#0d9488" />
    <text x="180" y="78" fill="#ffffff" font-size="24" font-weight="800" text-anchor="middle">SC</text>
    <text x="180" y="145" fill="#0f172a" font-size="20" font-weight="800" text-anchor="middle">Sarah Chen</text>
    <text x="180" y="168" fill="#0d9488" font-size="14" font-weight="700" text-anchor="middle">VP of Engineering · Stripe</text>
    <line x1="30" y1="200" x2="330" y2="200" stroke="#e2e8f0" stroke-width="1.5" />
    <g transform="translate(30, 220)">
      <text x="0" y="20" fill="#64748b" font-size="11" font-weight="600">PHONE</text>
      <text x="0" y="40" fill="#0f172a" font-size="15" font-weight="700">+1 (415) 890-2134</text>
      <text x="0" y="80" fill="#64748b" font-size="11" font-weight="600">EMAIL</text>
      <text x="0" y="100" fill="#0d9488" font-size="15" font-weight="700">sarah.chen@stripe.com</text>
      <text x="0" y="140" fill="#64748b" font-size="11" font-weight="600">OFFICE</text>
      <text x="0" y="160" fill="#0f172a" font-size="14">South Park, San Francisco, CA</text>
    </g>
  </g>
</svg>
`);

// 9. Web Link & Article SVG
const linkSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <rect width="400" height="700" fill="#111827" rx="28" />
  <text x="32" y="36" fill="#9ca3af" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">18:20</text>
  <rect x="370" y="27" width="14" height="9" rx="2" fill="#9ca3af" />
  <g transform="translate(20, 60)">
    <rect width="360" height="500" rx="20" fill="#ffffff" />
    <rect width="360" height="130" rx="20 20 0 0" fill="#3b82f6" />
    <text x="24" y="50" fill="#ffffff" font-size="18" font-weight="800">Latency-Free Multimodal UX</text>
    <text x="24" y="74" fill="#dbeafe" font-size="12">ux-systems.dev · 6 min read</text>
    <g transform="translate(24, 150)">
      <text x="0" y="20" fill="#0f172a" font-size="16" font-weight="700">Architecting Optimistic AI Actions</text>
      <text x="0" y="44" fill="#475569" font-size="13">By Alex Rivera · Published Today</text>
      <text x="0" y="80" fill="#334155" font-size="13">How client-side anticipation transforms heavy AI workflows into instantaneous productivity triggers.</text>
      <rect x="0" y="150" width="312" height="40" rx="10" fill="#f1f5f9" />
      <text x="14" y="174" fill="#2563eb" font-size="12" font-family="monospace">https://ux-systems.dev/latency-free-vision</text>
    </g>
  </g>
</svg>
`);

// 10. GitHub Repo SVG
const githubSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <rect width="400" height="700" fill="#0d1117" rx="28" />
  <text x="32" y="36" fill="#8b949e" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">19:40</text>
  <rect x="370" y="27" width="14" height="9" rx="2" fill="#8b949e" />
  <g transform="translate(20, 60)">
    <rect width="360" height="500" rx="20" fill="#161b22" stroke="#30363d" stroke-width="1.5" />
    <g transform="translate(24, 30)">
      <text x="0" y="24" fill="#58a6ff" font-size="20" font-weight="800" font-family="monospace">shadcn / ui</text>
      <rect x="230" y="6" width="70" height="24" rx="12" fill="#21262d" stroke="#30363d" />
      <text x="242" y="22" fill="#c9d1d9" font-size="11">Public</text>
      <text x="0" y="58" fill="#8b949e" font-size="13">Beautifully designed components that you can copy and paste into your apps.</text>
      <g transform="translate(0, 90)">
        <text x="0" y="20" fill="#e3b341" font-size="13">★ 68.4k stars</text>
        <text x="120" y="20" fill="#8b949e" font-size="13">⑂ 5.2k forks</text>
        <text x="210" y="20" fill="#3178c6" font-size="13">● TypeScript</text>
      </g>
      <rect x="0" y="150" width="312" height="60" rx="12" fill="#0d1117" stroke="#30363d" />
      <text x="16" y="174" fill="#8b949e" font-size="10">HTTPS CLONE</text>
      <text x="16" y="194" fill="#7ee787" font-size="11" font-family="monospace">git clone https://github.com/shadcn-ui/ui.git</text>
    </g>
  </g>
</svg>
`);

// 11. Document & Agreement SVG
const documentSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <rect width="400" height="700" fill="#1c1917" rx="28" />
  <text x="32" y="36" fill="#a8a29e" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="12" font-weight="600">11:15</text>
  <rect x="370" y="27" width="14" height="9" rx="2" fill="#a8a29e" />
  <g transform="translate(20, 60)">
    <rect width="360" height="520" rx="18" fill="#ffffff" />
    <g transform="translate(24, 30)">
      <text x="0" y="20" fill="#1c1917" font-size="18" font-weight="800">Consulting &amp; IP Agreement</text>
      <text x="0" y="40" fill="#78716c" font-size="12">Document Ref: DOC-2026-NDA · Executed</text>
      <line x1="0" y1="55" x2="312" y2="55" stroke="#e7e5e4" stroke-width="1.5" />
      <text x="0" y="80" fill="#1c1917" font-size="13" font-weight="700">Parties: Acme Corporation &amp; Freelance Studio</text>
      <text x="0" y="102" fill="#44403c" font-size="12">Term: 12 Months · Effective Date: Sept 15, 2026</text>
      <text x="0" y="130" fill="#78716c" font-size="11" font-weight="600">KEY CLAUSES SUMMARY</text>
      <text x="0" y="152" fill="#44403c" font-size="12">• Non-exclusive software architecture advising</text>
      <text x="0" y="174" fill="#44403c" font-size="12">• Work product IP assigned upon invoice clearance</text>
      <text x="0" y="196" fill="#44403c" font-size="12">• Standard 30-day notice for mutual termination</text>
      <text x="0" y="230" fill="#78716c" font-size="11" font-weight="600">CONFIDENTIALITY DURATION</text>
      <text x="0" y="250" fill="#1c1917" font-size="13" font-weight="700">3 Years Post-Termination</text>
    </g>
  </g>
</svg>
`);

// 12. Blurry / Unclear Screenshot SVG
const unclearSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <filter id="heavyBlur">
    <feGaussianBlur stdDeviation="8" />
  </filter>
  <rect width="400" height="700" fill="#1e293b" rx="28" />
  <g filter="url(#heavyBlur)" opacity="0.6">
    <rect x="40" y="100" width="320" height="480" rx="16" fill="#cbd5e1" />
    <rect x="60" y="140" width="200" height="24" fill="#475569" />
    <rect x="60" y="180" width="280" height="12" fill="#94a3b8" />
    <rect x="60" y="204" width="240" height="12" fill="#94a3b8" />
  </g>
  <rect x="60" y="320" width="280" height="60" rx="12" fill="#0f172a" opacity="0.9" />
  <text x="80" y="356" fill="#f87171" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="700">⚠ Blurry / Low Contrast Image</text>
</svg>
`);

// 13. Non-actionable Landscape Photo SVG
const nonActionableSvg = createSvgDataUrl(`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 700" width="100%" height="100%">
  <defs>
    <linearGradient id="sky" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#38bdf8" />
      <stop offset="100%" stop-color="#fdba74" />
    </linearGradient>
  </defs>
  <rect width="400" height="700" fill="url(#sky)" rx="28" />
  <circle cx="200" cy="300" r="60" fill="#fef08a" opacity="0.9" />
  <polygon points="0,500 120,380 240,510" fill="#334155" />
  <polygon points="160,520 290,360 400,500" fill="#1e293b" />
  <polygon points="0,700 0,480 400,480 400,700" fill="#064e3b" />
  <text x="130" y="650" fill="#ffffff" font-family="-apple-system, BlinkMacSystemFont, sans-serif" font-size="14" font-weight="600">Sunset Landscape</text>
</svg>
`);

// COMPLETE SAMPLE SCREENSHOTS EXPORT LIST
export const SAMPLE_SCREENSHOTS: ScreenshotItem[] = [
  // 1. TICKET / FLIGHT
  {
    id: 'sample-flight-01',
    timestamp: Date.now() - 1000 * 60 * 45,
    title: 'Flight AI-302 to Delhi',
    category: 'ticket',
    summary: 'Air India flight AI-302 from Kolkata (CCU) Terminal 2 to New Delhi (DEL) on Aug 18 at 8:40 PM. Check-in closes at 7:40 PM.',
    confidenceScore: 0.98,
    imageSrc: flightSvg,
    ocrText: 'Air India Express AI-302 CCU Kolkata 8:40 PM Terminal 2 DEL New Delhi 10:55 PM Terminal 3 Date Aug 18 2026 PNR AI889Q4 Gate 14B Check-in closes 7:40 PM',
    isPreset: true,
    presetBadge: 'Ticket / Boarding Pass',
    isSavedToLibrary: true,
    warnings: ['Check-in cutoff is 60 minutes prior to departure. Verify terminal security lines.'],
    extractedEntities: [
      { key: 'flight_number', label: 'Flight Number', value: 'AI-302', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'origin', label: 'Origin Airport', value: 'CCU · Kolkata (Terminal 2)', type: 'location', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'destination', label: 'Destination Airport', value: 'DEL · New Delhi (Terminal 3)', type: 'location', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'departure_time', label: 'Departure', value: 'Aug 18, 2026 · 8:40 PM', type: 'datetime', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'arrival_time', label: 'Arrival', value: 'Aug 18, 2026 · 10:55 PM', type: 'datetime', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'terminal', label: 'Departure Terminal', value: 'Terminal 2', type: 'text', provenance: 'extracted', confidence: 0.97, isEditable: true },
      { key: 'checkin_deadline', label: 'Check-in Deadline', value: 'Aug 18, 2026 · 7:40 PM', type: 'datetime', provenance: 'inferred', confidence: 0.94, isEditable: true },
      { key: 'pnr', label: 'Booking PNR', value: 'AI889Q4', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'gate', label: 'Gate', value: '14B', type: 'text', provenance: 'extracted', confidence: 0.96, isEditable: true },
    ],
    suggestedActions: [
      {
        id: 'act-flight-cal',
        title: 'Add Flight to Calendar',
        subtitle: 'Aug 18 · 8:40 PM (CCU → DEL)',
        actionType: 'calendar',
        riskLevel: 'high',
        isPrimary: true,
        details: {
          eventTitle: 'Flight AI-302: CCU → DEL',
          datetime: '2026-08-18T20:40:00',
          endDate: '2026-08-18T22:55:00',
          location: 'Kolkata Airport Terminal 2',
          notes: 'Air India PNR: AI889Q4 · Gate 14B · Check-in deadline 7:40 PM',
        },
      },
      {
        id: 'act-flight-remind',
        title: 'Set Check-in Reminder',
        subtitle: 'Aug 18 · 7:40 PM (1h prior)',
        actionType: 'reminder',
        riskLevel: 'low',
        isPrimary: false,
        details: {
          eventTitle: 'Check-in for Flight AI-302 (Kolkata → Delhi)',
          datetime: '2026-08-18T19:40:00',
          notes: 'Terminal 2, Gate 14B. PNR: AI889Q4',
        },
      },
      {
        id: 'act-flight-pnr',
        title: 'Copy PNR Reference',
        subtitle: 'AI889Q4',
        actionType: 'copy',
        riskLevel: 'low',
        isPrimary: false,
        details: { notes: 'AI889Q4' },
      },
    ],
    executedActions: [],
  },

  // 2. PAYMENT / BILL
  {
    id: 'sample-payment-02',
    timestamp: Date.now() - 1000 * 60 * 60 * 3,
    title: 'BESCOM Electricity Bill',
    category: 'payment',
    summary: 'Electricity bill of ₹2,499.00 from BESCOM due on Aug 15, 2026. Late fee +₹150 applies after due date.',
    confidenceScore: 0.99,
    imageSrc: paymentSvg,
    ocrText: 'BESCOM Electricity Consumer ID 48291094 TOTAL AMOUNT DUE ₹2,499.00 Due in 6 days Due Date Aug 15 2026 Bill Number EB-992014 Late Fee +₹150.00 UPI bescom.electric@icici',
    isPreset: true,
    presetBadge: 'Payment Due',
    isSavedToLibrary: true,
    warnings: ['Late fee of ₹150.00 will be added after August 15.'],
    extractedEntities: [
      { key: 'merchant', label: 'Biller / Merchant', value: 'BESCOM Electricity', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'amount', label: 'Total Amount Due', value: '₹2,499.00', type: 'currency', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'due_date', label: 'Due Date', value: 'Aug 15, 2026', type: 'datetime', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'bill_number', label: 'Bill / Reference #', value: 'EB-992014', type: 'text', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'consumer_id', label: 'Consumer ID', value: '48291094', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'late_fee', label: 'Late Fee', value: '+₹150.00 post due', type: 'text', provenance: 'extracted', confidence: 0.95, isEditable: true },
      { key: 'upi_id', label: 'UPI VPA', value: 'bescom.electric@icici', type: 'email', provenance: 'extracted', confidence: 0.98, isEditable: true },
    ],
    suggestedActions: [
      {
        id: 'act-pay-remind',
        title: 'Set Due-Date Reminder',
        subtitle: 'Aug 14 · 6:00 PM (1 day prior)',
        actionType: 'reminder',
        riskLevel: 'low',
        isPrimary: true,
        details: {
          eventTitle: 'Pay BESCOM Bill: ₹2,499',
          datetime: '2026-08-14T18:00:00',
          amount: '₹2,499.00',
          dueDate: 'Aug 15, 2026',
          merchant: 'BESCOM Electricity',
          notes: 'Bill EB-992014. UPI: bescom.electric@icici',
        },
      },
      {
        id: 'act-pay-upi',
        title: 'Copy UPI ID & Pay',
        subtitle: 'bescom.electric@icici',
        actionType: 'copy',
        riskLevel: 'low',
        isPrimary: false,
        details: { notes: 'bescom.electric@icici' },
      },
    ],
    executedActions: [],
  },

  // 3. RECEIPT & WARRANTY
  {
    id: 'sample-receipt-03',
    timestamp: Date.now() - 1000 * 60 * 60 * 5,
    title: 'Apple Store MacBook Pro Receipt',
    category: 'receipt',
    summary: 'Apple Store purchase of MacBook Pro 16" for $2,499.00. 1-Year AppleCare warranty confirmed through Oct 01, 2027.',
    confidenceScore: 0.98,
    imageSrc: receiptSvg,
    ocrText: 'Apple Store San Francisco Union Square Store #R142 Receipt #: RCP-8839210 Oct 01 2026 MacBook Pro 16" M3 Max $2499.00 1-Year AppleCare Warranty Oct 01 2027 Total $2714.54',
    isPreset: true,
    presetBadge: 'Receipt & Warranty',
    isSavedToLibrary: true,
    extractedEntities: [
      { key: 'merchant', label: 'Store Merchant', value: 'Apple Store Union Square', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'product', label: 'Purchased Item', value: 'MacBook Pro 16" (M3 Max, 36GB)', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'total_amount', label: 'Total Paid', value: '$2,714.54', type: 'currency', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'purchase_date', label: 'Purchase Date', value: 'Oct 01, 2026', type: 'datetime', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'warranty_expiry', label: 'Warranty Expiration', value: 'Oct 01, 2027 (1-Year AppleCare)', type: 'datetime', provenance: 'verified', confidence: 0.97, isEditable: true },
      { key: 'receipt_number', label: 'Receipt ID', value: 'RCP-8839210', type: 'text', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'serial_number', label: 'Hardware Serial', value: 'C02XG789L', type: 'text', provenance: 'extracted', confidence: 0.96, isEditable: true },
    ],
    suggestedActions: [
      {
        id: 'act-warranty-cal',
        title: 'Add Warranty Expiry to Calendar',
        subtitle: 'Oct 01, 2027 · AppleCare Renewal Alert',
        actionType: 'calendar',
        riskLevel: 'high',
        isPrimary: true,
        details: {
          eventTitle: 'Warranty Expiry: MacBook Pro 16"',
          datetime: '2027-10-01T09:00:00',
          endDate: '2027-10-01T10:00:00',
          location: 'Apple Store',
          notes: 'AppleCare 1-Year warranty expires today. SN: C02XG789L · Receipt: RCP-8839210',
        },
      },
      {
        id: 'act-receipt-copy',
        title: 'Copy Serial & Receipt ID',
        subtitle: 'C02XG789L / RCP-8839210',
        actionType: 'copy',
        riskLevel: 'low',
        isPrimary: false,
        details: { notes: 'SN: C02XG789L | Receipt: RCP-8839210' },
      },
    ],
    executedActions: [],
  },

  // 4. PACKAGE TRACKING
  {
    id: 'sample-package-04',
    timestamp: Date.now() - 1000 * 60 * 60 * 8,
    title: 'Amazon Package Delivery',
    category: 'package',
    summary: 'Amazon Logistics delivery for Sony WH-1000XM5 headphones, arriving Aug 12 by 8:00 PM. Destination verified.',
    confidenceScore: 0.97,
    imageSrc: packageSvg,
    ocrText: 'amazon Your Orders ON THE WAY Arriving Aug 12 Expected by 8:00 PM Sony WH-1000XM5 Black CARRIER Amazon Logistics TRACKING ID AMZN-IN-8893120 DESTINATION San Francisco CA 94102',
    isPreset: true,
    presetBadge: 'Package Tracking',
    isSavedToLibrary: true,
    extractedEntities: [
      { key: 'carrier', label: 'Carrier', value: 'Amazon Logistics', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'tracking_number', label: 'Tracking ID', value: 'AMZN-IN-8893120', type: 'tracking', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'estimated_delivery', label: 'Expected Delivery', value: 'Aug 12, 2026 (by 8:00 PM)', type: 'datetime', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'destination', label: 'Verified Destination', value: 'San Francisco, CA 94102', type: 'location', provenance: 'verified', confidence: 0.96, isEditable: true },
      { key: 'item', label: 'Package Item', value: 'Sony WH-1000XM5 (Black)', type: 'text', provenance: 'extracted', confidence: 0.97, isEditable: true },
    ],
    suggestedActions: [
      {
        id: 'act-track-pkg',
        title: 'Open Verified Tracking Page',
        subtitle: 'Auto-track AMZN-IN-8893120',
        actionType: 'track',
        riskLevel: 'low',
        isPrimary: true,
        details: {
          carrier: 'Amazon Logistics',
          trackingNumber: 'AMZN-IN-8893120',
          dueDate: 'Aug 12, 2026',
        },
      },
      {
        id: 'act-remind-pkg',
        title: 'Set Delivery Day Reminder',
        subtitle: 'Aug 12 · 9:00 AM',
        actionType: 'reminder',
        riskLevel: 'low',
        isPrimary: false,
        details: {
          eventTitle: 'Package Delivery Today: Sony Headphones',
          datetime: '2026-08-12T09:00:00',
          trackingNumber: 'AMZN-IN-8893120',
        },
      },
      {
        id: 'act-copy-tracking',
        title: 'Copy Tracking Number',
        subtitle: 'AMZN-IN-8893120',
        actionType: 'copy',
        riskLevel: 'low',
        isPrimary: false,
        details: { notes: 'AMZN-IN-8893120' },
      },
    ],
    executedActions: [],
  },

  // 5. ADDRESS & PLACE
  {
    id: 'sample-address-05',
    timestamp: Date.now() - 1000 * 60 * 60 * 24,
    title: 'Blue Bottle Coffee San Francisco',
    category: 'address',
    summary: 'Artisanal coffee venue at 315 Linden St, San Francisco, CA. Phone: +1 (415) 252-7535.',
    confidenceScore: 0.98,
    imageSrc: addressSvg,
    ocrText: 'Blue Bottle Coffee Hayes Valley Artisanal Espresso Open Closes 6:00 PM 4.7 1840 reviews 315 Linden St San Francisco CA 94102 +1 415 252 7535',
    isPreset: true,
    presetBadge: 'Address & Place',
    isSavedToLibrary: true,
    extractedEntities: [
      { key: 'place_name', label: 'Place Name', value: 'Blue Bottle Coffee', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'address', label: 'Full Address', value: '315 Linden St, San Francisco, CA 94102', type: 'location', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'phone', label: 'Phone Number', value: '+1 (415) 252-7535', type: 'phone', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'hours', label: 'Operating Hours', value: 'Open daily · Closes 6:00 PM', type: 'text', provenance: 'extracted', confidence: 0.95, isEditable: true },
      { key: 'rating', label: 'Rating', value: '★ 4.7 (1,840 reviews)', type: 'text', provenance: 'verified', confidence: 0.96, isEditable: false },
    ],
    suggestedActions: [
      {
        id: 'act-open-maps',
        title: 'Open in Google Maps',
        subtitle: '315 Linden St, San Francisco',
        actionType: 'map',
        riskLevel: 'low',
        isPrimary: true,
        details: {
          placeName: 'Blue Bottle Coffee',
          address: '315 Linden St, San Francisco, CA 94102',
          location: '315 Linden St, San Francisco, CA 94102',
          mapQuery: 'Blue Bottle Coffee, 315 Linden St, San Francisco, CA 94102',
        },
      },
      {
        id: 'act-call-venue',
        title: 'Call Place Directly',
        subtitle: '+1 (415) 252-7535',
        actionType: 'call',
        riskLevel: 'low',
        isPrimary: false,
        details: {
          phone: '+14152527535',
          placeName: 'Blue Bottle Coffee',
        },
      },
      {
        id: 'act-copy-addr',
        title: 'Copy Address',
        subtitle: '315 Linden St, SF',
        actionType: 'copy',
        riskLevel: 'low',
        isPrimary: false,
        details: { notes: '315 Linden St, San Francisco, CA 94102' },
      },
    ],
    executedActions: [],
  },

  // 6. TASK & DEADLINE
  {
    id: 'sample-task-06',
    timestamp: Date.now() - 1000 * 60 * 60 * 30,
    title: 'QA Sign-off & Security Audit',
    category: 'task',
    summary: 'High priority task in #launch-v3-prod: Submit Security Audit Checklist by tomorrow 5:00 PM.',
    confidenceScore: 0.96,
    imageSrc: taskSvg,
    ocrText: 'launch-v3-prod Sarah Klein Lead Eng ACTION REQUIRED Please finish QA sign-off and submit the Security Audit Checklist by tomorrow 5:00 PM Priority High Project Apollo Release v3.2',
    isPreset: true,
    presetBadge: 'Task & Deadline',
    isSavedToLibrary: true,
    extractedEntities: [
      { key: 'task_description', label: 'Task Description', value: 'Submit QA Sign-off & Security Audit Checklist', type: 'text', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'deadline', label: 'Deadline', value: 'Tomorrow · 5:00 PM', type: 'datetime', provenance: 'extracted', confidence: 0.97, isEditable: true },
      { key: 'priority', label: 'Priority', value: 'High', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'project', label: 'Related Project', value: 'Apollo Release v3.2', type: 'text', provenance: 'extracted', confidence: 0.97, isEditable: true },
      { key: 'requester', label: 'Requested By', value: 'Sarah Klein (Lead Eng)', type: 'text', provenance: 'extracted', confidence: 0.98, isEditable: true },
    ],
    suggestedActions: [
      {
        id: 'act-create-task',
        title: 'Create Priority Task',
        subtitle: 'Due Tomorrow · 5:00 PM',
        actionType: 'task',
        riskLevel: 'low',
        isPrimary: true,
        details: {
          taskTitle: 'Apollo v3.2: QA Sign-off & Security Audit',
          dueDate: 'Tomorrow · 5:00 PM',
          priority: 'High',
          project: 'Apollo Release v3.2',
        },
      },
      {
        id: 'act-task-remind',
        title: 'Set Pre-deadline Reminder',
        subtitle: 'Tomorrow · 3:00 PM (2h prior)',
        actionType: 'reminder',
        riskLevel: 'low',
        isPrimary: false,
        details: {
          eventTitle: '2h Warning: QA Sign-off checklist due at 5 PM',
          datetime: '2026-08-10T15:00:00',
        },
      },
    ],
    executedActions: [],
  },

  // 7. EVENT & APPOINTMENT
  {
    id: 'sample-event-07',
    timestamp: Date.now() - 1000 * 60 * 60 * 12,
    title: 'Design Systems & AI Conf 2026',
    category: 'event',
    summary: 'Annual Developer & Architect Keynote by Design Systems Guild on Oct 24, 2026, 10:00 AM – 12:30 PM PDT.',
    confidenceScore: 0.98,
    imageSrc: eventSvg,
    ocrText: 'Design Systems & AI Conf 2026 Annual Developer Keynote Saturday October 24 2026 10:00 AM - 12:30 PM PDT Host Design Systems Guild Location Hall B San Jose Conv Center Meet meet.google.com/dsg-conf-2026',
    isPreset: true,
    presetBadge: 'Event & Appointment',
    isSavedToLibrary: true,
    extractedEntities: [
      { key: 'event_title', label: 'Event Title', value: 'Design Systems & AI Conf 2026 Keynote', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'date', label: 'Date', value: 'Oct 24, 2026', type: 'datetime', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'time', label: 'Time Window', value: '10:00 AM – 12:30 PM PDT', type: 'text', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'location', label: 'Venue / Link', value: 'Hall B · San Jose Conv Center / Virtual Meet', type: 'location', provenance: 'extracted', confidence: 0.97, isEditable: true },
      { key: 'organizer', label: 'Organizer', value: 'Design Systems Guild', type: 'text', provenance: 'extracted', confidence: 0.98, isEditable: true },
    ],
    suggestedActions: [
      {
        id: 'act-event-cal',
        title: 'Add to Calendar',
        subtitle: 'Oct 24 · 10:00 AM – 12:30 PM',
        actionType: 'calendar',
        riskLevel: 'high',
        isPrimary: true,
        details: {
          eventTitle: 'Design Systems & AI Conf 2026 Keynote',
          datetime: '2026-10-24T10:00:00',
          endDate: '2026-10-24T12:30:00',
          location: 'Hall B, San Jose Convention Center',
          notes: 'Host: Design Systems Guild · Virtual link: meet.google.com/dsg-conf-2026',
        },
      },
      {
        id: 'act-event-remind',
        title: 'Set 1-Day Prior Reminder',
        subtitle: 'Oct 23 · 9:00 AM',
        actionType: 'reminder',
        riskLevel: 'low',
        isPrimary: false,
        details: {
          eventTitle: 'Tomorrow: Design Systems & AI Conf Keynote',
          datetime: '2026-10-23T09:00:00',
        },
      },
    ],
    executedActions: [],
  },

  // 8. CONTACT & PEOPLE
  {
    id: 'sample-contact-08',
    timestamp: Date.now() - 1000 * 60 * 60 * 18,
    title: 'Sarah Chen · VP Engineering Stripe',
    category: 'contact',
    summary: 'Executive contact card for Sarah Chen, VP of Engineering at Stripe. Phone: +1 (415) 890-2134.',
    confidenceScore: 0.99,
    imageSrc: contactSvg,
    ocrText: 'Sarah Chen VP of Engineering Stripe Phone +1 415 890 2134 Email sarah.chen@stripe.com Office South Park San Francisco CA',
    isPreset: true,
    presetBadge: 'Contact / vCard',
    isSavedToLibrary: true,
    extractedEntities: [
      { key: 'contact_name', label: 'Full Name', value: 'Sarah Chen', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'title', label: 'Role / Title', value: 'VP of Engineering', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'organization', label: 'Company', value: 'Stripe', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'phone', label: 'Mobile Phone', value: '+1 (415) 890-2134', type: 'phone', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'email', label: 'Work Email', value: 'sarah.chen@stripe.com', type: 'email', provenance: 'extracted', confidence: 0.99, isEditable: true },
    ],
    suggestedActions: [
      {
        id: 'act-contact-save',
        title: 'Download vCard Contact',
        subtitle: 'Save Sarah Chen to Phone Contacts',
        actionType: 'contact',
        riskLevel: 'low',
        isPrimary: true,
        details: {
          contactName: 'Sarah Chen',
          phone: '+1 (415) 890-2134',
          email: 'sarah.chen@stripe.com',
          organization: 'Stripe',
          titleRole: 'VP of Engineering',
        },
      },
      {
        id: 'act-contact-call',
        title: 'Call Phone',
        subtitle: '+1 (415) 890-2134',
        actionType: 'call',
        riskLevel: 'low',
        isPrimary: false,
        details: { phone: '+14158902134' },
      },
      {
        id: 'act-contact-email',
        title: 'Send Email',
        subtitle: 'sarah.chen@stripe.com',
        actionType: 'email',
        riskLevel: 'low',
        isPrimary: false,
        details: { email: 'sarah.chen@stripe.com' },
      },
    ],
    executedActions: [],
  },

  // 9. WEB LINK & ARTICLE
  {
    id: 'sample-link-09',
    timestamp: Date.now() - 1000 * 60 * 60 * 20,
    title: 'Latency-Free Multimodal UX Architecture',
    category: 'link',
    summary: 'Deep-dive article on client-side optimistic UI and multimodal AI actions by Alex Rivera.',
    confidenceScore: 0.97,
    imageSrc: linkSvg,
    ocrText: 'Latency-Free Multimodal UX ux-systems.dev 6 min read Architecting Optimistic AI Actions By Alex Rivera https://ux-systems.dev/latency-free-vision',
    isPreset: true,
    presetBadge: 'Web Link & Article',
    isSavedToLibrary: true,
    extractedEntities: [
      { key: 'url', label: 'Article URL', value: 'https://ux-systems.dev/latency-free-vision', type: 'url', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'author', label: 'Author', value: 'Alex Rivera', type: 'text', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'read_time', label: 'Estimated Read Time', value: '6 min read', type: 'text', provenance: 'extracted', confidence: 0.95, isEditable: true },
      { key: 'domain', label: 'Publisher Domain', value: 'ux-systems.dev', type: 'text', provenance: 'verified', confidence: 0.99, isEditable: false },
    ],
    suggestedActions: [
      {
        id: 'act-open-link',
        title: 'Open Article in Browser',
        subtitle: 'ux-systems.dev/latency-free-vision',
        actionType: 'open_link',
        riskLevel: 'low',
        isPrimary: true,
        details: { url: 'https://ux-systems.dev/latency-free-vision' },
      },
      {
        id: 'act-copy-link',
        title: 'Copy Article Link',
        subtitle: 'https://ux-systems.dev/...',
        actionType: 'copy',
        riskLevel: 'low',
        isPrimary: false,
        details: { notes: 'https://ux-systems.dev/latency-free-vision' },
      },
    ],
    executedActions: [],
  },

  // 10. GITHUB & TECH RESOURCE
  {
    id: 'sample-github-10',
    timestamp: Date.now() - 1000 * 60 * 60 * 36,
    title: 'shadcn/ui Open-Source Library',
    category: 'github',
    summary: 'shadcn/ui GitHub repository with 68.4k stars. Beautifully designed components in TypeScript.',
    confidenceScore: 0.98,
    imageSrc: githubSvg,
    ocrText: 'shadcn / ui Public Beautifully designed components that you can copy and paste into your apps. 68.4k stars TypeScript git clone https://github.com/shadcn-ui/ui.git',
    isPreset: true,
    presetBadge: 'GitHub & Tech Resource',
    isSavedToLibrary: true,
    extractedEntities: [
      { key: 'repo_name', label: 'Repository', value: 'shadcn/ui', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'clone_command', label: 'Clone Snippet', value: 'git clone https://github.com/shadcn-ui/ui.git', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'stars', label: 'GitHub Stars', value: '★ 68.4k', type: 'text', provenance: 'extracted', confidence: 0.97, isEditable: true },
      { key: 'language', label: 'Primary Language', value: 'TypeScript', type: 'text', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'url', label: 'Repo URL', value: 'https://github.com/shadcn-ui/ui', type: 'url', provenance: 'verified', confidence: 0.99, isEditable: true },
    ],
    suggestedActions: [
      {
        id: 'act-clone-repo',
        title: 'Copy Git Clone Command',
        subtitle: 'git clone https://github.com/shadcn-ui/ui.git',
        actionType: 'copy',
        riskLevel: 'low',
        isPrimary: true,
        details: { notes: 'git clone https://github.com/shadcn-ui/ui.git' },
      },
      {
        id: 'act-open-github',
        title: 'Open Repository on GitHub',
        subtitle: 'github.com/shadcn-ui/ui',
        actionType: 'open_github',
        riskLevel: 'low',
        isPrimary: false,
        details: { url: 'https://github.com/shadcn-ui/ui' },
      },
    ],
    executedActions: [],
  },

  // 11. DOCUMENT & REFERENCE
  {
    id: 'sample-document-11',
    timestamp: Date.now() - 1000 * 60 * 60 * 40,
    title: 'Consulting & IP Assignment Agreement',
    category: 'document',
    summary: '12-Month non-exclusive software advising agreement between Acme Corp and Freelance Studio.',
    confidenceScore: 0.96,
    imageSrc: documentSvg,
    ocrText: 'Consulting & IP Agreement Ref DOC-2026-NDA Parties Acme Corporation & Freelance Studio Term 12 Months Effective Date Sept 15 2026 3 Years Post-Termination Confidentiality',
    isPreset: true,
    presetBadge: 'Document & Reference',
    isSavedToLibrary: true,
    extractedEntities: [
      { key: 'document_type', label: 'Document Type', value: 'Consulting & IP Agreement', type: 'text', provenance: 'extracted', confidence: 0.99, isEditable: true },
      { key: 'parties', label: 'Parties', value: 'Acme Corporation & Freelance Studio', type: 'text', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'effective_date', label: 'Effective Date', value: 'Sept 15, 2026', type: 'datetime', provenance: 'extracted', confidence: 0.98, isEditable: true },
      { key: 'term', label: 'Contract Term', value: '12 Months', type: 'text', provenance: 'extracted', confidence: 0.97, isEditable: true },
      { key: 'confidentiality', label: 'Confidentiality Period', value: '3 Years Post-Termination', type: 'text', provenance: 'extracted', confidence: 0.96, isEditable: true },
    ],
    suggestedActions: [
      {
        id: 'act-copy-doc-summary',
        title: 'Copy Agreement Summary',
        subtitle: 'Key terms and confidentiality clauses',
        actionType: 'copy',
        riskLevel: 'low',
        isPrimary: true,
        details: { notes: 'Agreement DOC-2026-NDA: Acme Corp & Freelance Studio. Term: 12 Months. Confidentiality: 3 Years post-termination.' },
      },
    ],
    executedActions: [],
  },

  // 12. ERROR DEMO: UNCLEAR
  {
    id: 'sample-error-unclear',
    timestamp: Date.now() - 1000 * 60 * 60 * 50,
    title: 'Unreadable Blurry Image',
    category: 'unclear',
    summary: 'We could not recognize readable text or recognizable structured entities in this screenshot.',
    confidenceScore: 0.22,
    imageSrc: unclearSvg,
    ocrText: '',
    isPreset: true,
    presetBadge: 'Error Demo: Unclear',
    warnings: ['Image resolution is too low or text is severely blurred.'],
    extractedEntities: [],
    suggestedActions: [],
    executedActions: [],
  },

  // 13. ERROR DEMO: NON-ACTIONABLE
  {
    id: 'sample-non-actionable',
    timestamp: Date.now() - 1000 * 60 * 60 * 70,
    title: 'Sunset Landscape Photo',
    category: 'none',
    summary: 'No actionable entities, dates, flights, payments, or tasks were detected in this image.',
    confidenceScore: 0.94,
    imageSrc: nonActionableSvg,
    ocrText: '',
    isPreset: true,
    presetBadge: 'Demo: Non-Actionable',
    extractedEntities: [],
    suggestedActions: [],
    executedActions: [],
  },
];
