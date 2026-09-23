import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, Phone, MapPin, Heart, Clock } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-[#15803D] text-white border-t border-emerald-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white text-[#16A34A] flex items-center justify-center font-bold shadow">
                <Sprout className="w-5 h-5 text-[#16A34A]" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Market<span className="text-amber-300">Link</span>
              </span>
            </div>
            <p className="text-xs text-emerald-100/90 leading-relaxed">
              Empowering sustainable local agriculture by connecting community members directly with independent family farms, certified organic growers, and weekly farmers markets.
            </p>
            <div className="flex items-center gap-2 text-xs text-amber-200 font-semibold pt-1">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span>
              🌿 Zero Food Miles • Fresh Seasonal Harvest
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Marketplace Directory</h3>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>
                <Link to="/markets" className="hover:text-white transition font-medium text-emerald-200">Local Farmers Markets</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-white transition font-medium text-emerald-200">Fresh Seasonal Produce</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About MarketLink</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition">Harvest & Stalls Gallery</Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-white transition">Customer Reviews</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact Market Office</Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-white transition">Platform Sitemap</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Product Categories */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Harvest Categories</h3>
            <ul className="space-y-2 text-xs text-emerald-100/80">
              <li>• Fresh Seasonal Vegetables</li>
              <li>• Orchard Fruits & Berries</li>
              <li>• Farm Dairy & Pastured Eggs</li>
              <li>• Artisan Sourdough Bakery</li>
              <li>• Raw Wildflower Honey & Pantry</li>
              <li>• Organic Microgreens & Herbs</li>
            </ul>
          </div>

          {/* Col 4: Official Contacts */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Market Operations</h3>
            <ul className="space-y-2.5 text-xs text-emerald-100/80">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>Helpline: <strong className="text-white">(312) 555-FARM (3276)</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>Support: support@marketlink.org</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-amber-300 shrink-0 mt-0.5" />
                <span>Chicago Central Hub: 400 S Financial Pl</span>
              </li>
              <li className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-emerald-300 shrink-0 mt-0.5" />
                <span>Market Days: Sat & Sun 08:00 AM - 02:00 PM</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-emerald-700/80 flex flex-col sm:flex-row items-center justify-between text-xs text-emerald-200/80 gap-2">
          <p>© 2026 MarketLink Platform • TechWiz 7 eGreen Basket Benchmark</p>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-amber-400 fill-amber-400 inline" /> for Sustainable Family Farming
          </div>
        </div>
      </div>
    </footer>
  );
}

