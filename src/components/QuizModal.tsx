'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Quiz, QuizAttempt } from '../types';
import { X, Award, CheckCircle2, XCircle, Sparkles, RefreshCw, HelpCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface QuizModalProps {
  quiz: Quiz;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ quiz, onClose }) => {
  const { submitQuizAttempt, quizAttempts, currentUser } = useLMS();

  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [submittedAttempt, setSubmittedAttempt] = useState<QuizAttempt | null>(null);

  // Check if student has previous attempt
  const previousAttempt = quizAttempts.find(
    (qa) => qa.quizId === quiz.id && qa.studentId === currentUser.id
  );

  const activeResult = submittedAttempt || previousAttempt;

  const handleOptionSelect = (qId: string, optId: string) => {
    if (activeResult) return; // locked after submission
    setUserAnswers((prev) => ({ ...prev, [qId]: optId }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = submitQuizAttempt(quiz.id, userAnswers);
    setSubmittedAttempt(result);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-3xl rounded-3xl border border-slate-700/80 shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">{quiz.title}</h3>
              <p className="text-xs text-slate-400">{quiz.description} • Passing Score: {quiz.passingScore}%</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Banner if already taken or submitted */}
        {activeResult && (
          <div
            className={`mt-4 p-5 rounded-2xl border flex items-center justify-between animate-fadeIn ${
              activeResult.passed
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              {activeResult.passed ? (
                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
              ) : (
                <XCircle className="w-8 h-8 text-rose-400 shrink-0" />
              )}
              <div>
                <h4 className="text-base font-bold">
                  {activeResult.passed ? 'Assessment Passed! 🎉' : 'Assessment Failed'}
                </h4>
                <p className="text-xs text-slate-300">
                  Calculated Score: <strong className="font-mono text-sm">{activeResult.scorePercentage}%</strong> (Required: {quiz.passingScore}%)
                </p>
              </div>
            </div>

            <button
              onClick={() => setSubmittedAttempt(null)}
              className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 border border-slate-700 text-xs font-semibold flex items-center space-x-1"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retake Quiz</span>
            </button>
          </div>
        )}

        {/* Question Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-6 text-xs">
          {quiz.questions.map((q, idx) => {
            const selectedOpt = userAnswers[q.id] || activeResult?.answers[q.id];
            const isCorrect = activeResult && selectedOpt === q.correctOptionId;

            return (
              <div
                key={q.id}
                className={`p-5 rounded-2xl border transition-all ${
                  activeResult
                    ? isCorrect
                      ? 'bg-slate-900/80 border-emerald-500/40'
                      : 'bg-slate-900/80 border-rose-500/40'
                    : 'bg-slate-900/60 border-slate-800'
                }`}
              >
                <div className="flex items-start space-x-3 mb-3">
                  <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-mono font-bold text-[11px]">
                    Q{idx + 1}
                  </span>
                  <h4 className="text-sm font-bold text-white flex-1">{q.question}</h4>
                </div>

                {/* Options List */}
                <div className="space-y-2 pl-2">
                  {q.options.map((opt) => {
                    const isSelected = selectedOpt === opt.id;
                    const isRightOption = activeResult && opt.id === q.correctOptionId;

                    return (
                      <label
                        key={opt.id}
                        onClick={() => handleOptionSelect(q.id, opt.id)}
                        className={`flex items-center space-x-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          isRightOption
                            ? 'bg-emerald-500/20 border-emerald-500 text-white font-semibold'
                            : isSelected
                            ? activeResult && !isCorrect
                              ? 'bg-rose-500/20 border-rose-500 text-white font-semibold'
                              : 'bg-indigo-600/20 border-indigo-500 text-white font-semibold'
                            : 'bg-slate-950/40 border-slate-800 hover:bg-slate-800/40 text-slate-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name={`quiz-q-${q.id}`}
                          checked={isSelected}
                          onChange={() => handleOptionSelect(q.id, opt.id)}
                          disabled={!!activeResult}
                          className="text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-xs flex-1">{opt.text}</span>
                        {isRightOption && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                      </label>
                    );
                  })}
                </div>

                {/* Auto-Grading Feedback Explanation */}
                {activeResult && q.explanation && (
                  <div className="mt-3 p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-300 italic">
                    <strong className="text-indigo-400 not-italic">Auto-Grader Explanation: </strong>
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
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-purple-500/25 flex items-center space-x-2"
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
