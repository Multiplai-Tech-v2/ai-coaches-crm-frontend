import { useState } from 'react';
import { Mail, Plus, Play, Pause, CheckCircle2, AlertCircle, Calendar, Users, Sparkles, Eye, MessageSquare } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { mockEmailSequences, mockContacts } from '@/app/data/mockData';
import { SequenceBuilder } from '@/app/components/SequenceBuilder';
import { SequenceMonitor } from '@/app/components/SequenceMonitor';

type View = 'list' | 'builder' | 'monitor';

export function EmailSequences() {
  const [view, setView] = useState<View>('list');
  const [selectedSequenceId, setSelectedSequenceId] = useState<string | null>(null);

  const selectedSequence = selectedSequenceId 
    ? mockEmailSequences.find(seq => seq.id === selectedSequenceId)
    : null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Draft':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Paused':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Completed':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getSequenceStats = (sequence: any) => {
    let totalEmails = 0;
    let sent = 0;
    let opened = 0;
    let responded = 0;
    let scheduled = 0;

    sequence.contacts.forEach((contact: any) => {
      contact.emails.forEach((email: any) => {
        totalEmails++;
        if (email.status === 'Sent' || email.status === 'Opened' || email.status === 'Responded') sent++;
        if (email.status === 'Opened' || email.status === 'Responded') opened++;
        if (email.status === 'Responded') responded++;
        if (email.status === 'Scheduled') scheduled++;
      });
    });

    return { totalEmails, sent, opened, responded, scheduled };
  };

  if (view === 'builder' && selectedSequence) {
    return (
      <SequenceBuilder 
        sequence={selectedSequence}
        onBack={() => {
          setView('list');
          setSelectedSequenceId(null);
        }}
      />
    );
  }

  if (view === 'monitor' && selectedSequence) {
    return (
      <SequenceMonitor 
        sequence={selectedSequence}
        onBack={() => {
          setView('list');
          setSelectedSequenceId(null);
        }}
      />
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Email Sequences</h1>
          <p className="text-gray-600">
            Create multi-contact email sequences with AI-powered contextual rewriting
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          New Sequence
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Active Sequences</span>
            <Play className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {mockEmailSequences.filter(s => s.status === 'Active').length}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Total Contacts</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {mockEmailSequences.reduce((acc, seq) => acc + seq.contacts.length, 0)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Emails Sent</span>
            <Mail className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {mockEmailSequences.reduce((acc, seq) => {
              const stats = getSequenceStats(seq);
              return acc + stats.sent;
            }, 0)}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">AI Rewrites Suggested</span>
            <Sparkles className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {mockEmailSequences.reduce((acc, seq) => {
              return acc + seq.contacts.reduce((cacc, c) => {
                return cacc + c.emails.filter(e => e.aiRewriteSuggested).length;
              }, 0);
            }, 0)}
          </div>
        </div>
      </div>

      {/* Sequences List */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">All Sequences</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {mockEmailSequences.map((sequence) => {
            const stats = getSequenceStats(sequence);
            const aiSuggestions = sequence.contacts.reduce((acc, c) => {
              return acc + c.emails.filter(e => e.aiRewriteSuggested).length;
            }, 0);

            return (
              <div 
                key={sequence.id}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{sequence.name}</h3>
                      <Badge className={getStatusColor(sequence.status)}>
                        {sequence.status}
                      </Badge>
                      {aiSuggestions > 0 && (
                        <Badge className="bg-amber-100 text-amber-700 border-amber-300">
                          <Sparkles className="w-3 h-3 mr-1" />
                          {aiSuggestions} AI Rewrites Available
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="w-4 h-4" />
                        {sequence.contacts.length} contacts
                      </span>
                      <span className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        {stats.totalEmails} emails
                      </span>
                      {sequence.startDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          Started {new Date(sequence.startDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {sequence.accountName} • Created by {sequence.createdBy}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline"
                      onClick={() => {
                        setSelectedSequenceId(sequence.id);
                        setView('builder');
                      }}
                    >
                      Edit Sequence
                    </Button>
                    <Button 
                      className="bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        setSelectedSequenceId(sequence.id);
                        setView('monitor');
                      }}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      Monitor
                    </Button>
                  </div>
                </div>

                {/* Progress Stats */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <div className="text-xs text-gray-600 mb-1">Scheduled</div>
                    <div className="text-lg font-semibold text-gray-900">{stats.scheduled}</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="text-xs text-blue-600 mb-1">Sent</div>
                    <div className="text-lg font-semibold text-blue-900">{stats.sent}</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <div className="text-xs text-green-600 mb-1">Opened</div>
                    <div className="text-lg font-semibold text-green-900">{stats.opened}</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="text-xs text-purple-600 mb-1">Responded</div>
                    <div className="text-lg font-semibold text-purple-900">{stats.responded}</div>
                  </div>
                </div>

                {/* Account Context Indicator */}
                {sequence.accountName === 'TechVenture Corp' && (
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-800">
                      <strong>Cross-contact intelligence active:</strong> Jennifer Martinez responded to Email 1. 
                      AI has suggested rewrites for Robert Kim and Amanda Thompson's emails to reference this conversation.
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
