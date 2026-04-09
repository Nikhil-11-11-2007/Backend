import ReactMarkdown from 'react-markdown';
import { SolutionCard } from './SolutionCard';
import { JudgePanel } from './JudgePanel';
import { Sparkles, User } from 'lucide-react';

export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="w-full flex justify-end mb-8 pl-12 md:pl-24">
        <div className="bg-secondary-container text-on-surface p-6 rounded-2xl rounded-tr-none max-w-prose shadow-sm">
          <p className="font-sans text-body-lg text-on-surface">{message.text}</p>
        </div>
      </div>
    );
  }

  // AI Message
  const data = message.data || {};
  
  return (
    <div className="w-full flex justify-start mb-16 relative">
      {/* AI Accent Line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary-fixed-dim rounded-full"></div>
      
      <div className="pl-6 w-full flex flex-col gap-8 max-w-5xl">
        {/* Header / Context */}
        <div className="flex items-center gap-3 text-primary">
          <Sparkles size={24} className="text-primary opacity-80" />
          <h2 className="font-display text-headline-sm font-semibold tracking-tight">AI Evaluation</h2>
        </div>

        {/* Problem Section */}
        {data.problem && (
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(43,52,55,0.06)] border border-outline-variant/15">
            <h3 className="font-display text-label-sm uppercase tracking-widest text-primary mb-3">Problem</h3>
            <div className="font-sans text-body-lg text-on-surface">
              <ReactMarkdown>{data.problem}</ReactMarkdown>
            </div>
          </div>
        )}

        {/* Solutions Section */}
        {data.solution_1 && data.solution_2 && (
          <div className="flex flex-col md:flex-row gap-6">
            <SolutionCard title="Solution 1" markdownContent={data.solution_1} />
            <SolutionCard title="Solution 2" markdownContent={data.solution_2} />
          </div>
        )}

        {/* Judge Recommendation */}
        {data.judge && (
          <div className="bg-surface-container-lowest p-8 rounded-xl shadow-[0px_12px_32px_rgba(43,52,55,0.06)] border border-outline-variant/15">
            <JudgePanel judgeData={data.judge} />
          </div>
        )}
      </div>
    </div>
  );
}
