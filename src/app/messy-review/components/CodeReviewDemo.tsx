'use client';

import { useState } from 'react';

import {
  AlertTriangle,
  Check,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Code,
  Copy,
  Eye,
  Filter,
  Info,
  Shield,
  Wrench,
  XCircle,
  Zap,
} from 'lucide-react';
import { toast } from 'sonner';

import { Button } from '@/shared/components/ui/button';
import { type CodeAnalysis, analyzeMessyCode, getOriginalCode } from '@/shared/utils/problem3';

const severityIcons = {
  High: <XCircle className='size-4 text-red-400' />,
  Medium: <AlertTriangle className='size-4 text-yellow-400' />,
  Low: <Info className='size-4 text-blue-400' />,
};

const categoryIcons = {
  Performance: <Zap className='size-4 text-purple-400' />,
  'Type Safety': <Shield className='size-4 text-green-400' />,
  'Logic Error': <XCircle className='size-4 text-red-400' />,
  'Best Practice': <Wrench className='size-4 text-orange-400' />,
  Maintainability: <Filter className='size-4 text-cyan-400' />,
};

const severityColors = {
  High: 'border-red-400/20 bg-red-400/5',
  Medium: 'border-yellow-400/20 bg-yellow-400/5',
  Low: 'border-blue-400/20 bg-blue-400/5',
};

export default function CodeReviewDemo() {
  const [analysis] = useState<CodeAnalysis>(() => analyzeMessyCode());
  const [expandedIssues, setExpandedIssues] = useState<Set<string>>(new Set());
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [showOriginalCode, setShowOriginalCode] = useState(true);

  const toggleIssueExpansion = (issueId: string) => {
    const newExpanded = new Set(expandedIssues);
    if (newExpanded.has(issueId)) {
      newExpanded.delete(issueId);
    } else {
      newExpanded.add(issueId);
    }
    setExpandedIssues(newExpanded);
  };

  const copyToClipboard = async (text: string, type: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCode(type);
      toast.success('Copied to clipboard');
      setTimeout(() => setCopiedCode(null), 2000);
    } catch (err) {
      toast.error('Failed to copy text: ' + err);
    }
  };

  return (
    <div className='mx-auto max-w-7xl space-y-8 p-6'>
      <div className='space-y-4 text-center'>
        <h1 className='text-foreground text-4xl font-bold'>React Messy Code Review Challenge</h1>
        <p className='text-muted-foreground mx-auto max-w-3xl text-lg'>
          <span className='font-mono text-indigo-400'>
            Identify issues, understand impacts, and the refactored solution.
          </span>
        </p>
      </div>

      {/* Summary Stats */}
      <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
        <div className='bg-card border-border rounded-lg border p-4 text-center'>
          <div className='text-foreground text-2xl font-bold'>{analysis.summary.totalIssues}</div>
          <div className='text-muted-foreground text-sm'>Total Issues</div>
        </div>
        <div className='rounded-lg border border-red-400/20 bg-red-400/5 p-4 text-center'>
          <div className='text-2xl font-bold text-red-400'>{analysis.summary.highSeverity}</div>
          <div className='text-muted-foreground text-sm'>High Severity</div>
        </div>
        <div className='rounded-lg border border-yellow-400/20 bg-yellow-400/5 p-4 text-center'>
          <div className='text-2xl font-bold text-yellow-400'>
            {analysis.summary.mediumSeverity}
          </div>
          <div className='text-muted-foreground text-sm'>Medium Severity</div>
        </div>
        <div className='rounded-lg border border-blue-400/20 bg-blue-400/5 p-4 text-center'>
          <div className='text-2xl font-bold text-blue-400'>{analysis.summary.lowSeverity}</div>
          <div className='text-muted-foreground text-sm'>Low Severity</div>
        </div>
      </div>

      {/* Code Toggle */}
      <div className='flex justify-start'>
        <Button
          onClick={() => setShowOriginalCode(!showOriginalCode)}
          className='bg-card border-border hover:bg-accent flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition-colors'
          variant='outline'
        >
          <Eye className='size-4' />
          {showOriginalCode ? 'Show Refactored Code' : 'Show Original Code'}
        </Button>
      </div>

      {/* Code Display */}
      <div className='bg-card border-border rounded-lg border p-6'>
        <div className='mb-4 flex items-center justify-between'>
          <h3 className='text-foreground flex items-center gap-2 text-xl font-semibold'>
            <Code className='size-5' />
            {showOriginalCode ? 'Original Code' : 'Refactored Code'}
          </h3>
          <Button
            onClick={() =>
              copyToClipboard(
                showOriginalCode ? getOriginalCode() : analysis.refactoredCode,
                showOriginalCode ? 'original' : 'refactored',
              )
            }
            className='flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 transition-colors'
            variant='outline'
          >
            {copiedCode === (showOriginalCode ? 'original' : 'refactored') ? (
              <Check className='size-4 text-green-400' />
            ) : (
              <Copy className='size-4' />
            )}
            Copy Code
          </Button>
        </div>

        <div className='bg-background overflow-x-auto rounded-md p-4'>
          <pre className='text-foreground font-mono text-sm whitespace-pre-wrap'>
            <code>{showOriginalCode ? getOriginalCode() : analysis.refactoredCode}</code>
          </pre>
        </div>
      </div>

      {/* Issues List */}
      <div className='space-y-4'>
        <h3 className='text-foreground flex items-center gap-2 text-2xl font-semibold'>
          <AlertTriangle className='size-6' />
          Identified Issues ({analysis.issues.length})
        </h3>

        {analysis.issues.map(issue => (
          <div
            key={issue.id}
            className={`rounded-lg border p-4 transition-all duration-200 ${severityColors[issue.severity]}`}
          >
            <div
              className='flex cursor-pointer items-center justify-between'
              onClick={() => toggleIssueExpansion(issue.id)}
            >
              <div className='flex items-center gap-3'>
                {severityIcons[issue.severity]}
                <div>
                  <h4 className='text-foreground font-semibold'>{issue.title}</h4>
                  <div className='text-muted-foreground flex items-center gap-2 text-sm'>
                    <span className='flex items-center gap-1'>
                      {categoryIcons[issue.category]}
                      {issue.category}
                    </span>
                    <span>•</span>
                    <span className='capitalize'>{issue.severity} Severity</span>
                  </div>
                </div>
              </div>
              {expandedIssues.has(issue.id) ? (
                <ChevronDown className='size-4' />
              ) : (
                <ChevronRight className='size-4' />
              )}
            </div>

            {expandedIssues.has(issue.id) && (
              <div className='mt-4 space-y-4 pl-7'>
                <div>
                  <h5 className='text-foreground mb-2 font-medium'>Description:</h5>
                  <p className='text-muted-foreground text-sm'>{issue.description}</p>
                </div>

                <div>
                  <h5 className='text-foreground mb-2 font-medium'>Problem Code:</h5>
                  <div className='bg-background rounded-md p-3'>
                    <code className='font-mono text-sm text-red-400'>{issue.codeSnippet}</code>
                  </div>
                </div>

                <div>
                  <h5 className='text-foreground mb-2 font-medium'>Explanation:</h5>
                  <p className='text-muted-foreground text-sm'>{issue.explanation}</p>
                </div>

                <div>
                  <h5 className='text-foreground mb-2 font-medium'>Fix:</h5>
                  <p className='text-sm text-green-400'>{issue.fix}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key Improvements Summary */}
      <div className='bg-card border-border rounded-lg border p-6'>
        <h3 className='text-foreground mb-4 flex items-center gap-2 text-xl font-semibold'>
          <CheckCircle className='size-5 text-green-400' />
          Key Improvements in Refactored Code
        </h3>

        <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <Shield className='mt-0.5 size-5 text-green-400' />
              <div>
                <h4 className='text-foreground font-medium'>Type Safety</h4>
                <p className='text-muted-foreground text-sm'>
                  Proper TypeScript types, removed any types, added blockchain type union
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <Zap className='mt-0.5 size-5 text-purple-400' />
              <div>
                <h4 className='text-foreground font-medium'>Performance</h4>
                <p className='text-muted-foreground text-sm'>
                  Fixed useMemo dependencies, added proper memoization, removed redundant
                  computations
                </p>
              </div>
            </div>
          </div>

          <div className='space-y-4'>
            <div className='flex items-start gap-3'>
              <Wrench className='mt-0.5 size-5 text-orange-400' />
              <div>
                <h4 className='text-foreground font-medium'>Best Practices</h4>
                <p className='text-muted-foreground text-sm'>
                  Unique React keys, proper component structure, custom hooks separation
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3'>
              <Filter className='mt-0.5 size-5 text-cyan-400' />
              <div>
                <h4 className='text-foreground font-medium'>Maintainability</h4>
                <p className='text-muted-foreground text-sm'>
                  Configuration objects, consistent formatting, clear separation of concerns
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
