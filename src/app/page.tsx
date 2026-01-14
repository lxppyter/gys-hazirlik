import connectToDatabase from "@/lib/db";
import { PracticeExam } from "@/lib/models";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Clock, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { ClientExam } from "@/types";

// Force dynamic since DB can change
export const dynamic = 'force-dynamic';

async function getExams() {
  await connectToDatabase();
  // No type field in PracticeExam
  const exams = await PracticeExam.find({}).sort({ examNumber: 1 }).lean();
  return JSON.parse(JSON.stringify(exams)) as ClientExam[]; 
}

export default async function Home() {
  const exams = await getExams();

  return (
    <div className="container mx-auto">
      <div className="mb-10 text-center space-y-4">
         <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight">Sınav Merkezi</h1>
         <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Milli Eğitim Bakanlığı Şube Müdürlüğü sınavına hazırlık için deneme sınavları.
         </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 pb-8">
          {exams.map((exam) => (
            <Card key={String(exam._id)} className="transition-all duration-300 hover:shadow-xl border-slate-200 h-full flex flex-col bg-white">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl text-slate-900 transition-colors line-clamp-1">{exam.title}</CardTitle>
                <CardDescription className="line-clamp-2 min-h-[2.5rem]">{exam.description || "Açıklama bulunmuyor."}</CardDescription>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="flex items-center gap-4 text-sm text-slate-500 mt-2">
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100">
                    <Clock className="w-4 h-4 text-blue-500" />
                    <span>{exam.duration} Dk</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-50 px-2.5 py-1.5 rounded-md border border-slate-100">
                    <HelpCircle className="w-4 h-4 text-blue-500" />
                    <span>{exam.questions.length} Soru</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto pt-4 border-t border-slate-50">
                 <Link href={`/exam/${String(exam._id)}`} className="w-full block">
                    <Button className="w-full bg-slate-900 hover:bg-slate-800 transition-all duration-300 shadow-sm cursor-pointer active:scale-[0.98]">
                       Sınava Başla <ArrowRight className="w-4 h-4 ml-2 transition-transform" />
                    </Button>
                 </Link>
              </CardFooter>
            </Card>
          ))}
          {exams.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                   <HelpCircle className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900">Henüz deneme sınavı eklenmemiş</h3>
                <p className="text-slate-400 mt-1">Lütfen daha sonra tekrar kontrol edin.</p>
            </div>
          )}
      </div>
    </div>
  );
}
