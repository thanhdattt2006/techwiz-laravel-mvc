import React from 'react';
import { Link } from 'react-router-dom';
import { Ambulance, Mail, Phone, MapPin, ShieldAlert, Heart } from 'lucide-react';

export default function PublicFooter() {
  return (
    <footer className="bg-[#084298] text-white border-t border-blue-900 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-white text-[#0B6EFD] flex items-center justify-center font-bold shadow">
                <Ambulance className="w-5 h-5" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                Life<span className="text-blue-300">Link</span>
              </span>
            </div>
            <p className="text-xs text-blue-100/80 leading-relaxed">
              Leading eAmbulance platform connecting critical emergency medical transportation with patients, clinics, and hospitals in real time.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-300 font-semibold pt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              24/7 Medical Response Ready
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Quick Links</h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              <li>
                <Link to="/" className="hover:text-white transition">eAmbulance Catalog</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition">About LifeLink</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-white transition">Fleet Image Gallery</Link>
              </li>
              <li>
                <Link to="/feedback" className="hover:text-white transition">Patient Feedback</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition">Contact Us Form</Link>
              </li>
              <li>
                <Link to="/sitemap" className="hover:text-white transition">Portal Sitemap</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Ambulance Types */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Fleet Categories</h3>
            <ul className="space-y-2 text-xs text-blue-100/80">
              <li>• Advanced Cardiac Care (ICCU)</li>
              <li>• Intensive Care Unit (ICU)</li>
              <li>• Air Conditioned (A/C Support)</li>
              <li>• Standard Basic (Non-A/C)</li>
              <li>• Regional Emergency Response</li>
            </ul>
          </div>

          {/* Col 4: Official Contacts */}
          <div>
            <h3 className="text-sm font-bold text-white mb-3 uppercase tracking-wider">Contact Coordinates</h3>
            <ul className="space-y-2.5 text-xs text-blue-100/80">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Emergency Hotline: <strong className="text-white">030-1111-1234</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-blue-300 shrink-0 mt-0.5" />
                <span>Support: healthcare@icu.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-red-300 shrink-0 mt-0.5" />
                <span>Central Dispatch: Chicago Metropolitan Healthcare Grid</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 mt-8 border-t border-blue-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-blue-200/70 gap-2">
          <p>© 2026 LifeLink eAmbulance System • TechWiz 7 Project Benchmark</p>
          <div className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-red-400 fill-red-400 inline" /> for Critical Emergency Care
          </div>
        </div>
      </div>
    </footer>
  );
}
