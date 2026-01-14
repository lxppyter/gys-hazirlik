"use client";

import { useState } from "react";
import { ClientExam } from "@/types";
import { ExamTimer } from "./ExamTimer";
import { QuestionViewer } from "./QuestionViewer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ExamRunnerProps {
  exam: ClientExam;
}

export function ExamRunner({ exam }: ExamRunnerProps) {
  const [status, setStatus] = useState<'intro' | 'active' | 'finished'>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<'all' | 'correct' | 'wrong' | 'empty'>('all');

  const handleStart = () => setStatus('active');
  
  const handleAnswer = (val: string) => {
    const qId = exam.questions[currentQuestionIndex]._id as string;
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    if (confirm("Sınavı bitirmek istediğinize emin misiniz?")) {
        setStatus('finished');
    }
  };

  const calculateResults = () => {
    let correct = 0;
    let wrong = 0;
    let empty = 0;

    exam.questions.forEach(q => {
      const qId = q._id as string;
      const ans = answers[qId];
      if (!ans) {
        empty++;
      } else if (ans === q.correctAnswer) {
        correct++;
      } else {
        wrong++;
      }
    });

    return { correct, wrong, empty, total: exam.questions.length };
  };
  const [termsAccepted, setTermsAccepted] = useState(false);

  if (status === 'intro') {

    return (
      <div className="min-h-[80vh] flex items-center justify-center p-4">
        <Card className="max-w-3xl w-full shadow-lg border-t-4 border-t-blue-600">
          <CardHeader className="text-center pb-2 pt-6 border-b">
            <Badge className="w-fit mx-auto mb-2 bg-blue-100 text-blue-800 hover:bg-blue-100 px-3 py-0.5 text-xs">Önemli Bilgilendirme</Badge>
            <CardTitle className="text-2xl font-bold text-slate-900">{exam.title}</CardTitle>
            <p className="text-slate-500 text-sm mt-1">{exam.description || "Başarılar dileriz."}</p>
          </CardHeader>
          <CardContent className="space-y-5 pt-4 px-6">
             
             <div className="bg-slate-50 p-5 rounded-xl border border-slate-100 space-y-4 text-slate-700 leading-relaxed text-sm">
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">1</div>
                    <p><span className="font-semibold text-slate-900 block mb-1">Sınav İçeriği:</span> Bu sınav, MEB - GYS sınavında karşınıza çıkabilecek sorulara benzer, titizlikle hazırlanmış özgün sorulardan oluşmaktadır.</p>
                </div>
                
                <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">2</div>
                    <p><span className="font-semibold text-slate-900 block mb-1">Süre Yönetimi:</span> Sınav süresi <strong>{exam.duration} dakikadır.</strong> Gerçek sınavda optik form kodlaması da yapacağınız için, buradaki süreyi verimli kullanmanız ve hız kazanmanız önerilir.</p>
                </div>

                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">3</div>
                    <p><span className="font-semibold text-slate-900 block mb-1">Zorluk Seviyesi:</span> Bazı denemeler, gelişiminizi desteklemek amacıyla bilerek <strong>"çok zor"</strong> hazırlanmıştır. Yanlışlarınız moralinizi bozmasın; aksine eksiklerinizi görmek için bir fırsattır.</p>
                </div>

                 <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center flex-shrink-0 font-bold text-sm">4</div>
                    <p><span className="font-semibold text-slate-900 block mb-1">Analiz ve Tekrar:</span> Sınav bitiminde detaylı sonuç ekranı açılacaktır. Yanlış yaptığınız konu başlıklarını mutlaka not alınız. Bir denemeyi sadece bir kez değil, aralıklarla tekrar çözmeniz başarınızı artıracaktır.</p>
                </div>
             </div>

             <div className="flex items-center space-x-3 p-4 bg-white border rounded-lg hover:bg-slate-50 transition-colors cursor-pointer" onClick={() => setTermsAccepted(!termsAccepted)}>
                <div className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${termsAccepted ? 'bg-blue-600 border-blue-600 text-white' : 'border-slate-300 bg-white'}`}>
                    {termsAccepted && <CheckCircle2 className="w-4 h-4" />}
                </div>
                <label className="text-slate-700 font-medium cursor-pointer select-none text-sm">
                    Yukarıdaki bilgilendirmeyi okudum ve anladım.
                </label>
             </div>

            <Button 
              size="lg" 
              onClick={handleStart} 
              disabled={!termsAccepted}
              className="w-full h-12 text-lg font-bold shadow-md shadow-blue-100 transition-all cursor-pointer"
            >
              Sınava Başla
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (status === 'finished') {
    const results = calculateResults();
    const score = (results.correct / results.total) * 100;

    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
        {/* Summary Card */}
        <Card>
            <CardHeader className="text-center border-b bg-slate-50/50">
                <CardTitle className="text-2xl">Sınav Sonucu</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <button 
                        onClick={() => setFilter(filter === 'correct' ? 'all' : 'correct')}
                        className={`p-4 rounded-lg border transition-all ${filter === 'correct' ? 'ring-2 ring-green-500 bg-green-100' : 'bg-green-50 border-green-100 hover:bg-green-100'}`}
                    >
                        <div className="text-3xl font-bold text-green-700">{results.correct}</div>
                        <div className="text-sm text-green-600 font-medium">Doğru</div>
                    </button>
                    <button 
                        onClick={() => setFilter(filter === 'wrong' ? 'all' : 'wrong')}
                        className={`p-4 rounded-lg border transition-all ${filter === 'wrong' ? 'ring-2 ring-red-500 bg-red-100' : 'bg-red-50 border-red-100 hover:bg-red-100'}`}
                    >
                        <div className="text-3xl font-bold text-red-700">{results.wrong}</div>
                        <div className="text-sm text-red-600 font-medium">Yanlış</div>
                    </button>
                     <button 
                        onClick={() => setFilter(filter === 'empty' ? 'all' : 'empty')}
                        className={`p-4 rounded-lg border transition-all ${filter === 'empty' ? 'ring-2 ring-slate-500 bg-slate-100' : 'bg-slate-50 border-slate-100 hover:bg-slate-100'}`}
                    >
                        <div className="text-3xl font-bold text-slate-700">{results.empty}</div>
                        <div className="text-sm text-slate-600 font-medium">Boş</div>
                    </button>
                     <div className="p-4 rounded-lg bg-blue-50 border border-blue-100 cursor-default">
                        <div className="text-3xl font-bold text-blue-700">%{score.toFixed(0)}</div>
                        <div className="text-sm text-blue-600 font-medium">Başarı</div>
                    </div>
                </div>
                {filter !== 'all' && (
                    <div className="mt-4 text-center">
                        <Button variant="ghost" size="sm" onClick={() => setFilter('all')} className="text-slate-500">
                            Filtreyi Temizle (Tümünü Göster)
                        </Button>
                    </div>
                )}
            </CardContent>
             <div className="p-4 bg-slate-50 flex justify-center gap-4">
                 <Link href="/">
                    <Button variant="outline">Anasayfaya Dön</Button>
                 </Link>
             </div>
        </Card>

        {/* Detailed Review */}
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">
                {filter === 'all' ? 'Tüm Sorular' : 
                 filter === 'correct' ? 'Doğru Cevaplarınız' : 
                 filter === 'wrong' ? 'Yanlış Cevaplarınız' : 'Boş Bıraktıklarınız'}
            </h2>
            
            {exam.questions
                .map((q, idx) => {
                    const userAns = answers[q._id as string];
                    const isCorrect = userAns === q.correctAnswer;
                    const isEmpty = !userAns;
                    
                    // Filter Logic
                    if (filter === 'correct' && !isCorrect) return null;
                    if (filter === 'wrong' && (isCorrect || isEmpty)) return null; 
                    if (filter === 'empty' && !isEmpty) return null;

                    return { q, idx, userAns, isCorrect, isEmpty };
                })
                .filter(Boolean) // Remove nulls
                .map((item) => {
                    const { q, idx, userAns, isCorrect, isEmpty } = item!;
                    return (
                    <Card key={q._id as string} className={`border-l-4 ${isCorrect ? 'border-l-green-500' : isEmpty ? 'border-l-slate-300' : 'border-l-red-500'}`}>
                        <CardContent className="pt-6 space-y-4">
                            <div className="flex items-start justify-between">
                                <h3 className="text-lg font-medium"><span className="font-bold mr-2">{idx + 1}.</span>{q.text}</h3>
                                {isCorrect ? (
                                    <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Doğru</Badge>
                                ) : isEmpty ? (
                                     <Badge variant="outline" className="text-slate-500">Boş</Badge>
                                ) : (
                                    <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Yanlış</Badge>
                                )}
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div className={`p-3 rounded border ${isCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                                    <span className="font-bold block mb-1">Senin Cevabın:</span>
                                    {userAns ? `${userAns}) ${q.options[userAns as keyof typeof q.options]}` : "Boş Bırakıldı"}
                                </div>
                                <div className="p-3 rounded border bg-green-50 border-green-200">
                                    <span className="font-bold block mb-1">Doğru Cevap:</span>
                                    {q.correctAnswer}) {q.options[q.correctAnswer as keyof typeof q.options]}
                                </div>
                            </div>

                            {(q.explanation || q.source) && (
                                <div className="bg-slate-50 p-4 rounded-lg text-slate-700 text-sm">
                                    {q.explanation && (
                                        <div className="mb-2">
                                            <span className="font-bold text-slate-900 block mb-1">Açıklama:</span>
                                            {q.explanation}
                                        </div>
                                    )}
                                    {q.source && (
                                        <div className="mt-2 pt-2 border-t border-slate-200 text-xs">
                                            <span className="font-bold text-slate-800">Kaynak: </span>
                                            <span className="text-slate-600 italic">{q.source}</span>
                                        </div>
                                    )}
                                </div>
                            )}
                        </CardContent>
                    </Card>
                );
            })}
            
            {/* Empty State for Filter */}
            {exam.questions.every(q => {
                 const userAns = answers[q._id as string];
                 const isCorrect = userAns === q.correctAnswer;
                 const isEmpty = !userAns;
                 if (filter === 'correct' && !isCorrect) return true;
                 if (filter === 'wrong' && (isCorrect || isEmpty)) return true;
                 if (filter === 'empty' && !isEmpty) return true;
                 return false;
            }) && (
                <div className="text-center py-10 text-slate-500 bg-slate-50 rounded-lg">
                    Bu kategoride sonuç bulunamadı.
                </div>
            )}
        </div>
      </div>
    );
  }

  const currentQuestion = exam.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion._id as string];

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* Header with Title and Timer */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-lg shadow-sm border sticky top-0 z-10">
        <h2 className="font-bold text-slate-700 truncate max-w-md text-lg">{exam.title}</h2>
        <ExamTimer 
            durationMinutes={exam.duration} 
            isActive={status === 'active'} 
            onTimeUp={() => {
                alert("Süre doldu! Sınavınız sonlandırılıyor.");
                setStatus('finished');
            }} 
        />
      </div>

      {/* Pagination Grid */}
      <div className="bg-white p-4 rounded-lg shadow-sm border">
        <div className="flex flex-wrap gap-2 justify-center">
            {exam.questions.map((_, idx) => {
                const isAnswered = !!answers[exam.questions[idx]._id as string];
                const isCurrent = currentQuestionIndex === idx;
                
                return (
                    <button
                        key={idx}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`
                            w-8 h-8 text-xs font-semibold rounded-md border transition-all
                            ${isCurrent 
                                ? 'bg-slate-900 text-white border-slate-900 ring-2 ring-offset-1 ring-slate-900' 
                                : isAnswered 
                                    ? 'bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-200' 
                                    : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                            }
                        `}
                    >
                        {idx + 1}
                    </button>
                );
            })}
        </div>
        <div className="mt-3 flex gap-4 justify-center text-xs text-slate-500">
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-900 rounded"></div> Mevcut</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-blue-100 border border-blue-200 rounded"></div> Cevaplanmış</div>
            <div className="flex items-center gap-1"><div className="w-3 h-3 bg-white border border-slate-200 rounded"></div> Boş</div>
        </div>
      </div>

      {/* Question Area */}
      <QuestionViewer 
        key={currentQuestion._id as string}
        question={currentQuestion} 
        questionNumber={currentQuestionIndex + 1}
        selectedOption={currentAnswer}
        onSelectOption={(val) => {
            handleAnswer(val);
            // Optional: Auto-advance after selection if desired, but user asked for free navigation.
            // Keeping it manual for better control as requested ("geri dönebilmeli").
        }}
      />

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-2">
        <Button 
            variant="outline" 
            onClick={handlePrev} 
            disabled={currentQuestionIndex === 0}
            className="w-32"
        >
            <ArrowLeft className="w-4 h-4 mr-2" /> Önceki
        </Button>

        <Button 
            onClick={handleNext} 
            disabled={currentQuestionIndex === exam.questions.length - 1}
            variant="default" // Changed from conditonal styling
            className="w-32 bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
        >
            Sonraki <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Persistent Finish Button */}
      <div className="pt-8 border-t mt-8">
        <Button 
            onClick={handleFinish}
            variant="destructive"
            className="w-full py-6 text-lg font-semibold shadow-red-100 shadow-lg hover:bg-red-600 transition-colors"
        >
            Sınavı Bitir ve Sonuçları Gör
        </Button>
      </div>

    </div>
  );
}
