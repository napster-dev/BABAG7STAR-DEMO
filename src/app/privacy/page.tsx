export const metadata = { title: "Privacy Policy | BabaG7Star" };

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <p className="text-[11px] font-black tracking-[0.3em] text-[#F5C542]">★ YOUR DATA, RESPECTED</p>
      <h1 className="font-display font-black text-4xl mt-2">Privacy <span className="gold-text">Policy</span></h1>
      <p className="text-white/45 text-sm mt-2">Last updated: September 2026</p>
      <div className="mt-6 space-y-6 text-[15px] text-white/65 leading-relaxed">
        <section><h2 className="font-display font-bold text-lg text-white">1. What we collect</h2><p className="mt-2">Contact details (name, email, address, phone) for delivery; order contents and payment confirmations (we never store raw card numbers — processing is handled by PCI-DSS providers like Stripe/PayPal); support messages; and anonymized browsing analytics to improve the store.</p></section>
        <section><h2 className="font-display font-bold text-lg text-white">2. How we use it</h2><p className="mt-2">To fulfil and track orders, prevent fraud, provide support, and — only with consent — send offers and drops. Every marketing email has one-click unsubscribe.</p></section>
        <section><h2 className="font-display font-bold text-lg text-white">3. Sharing</h2><p className="mt-2">We share the minimum necessary with delivery couriers and payment processors. We never sell your data. Ever.</p></section>
        <section><h2 className="font-display font-bold text-lg text-white">4. Security</h2><p className="mt-2">256-bit SSL in transit, encrypted storage, restricted staff access, and regular audits. Report concerns to support@babag7star.com.</p></section>
        <section><h2 className="font-display font-bold text-lg text-white">5. Your rights</h2><p className="mt-2">Request access, correction, export or deletion of your data anytime at support@babag7star.com. We respond within 72 hours.</p></section>
        <section><h2 className="font-display font-bold text-lg text-white">6. Cookies</h2><p className="mt-2">Essential cookies keep your cart and login working; analytics cookies help us improve. You can block non-essential cookies in your browser without breaking checkout.</p></section>
      </div>
    </div>
  );
}
