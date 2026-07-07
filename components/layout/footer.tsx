import Link from "next/link";
import { Building2, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
                <Building2 className="h-5 w-5" />
              </div>
              <span className="font-display text-xl font-bold">
                Hall<span className="text-gold-500">Finder</span>
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Discover premium function halls in Bidar, Karnataka. Your perfect
              venue for weddings, receptions, and celebrations.
            </p>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/search" className="hover:text-emerald-600 transition-colors">
                  Search Halls
                </Link>
              </li>
              <li>
                <Link href="/register?role=owner" className="hover:text-emerald-600 transition-colors">
                  List Your Hall
                </Link>
              </li>
              <li>
                <Link href="/#how-it-works" className="hover:text-emerald-600 transition-colors">
                  How It Works
                </Link>
              </li>
              <li>
                <Link href="/#faqs" className="hover:text-emerald-600 transition-colors">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold">Areas We Cover</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Gandhi Gunj</li>
              <li>Station Road</li>
              <li>Shah Gunj</li>
              <li>Naubad &amp; More</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-display font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-emerald-600" />
                Bidar, Karnataka 585401
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-emerald-600" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-emerald-600" />
                hello@hallfinder.in
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t pt-8 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} HallFinder. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-emerald-600 transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="hover:text-emerald-600 transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
