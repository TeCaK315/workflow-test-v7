'use client';

import { useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Zap, Copy, ExternalLink, ChevronDown, ChevronRight } from 'lucide-react';
import ExportButtons from '@/components/ExportButtons';

interface AnalysisResult {
  id: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rootCause: string;
  solution: string;
  codeSnippet?: string;
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
  estimatedTime: string;
  category: string;
}

interface AnalysisResultsProps {
  results: AnalysisResult[];
  fileName: string;
  analysisDate: string;
}

export default function AnalysisResults({ results, fileName, analysisDate }: AnalysisResultsProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [copiedItems, setCopiedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedItems(newExpanded);
  };

  const copyToClipboard = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedItems(prev => new Set([...prev, id]));
      setTimeout(() => {
        setCopiedItems(prev => {
          const newSet = new Set(prev);
          newSet.delete(id);
          return newSet;
        });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'high': return 'text-orange-400 bg-orange-500/10 border-orange-500/20';
      case 'medium': return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 'low': return 'text-green-400 bg-green-500/10 border-green-500/20';
      default: return 'text-gray-400 bg-gray-500/10 border-gray-500/20';
    }
  };

  const getEffortImpactColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-red-500/20 text-red-300';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'low': return 'bg-green-500/20 text-green-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  const criticalIssues = results.filter(r => r.severity === 'critical').length;
  const highIssues = results.filter(r => r.severity === 'high').length;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[#fafafa] mb-2">Integration Analysis Complete</h2>
            <p className="text-gray-400">File: {fileName} • Analyzed: {analysisDate}</p>
          </div>
          <ExportButtons 
            title="Integration Error Analysis"
            data={results}
            filename={`integration-analysis-${new Date().toISOString().split('T')[0]}`}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-400" />
              <span className="text-red-400 font-medium">Critical</span>
            </div>
            <p className="text-2xl font-bold text-[#fafafa] mt-2">{criticalIssues}</p>
          </div>
          <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-orange-400" />
              <span className="text-orange-400 font-medium">High</span>
            </div>
            <p className="text-2xl font-bold text-[#fafafa] mt-2">{highIssues}</p>
          </div>
          <div className="bg-[#6d5cff]/10 border border-[#6d5cff]/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-[#6d5cff]" />
              <span className="text-[#6d5cff] font-medium">Total Issues</span>
            </div>
            <p className="text-2xl font-bold text-[#fafafa] mt-2">{results.length}</p>
          </div>
          <div className="bg-[#34d399]/10 border border-[#34d399]/20 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Zap className="h-5 w-5 text-[#34d399]" />
              <span className="text-[#34d399] font-medium">Quick Fixes</span>
            </div>
            <p className="text-2xl font-bold text-[#fafafa] mt-2">
              {results.filter(r => r.effort === 'low').length}
            </p>
          </div>
        </div>
      </div>

      {/* Impact/Effort Matrix */}
      <div className="bg-gray-800/50 rounded-lg p-6 border border-gray-700">
        <h3 className="text-lg font-semibold text-[#fafafa] mb-4">Priority Matrix</h3>
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="text-center text-gray-400 font-medium">Effort →</div>
          <div className="text-center text-gray-400 font-medium">Low</div>
          <div className="text-center text-gray-400 font-medium">Medium</div>
          <div className="text-center text-gray-400 font-medium">High</div>
          
          {['High', 'Medium', 'Low'].map(impact => (
            <>
              <div key={impact} className="text-gray-400 font-medium flex items-center">
                {impact === 'High' && '↑ Impact'}
                {impact === 'Medium' && ''}
                {impact === 'Low' && ''}
              </div>
              {['low', 'medium', 'high'].map(effort => {
                const count = results.filter(r => 
                  r.impact.toLowerCase() === impact.toLowerCase() && 
                  r.effort === effort
                ).length;
                const priority = impact === 'High' && effort === 'low' ? 'high' :
                               impact === 'High' && effort === 'medium' ? 'medium' :
                               impact === 'Medium' && effort === 'low' ? 'medium' : 'low';
                return (
                  <div key={`${impact}-${effort}`} 
                       className={`p-3 rounded border text-center font-medium ${
                         priority === 'high' ? 'bg-[#34d399]/20 border-[#34d399]/30 text-[#34d399]' :
                         priority === 'medium' ? 'bg-[#6d5cff]/20 border-[#6d5cff]/30 text-[#6d5cff]' :
                         'bg-gray-600/20 border-gray-600/30 text-gray-400'
                       }`}>
                    {count}
                  </div>
                );
              })}
            </>
          ))}
        </div>
      </div>

      {/* Issues List */}
      <div className="space-y-4">
        {results.map((result) => (
          <div key={result.id} className="bg-gray-800/50 rounded-lg border border-gray-700 overflow-hidden">
            <div 
              className="p-6 cursor-pointer hover:bg-gray-700/30 transition-colors"
              onClick={() => toggleExpanded(result.id)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {expandedItems.has(result.id) ? 
                      <ChevronDown className="h-5 w-5 text-gray-400" /> :
                      <ChevronRight className="h-5 w-5 text-gray-400" />
                    }
                    <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(result.severity)}`}>
                      {result.severity.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 rounded text-xs bg-gray-600/30 text-gray-300">
                      {result.category}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold text-[#fafafa] mb-2">{result.title}</h3>
                  <p className="text-gray-400 mb-3">{result.description}</p>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">{result.estimatedTime}</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${getEffortImpactColor(result.effort)}`}>
                      {result.effort} effort
                    </span>
                    <span className={`px-2 py-1 rounded text-xs ${getEffortImpactColor(result.impact)}`}>
                      {result.impact} impact
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {expandedItems.has(result.id) && (
              <div className="px-6 pb-6 border-t border-gray-700">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                  <div>
                    <h4 className="text-sm font-semibold text-[#fafafa] mb-2">Root Cause</h4>
                    <p className="text-gray-300 text-sm mb-4">{result.rootCause}</p>
                    
                    <h4 className="text-sm font-semibold text-[#fafafa] mb-2">Recommended Solution</h4>
                    <p className="text-gray-300 text-sm">{result.solution}</p>
                  </div>
                  
                  {result.codeSnippet && (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="text-sm font-semibold text-[#fafafa]">Code Fix</h4>
                        <button
                          onClick={() => copyToClipboard(result.codeSnippet!, result.id)}
                          className="flex items-center space-x-1 text-xs text-[#6d5cff] hover:text-[#a78bfa] transition-colors"
                        >
                          <Copy className="h-3 w-3" />
                          <span>{copiedItems.has(result.id) ? 'Copied!' : 'Copy'}</span>
                        </button>
                      </div>
                      <pre className="bg-gray-900 rounded p-3 text-xs text-gray-300 overflow-x-auto">
                        <code>{result.codeSnippet}</code>
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}