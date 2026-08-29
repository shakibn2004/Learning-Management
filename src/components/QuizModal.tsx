'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { useToast } from '../context/ToastContext';
import { Quiz, QuizAttempt } from '../types';
import { X, Award, CheckCircle2, XCircle, Sparkles, RefreshCw } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose }) => {
  const { submitQuizAttempt, quizAttempts, currentUser } = useLMS();
  const toast = useToast();

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submittedAttempt, setSubmittedAttempt] = useState<QuizAttempt | null>(null);
  const [isRetaking, setIsRetaking] = useState(false);

  const previousAttempt = quizAttempts
    .filter(
      (qa) =>
        qa.quizId === quiz.id &&
        (String(qa.studentId) === String(currentUser.id) || qa.studentId === currentUser.email)
    )
    .sort(
      (a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime()
    )[0];

  // When retaking, show fresh blank quiz until submitted
  const activeResult = isRetaking ? submittedAttempt : (submittedAttempt || previousAttempt);

  const handleOptionSelect = (qId: string, optId: string) => {
    if (activeResult) return;
    setUserAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleRetake = () => {
    setIsRetaking(true);
    setSubmittedAttempt(null);
    setUserAnswers({});
    toast.info('Quiz Retake Started', 'All answers have been reset. Select your new choices.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (Object.keys(userAnswers).length === 0) {
      toast.error('No Answers Selected', 'Please answer the quiz questions before submitting.');
      return;
    }

    const result = submitQuizAttempt(quiz.id, userAnswers);
    setSubmittedAttempt(result);
    setIsRetaking(false);
    toast.success(
      result.passed ? 'Quiz Passed! 🎉' : 'Quiz Completed',
      `You scored ${result.scorePercentage}% (Passing score: ${quiz.passingScore}%)`
    );

    if (result.passed) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        // ignore confetti errors
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#141d2b] w-full max-w-3xl rounded-2xl border border-slate-700/80 shadow-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 sticky top-0 bg-[#141d2b] z-10">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-[#a855f7]/15 border border-[#a855f7]/30 flex items-center justify-center text-[#c084fc] shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">{quiz.title}</h3>
              <p className="text-xs text-slate-400">Passing Score: {quiz.passingScore}%</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Banner */}
        {activeResult && (
          <div
            className={`mt-4 p-4 sm:p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 animate-fadeIn ${
              activeResult.passed
                ? 'bg-[#10b981]/15 border-[#10b981]/30 text-emerald-200'
                : 'bg-rose-500/15 border-rose-500/30 text-rose-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              {activeResult.passed ? (
                <CheckCircle2 className="w-7 h-7 text-[#34d399] shrink-0" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-400 shrink-0" />
              )}
              <div>
                <h4 className="text-sm sm:text-base font-bold">
                  {activeResult.passed ? 'Assessment Passed! 🎉' : 'Assessment Failed'}
                </h4>
                <p className="text-xs text-slate-300">
                  Calculated Score: <strong className="font-mono text-sm">{activeResult.scorePercentage}%</strong> (Required: {quiz.passingScore}%)
                </p>
              </div>
            </div>

            <button
              onClick={handleRetake}
              className="px-3.5 py-2 rounded-xl bg-[#1a2436] hover:bg-slate-800 border border-slate-700 hover:border-slate-600 text-xs font-semibold text-white flex items-center space-x-1.5 transition-all self-start sm:self-auto shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
              <span>Retake Quiz</span>
            </button>
          </div>
        )}

        {/* Retake In Progress Notice */}
        {isRetaking && (
          <div className="mt-4 p-3.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 text-xs flex items-center justify-between animate-fadeIn">
            <span className="flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
              <span><strong>Retake In Progress:</strong> Select your new answers and submit for auto-grading below.</span>
            </span>
            <button
              type="button"
              onClick={() => setIsRetaking(false)}
              className="text-xs text-slate-400 hover:text-white underline ml-3 shrink-0"
            >
              Cancel Retake
            </button>
          </div>
        )}

        {/* Question Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-xs">
          {quiz.questions.map((q, idx) => {
            const selectedOpt = userAnswers[q.id] || activeResult?.answers[q.id];
            const isCorrect = activeResult && selectedOpt === q.correctOptionId;

            return (
              <div
                key={q.id}
                className={`p-4 sm:p-5 rounded-xl border transition-all ${
                  activeResult
                    ? isCorrect
                      ? 'bg-[#1a2436] border-[#10b981]/40'
                      : 'bg-[#1a2436] border-rose-500/40'
                    : 'bg-[#1a2436] border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <span className="px-2 py-0.5 rounded bg-[#3b82f6]/20 text-[#60a5fa] font-mono font-bold text-[11px] shrink-0">
                    Q{idx + 1}
                  </span>
                  <h4 className="text-xs sm:text-sm font-bold text-white flex-1">{q.question}</h4>
                </div>

                {/* Options List */}
                <div className="space-y-2">
                  {q.options.map((opt) => {
                    const isSelected = selectedOpt === opt.id;
                    const isRightOption = activeResult && opt.id === q.correctOptionId;

                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleOptionSelect(q.id, opt.id)}
                        className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isRightOption
                            ? 'bg-[#10b981]/20 border-[#10b981] text-white font-semibold'
                            : isSelected
                            ? activeResult && !isCorrect
                              ? 'bg-rose-500/20 border-rose-500 text-white font-semibold'
                              : 'bg-[#3b82f6]/20 border-[#3b82f6] text-white font-semibold'
                            : 'bg-[#0f172a] border-slate-800 hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-q-${q.id}`}
                          checked={isSelected}
                          onChange={() => handleOptionSelect(q.id, opt.id)}
                          disabled={!!activeResult}
                          className="text-[#3b82f6] focus:ring-[#3b82f6]"
                        />
                        <span className="text-xs flex-1">{opt.text}</span>
                        {isRightOption && <CheckCircle2 className="w-4 h-4 text-[#34d399] shrink-0" />}
                      </label>
                    );
                  })}
                </div>

                {/* Auto-Grading Feedback Explanation */}
                {activeResult && q.explanation && (
                  <div className="mt-3 p-3 rounded-lg bg-[#0f172a] border border-slate-800 text-[11px] text-slate-300 italic">
                    <strong className="text-[#60a5fa] not-italic">Auto-Grader Explanation: </strong>
                    {q.explanation}
                  </div>
                )}
              </div>
            );
          })}

          {!activeResult && (
            <div className="pt-4 border-t border-slate-800 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-[#3b82f6] hover:bg-blue-600 text-white font-bold rounded-xl text-xs shadow-md shadow-blue-500/20 flex items-center justify-center space-x-2"
              >
                <Sparkles className="w-4 h-4" />
                <span>Submit Quiz for Instant Auto-Grading</span>
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
