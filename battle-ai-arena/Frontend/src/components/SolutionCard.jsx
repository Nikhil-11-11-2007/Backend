import React from 'react';
import ReactMarkdown from 'react-markdown';

export function SolutionCard({ title, markdownContent }) {
  return (
    <div className="bg-surface-container-low rounded-lg p-6 flex-1">
      <h3 className="font-display font-semibold text-primary uppercase tracking-wider text-sm mb-4">
        {title}
      </h3>
      <div className="prose prose-sm md:prose-base prose-slate max-w-none font-sans text-on-surface">
        <ReactMarkdown>{markdownContent}</ReactMarkdown>
      </div>
    </div>
  );
}
