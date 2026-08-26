'use client';

import React, { useState } from 'react';
import { useLMS } from '../context/LMSContext';
import { Quiz, QuizQuestion } from '../types';
import { X, HelpCircle, Plus, Trash2 } from 'lucide-react';

interface QuizBuilderModalProps {
  courseId: string;
  onClose: () => void;
}

export const QuizBuilderModal: React.FC<QuizBuilderModalProps> = ({ courseId, onClose }) => {
  const { courses, saveQuiz } = useLMS();
  const currentCourse = courses.find((c) => c.id === courseId);

  const existingQuiz = currentCourse?.quiz;

  const [title, setTitle] = useState(existingQuiz?.title || `${currentCourse?.title || 'Course'} Quiz Assessment`);
  const [description, setDescription] = useState(existingQuiz?.description || 'Auto-graded multiple choice quiz.');
  const [passingScore, setPassingScore] = useState(existingQuiz?.passingScore || 70);

  const [questions, setQuestions] = useState<QuizQuestion[]>(
    existingQuiz?.questions || [
      {
        id: 'q-1',
        question: 'Sample Question: What is Next.js App Router?',
        options: [
          { id: 'opt-1', text: 'A React framework feature for file-based routing and server components.' },
          { id: 'opt-2', text: 'A CSS preprocessor.' },
          { id: 'opt-3', text: 'A database query engine.' },
        ],
        correctOptionId: 'opt-1',
        explanation: 'App Router introduces React Server Components for server-side rendering.',
      },
    ]
  );

  const addQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      question: 'New Question Title',
      options: [
        { id: `opt-${Date.now()}-1`, text: 'Option A' },
        { id: `opt-${Date.now()}-2`, text: 'Option B' },
      ],
      correctOptionId: `opt-${Date.now()}-1`,
      explanation: 'Explanation for correct answer.',
    };
    setQuestions([...questions, newQ]);
  };

  const removeQuestion = (qId: string) => {
    setQuestions(questions.filter((q) => q.id !== qId));
  };

  const updateQuestionText = (qId: string, text: string) => {
    setQuestions(questions.map((q) => (q.id === qId ? { ...q, question: text } : q)));
  };

  const updateExplanation = (qId: string, exp: string) => {
    setQuestions(questions.map((q) => (q.id === qId ? { ...q, explanation: exp } : q)));
  };

  const updateOptionText = (qId: string, optId: string, text: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId) {
          return {
            ...q,
            options: q.options.map((o) => (o.id === optId ? { ...o, text } : o)),
          };
        }
        return q;
      })
    );
  };

  const addOption = (qId: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId) {
          const newOptId = `opt-${Date.now()}`;
          return {
            ...q,
            options: [...q.options, { id: newOptId, text: `New Option ${q.options.length + 1}` }],
          };
        }
        return q;
      })
    );
  };

  const setCorrectOption = (qId: string, optId: string) => {
    setQuestions(questions.map((q) => (q.id === qId ? { ...q, correctOptionId: optId } : q)));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || questions.length === 0) return;

    const quizData: Quiz = {
      id: existingQuiz?.id || `quiz-${Date.now()}`,
      courseId,
      title,
      description,
      passingScore: Number(passingScore),
      questions,
    };

    saveQuiz(courseId, quizData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#141d2b] w-full max-w-3xl rounded-2xl border border-slate-700/80 shadow-2xl p-4 sm:p-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 sticky top-0 bg-[#141d2b] z-10">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-[#c084fc]" />
            <h3 className="text-base sm:text-lg font-bold text-white">Quiz Builder & Auto-Grader Configuration</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-slate-300 font-semibold mb-1">Quiz Title *</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Passing Score (%)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={passingScore}
                onChange={(e) => setPassingScore(parseInt(e.target.value) || 70)}
                className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Description / Instructions</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-[#1a2436] w-full px-3.5 py-2.5 rounded-xl text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
            />
          </div>

          {/* Questions list */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs sm:text-sm font-bold text-white">Multiple Choice Questions ({questions.length})</h4>
              <button
                type="button"
                onClick={addQuestion}
                className="flex items-center space-x-1 text-xs font-semibold text-[#60a5fa] hover:text-blue-300"
              >
                <Plus className="w-4 h-4" />
                <span>Add Question</span>
              </button>
            </div>

            {questions.map((q, qIndex) => (
              <div key={q.id} className="p-4 bg-[#1a2436] rounded-xl border border-slate-800 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[11px] font-bold text-[#60a5fa]">Q{qIndex + 1}</span>
                  <input
                    type="text"
                    required
                    value={q.question}
                    onChange={(e) => updateQuestionText(q.id, e.target.value)}
                    placeholder="Enter question prompt..."
                    className="bg-[#0f172a] text-xs w-full px-3 py-1.5 rounded-lg text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
                  />
                  <button
                    type="button"
                    onClick={() => removeQuestion(q.id)}
                    className="p-1 text-rose-400 hover:text-rose-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Options */}
                <div className="space-y-2 pl-4 border-l-2 border-[#3b82f6]/40">
                  <span className="text-[10px] text-slate-400 font-mono">Options (Select radio for correct answer):</span>
                  {q.options.map((opt) => (
                    <div key={opt.id} className="flex items-center space-x-2">
                      <input
                        type="radio"
                        name={`correct-${q.id}`}
                        checked={q.correctOptionId === opt.id}
                        onChange={() => setCorrectOption(q.id, opt.id)}
                        className="text-[#3b82f6] focus:ring-[#3b82f6]"
                      />
                      <input
                        type="text"
                        required
                        value={opt.text}
                        onChange={(e) => updateOptionText(q.id, opt.id, e.target.value)}
                        className="bg-[#0f172a] text-xs w-full px-2.5 py-1 rounded-lg text-slate-200 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
                      />
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addOption(q.id)}
                    className="text-[11px] text-slate-400 hover:text-white underline mt-1"
                  >
                    + Add Option
                  </button>
                </div>

                <div>
                  <input
                    type="text"
                    value={q.explanation}
                    onChange={(e) => updateExplanation(q.id, e.target.value)}
                    placeholder="Auto-grading explanation for correct answer..."
                    className="bg-[#0f172a] text-[11px] w-full px-3 py-1.5 rounded-lg italic text-slate-400 border border-slate-800 focus:outline-none focus:border-[#3b82f6]"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t border-slate-800 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-[#1a2436] hover:bg-slate-800 text-slate-300 rounded-xl font-semibold text-xs border border-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-[#3b82f6] hover:bg-blue-600 text-white rounded-xl font-semibold text-xs shadow-md shadow-blue-500/20"
            >
              Save Quiz Config
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
