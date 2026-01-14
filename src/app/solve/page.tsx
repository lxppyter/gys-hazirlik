import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FileText, ArrowRight } from "lucide-react";

export default function SolvePage() {
  return (
    <div className="container mx-auto py-12">
      <div className="mb-12 text-center">
         <h1 className="text-4xl font-extrabold text-slate-900 mb-4">Sınav Merkezi</h1>
         <p className="text-xl text-slate-600 max-w-2xl mx-auto">
           Kendinizi denemek ve eksiklerinizi görmek için sınav türünü seçin.
         </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 max-w-5xl mx-auto">
         {/* Deneme Sınavları Card */}
         <Link href="/solve/deneme" className="group">
            <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-xl border border-slate-200 hover:border-blue-200 transition-all duration-300 h-full flex flex-col">
               <div className="w-14 h-14 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-6 group-hover:scale-110 transition-transform">
                  <FileText className="w-7 h-7" />
               </div>
               <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-blue-700 transition-colors">Deneme Sınavları</h3>
               <p className="text-slate-600 mb-6 flex-1">
                  Gerçek sınav formatında, süre tutarak kendinizi test edin. Konu eksiklerinizi görün.
               </p>
               <span className="text-blue-600 font-semibold flex items-center group-hover:translate-x-2 transition-transform mt-auto">
                  Sınavları İncele <ArrowRight className="ml-2 w-5 h-5" />
               </span>
            </div>
         </Link>

         {/* Placeholder for future sections - Visual balance */}
         <div className="bg-slate-50/50 rounded-2xl p-8 border border-dashed border-slate-200 flex flex-col justify-center items-center text-center">
             <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                 <span className="text-2xl text-slate-300">+</span>
             </div>
             <span className="text-slate-400 font-medium">Yeni Modüller Hazırlanıyor</span>
             <p className="text-sm text-slate-400 mt-2">Konu tarama testleri ve çıkmış sorular çok yakında.</p>
         </div>
      </div>
    </div>
  );
}
