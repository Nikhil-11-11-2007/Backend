import React from 'react';
import ReactMarkdown from 'react-markdown';

export function JudgePanel({ judgeData }) {
  return (
    <div className="mt-8 pt-6">
      <h3 className="font-display text-headline-sm font-semibold text-primary uppercase tracking-widest text-xs mb-6">Judge Recommendation</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Solution 1 Evaluation */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-high font-display font-bold text-lg text-on-surface">
              {judgeData.solution_1_score}
            </div>
            <span className="font-sans font-medium text-on-surface/80">Solution 1 Score</span>
          </div>
          <div className="text-body-lg text-on-surface/90 font-sans leading-relaxed">
            <ReactMarkdown>{judgeData.solution_1_reasoning}</ReactMarkdown>
          </div>
        </div>

        {/* Solution 2 Evaluation */}
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-surface-container-high font-display font-bold text-lg text-on-surface">
              {judgeData.solution_2_score}
            </div>
            <span className="font-sans font-medium text-on-surface/80">Solution 2 Score</span>
          </div>
          <div className="text-body-lg text-on-surface/90 font-sans leading-relaxed">
            <ReactMarkdown>{judgeData.solution_2_reasoning}</ReactMarkdown>
          </div>
        </div>
      </div>
    </div>
  );
}
