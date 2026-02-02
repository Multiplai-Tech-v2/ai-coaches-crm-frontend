import { useState } from 'react';
import { ArrowLeft, Mail, CheckCircle2, Eye, MessageSquare, Clock, User, Sparkles, ExternalLink } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import type { EmailSequence } from '@/app/data/mockData';

interface SequenceMonitorProps {
  sequence: EmailSequence;
  onBack: () => void;
}

export function SequenceMonitor({ sequence, onBack }: SequenceMonitorProps) {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [showAIModal, setShowAIModal] = useState(false);
  const [selectedRewriteEmail, setSelectedRewriteEmail] = useState<any>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Responded':
        return <MessageSquare className="w-4 h-4 text-purple-600" />;
      case 'Opened':
        return <Eye className="w-4 h-4 text-green-600" />;
      case 'Sent':
        return <CheckCircle2 className="w-4 h-4 text-blue-600" />;
      case 'Scheduled':
        return <Clock className="w-4 h-4 text-gray-400" />;
      default:
        return <Mail className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Responded':
        return 'bg-purple-100 text-purple-700';
      case 'Opened':
        return 'bg-green-100 text-green-700';
      case 'Sent':
        return 'bg-blue-100 text-blue-700';
      case 'Scheduled':
        return 'bg-gray-100 text-gray-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  // Find the contact who responded first
  const firstResponder = sequence.contacts.find(c => 
    c.emails.some(e => e.status === 'Responded')
  );

  const handleAIRewrite = (contact: any, email: any) => {
    setSelectedRewriteEmail({ contact, email });
    setShowAIModal(true);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <Button 
          variant="outline" 
          onClick={onBack}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Sequences
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Sequence Monitor</h1>
            <p className="text-gray-600">
              Real-time tracking for: <strong>{sequence.name}</strong> • {sequence.accountName}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className="bg-green-100 text-green-700 border-green-300 text-sm px-3 py-1">
              {sequence.status}
            </Badge>
          </div>
        </div>
      </div>

      {/* Cross-Contact Intelligence Alert */}
      {firstResponder && (
        <div className="mb-6 p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-amber-900 mb-1">
                Cross-Contact Intelligence Active
              </h3>
              <p className="text-sm text-amber-800 mb-2">
                <strong>{firstResponder.contactName}</strong> has responded to Email 1 in this sequence. 
                AI has detected this engagement and is suggesting contextual rewrites for pending emails to other contacts.
              </p>
              <div className="flex items-center gap-2">
                <Button 
                  size="sm"
                  className="bg-amber-600 hover:bg-amber-700"
                  onClick={() => {
                    // Find first AI suggested email
                    const aiEmail = sequence.contacts
                      .flatMap(c => c.emails.map(e => ({ contact: c, email: e })))
                      .find(({ email }) => email.aiRewriteSuggested);
                    if (aiEmail) {
                      handleAIRewrite(aiEmail.contact, aiEmail.email);
                    }
                  }}
                >
                  <Sparkles className="w-3 h-3 mr-1" />
                  Review AI Suggestions
                </Button>
                <span className="text-xs text-amber-700">
                  {sequence.contacts.reduce((acc, c) => 
                    acc + c.emails.filter(e => e.aiRewriteSuggested).length, 0
                  )} rewrites available
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Timeline View */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Email Sequence Timeline</h2>

        <div className="space-y-8">
          {sequence.contacts.map((contact) => (
            <div key={contact.contactId} className="relative">
              {/* Contact Header */}
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{contact.contactName}</h3>
                  <p className="text-sm text-gray-600">
                    {contact.emails.length} emails • {' '}
                    {contact.emails.filter(e => e.status === 'Responded').length > 0 ? (
                      <span className="text-purple-600 font-medium">Active conversation</span>
                    ) : contact.emails.filter(e => e.status === 'Opened').length > 0 ? (
                      <span className="text-green-600 font-medium">Engaged</span>
                    ) : (
                      <span className="text-gray-500">Pending</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Email Timeline */}
              <div className="ml-5 pl-8 border-l-2 border-gray-200 space-y-4">
                {contact.emails.map((email, idx) => (
                  <div key={email.id} className="relative">
                    {/* Timeline Dot */}
                    <div className={`absolute -left-[37px] w-4 h-4 rounded-full border-2 border-white ${
                      email.status === 'Responded' ? 'bg-purple-500' :
                      email.status === 'Opened' ? 'bg-green-500' :
                      email.status === 'Sent' ? 'bg-blue-500' :
                      'bg-gray-300'
                    }`} />

                    {/* Email Card */}
                    <div className={`p-4 rounded-lg border-2 ${
                      email.aiRewriteSuggested 
                        ? 'bg-amber-50 border-amber-300' 
                        : 'bg-white border-gray-200'
                    }`}>
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                            {email.sequenceNumber}
                          </div>
                          <h4 className="font-medium text-gray-900">{email.subject}</h4>
                        </div>
                        <div className="flex items-center gap-2">
                          {email.aiRewriteSuggested && (
                            <Badge className="bg-amber-500 text-white">
                              <Sparkles className="w-3 h-3 mr-1" />
                              AI Rewrite
                            </Badge>
                          )}
                          <Badge className={getStatusColor(email.status)}>
                            {getStatusIcon(email.status)}
                            <span className="ml-1">{email.status}</span>
                          </Badge>
                        </div>
                      </div>

                      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                        {email.body}
                      </p>

                      {/* Timeline */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                        {email.scheduledDate && (
                          <span>Scheduled: {new Date(email.scheduledDate).toLocaleDateString()}</span>
                        )}
                        {email.sentDate && (
                          <span className="text-blue-600">
                            Sent: {new Date(email.sentDate).toLocaleDateString()}
                          </span>
                        )}
                        {email.openedDate && (
                          <span className="text-green-600">
                            Opened: {new Date(email.openedDate).toLocaleDateString()}
                          </span>
                        )}
                        {email.respondedDate && (
                          <span className="text-purple-600 font-medium">
                            Responded: {new Date(email.respondedDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>

                      {/* AI Rewrite Suggestion */}
                      {email.aiRewriteSuggested && (
                        <div className="mt-3 p-3 bg-white border border-amber-300 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <p className="text-sm text-amber-900">
                              <strong>AI Suggestion:</strong> {email.rewriteReason}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              className="bg-amber-600 hover:bg-amber-700"
                              onClick={() => handleAIRewrite(contact, email)}
                            >
                              <Sparkles className="w-3 h-3 mr-1" />
                              Review Rewrite
                            </Button>
                            <Button size="sm" variant="outline">
                              Dismiss
                            </Button>
                          </div>
                        </div>
                      )}

                      {/* View Email Button */}
                      {email.status !== 'Scheduled' && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="mt-2"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          View Email
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AI Rewrite Modal */}
      {showAIModal && selectedRewriteEmail && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">AI-Powered Email Rewrite</h2>
                    <p className="text-sm text-gray-600">
                      For {selectedRewriteEmail.contact.contactName} • Email #{selectedRewriteEmail.email.sequenceNumber}
                    </p>
                  </div>
                </div>
                <Button variant="outline" onClick={() => setShowAIModal(false)}>
                  Close
                </Button>
              </div>
            </div>

            <div className="p-6">
              {/* Context Box */}
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">Why AI is suggesting this rewrite:</h3>
                <p className="text-sm text-blue-800">
                  {selectedRewriteEmail.email.rewriteReason}
                </p>
              </div>

              {/* Comparison View */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                {/* Original */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Original Email
                  </h3>
                  <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                    <div className="mb-3">
                      <label className="text-xs font-medium text-gray-600 block mb-1">Subject:</label>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedRewriteEmail.email.subject.replace(' - Jennifer mentioned our conversation', '')}
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Body:</label>
                      <div className="text-sm text-gray-700 whitespace-pre-wrap">
                        {selectedRewriteEmail.email.body.split('\n\n')[0]}
                      </div>
                    </div>
                  </div>
                </div>

                {/* AI Rewrite */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                    AI-Enhanced Version
                  </h3>
                  <div className="border-2 border-amber-300 rounded-lg p-4 bg-amber-50">
                    <div className="mb-3">
                      <label className="text-xs font-medium text-gray-600 block mb-1">Subject:</label>
                      <div className="text-sm font-medium text-gray-900">
                        {selectedRewriteEmail.email.subject}
                        <Badge className="ml-2 bg-green-100 text-green-700 text-xs">
                          Added context
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-medium text-gray-600 block mb-1">Body:</label>
                      <div className="text-sm text-gray-900 whitespace-pre-wrap">
                        {selectedRewriteEmail.email.body}
                        <div className="mt-2 p-2 bg-amber-100 rounded text-xs">
                          <strong>AI Enhancement:</strong> References active conversation with Jennifer Martinez
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* What Changed */}
              <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">✓ Key Improvements:</h3>
                <ul className="text-sm text-green-800 space-y-1 list-disc list-inside">
                  <li>Added reference to Jennifer Martinez's active engagement</li>
                  <li>Updated subject line to create urgency and social proof</li>
                  <li>Positioned {selectedRewriteEmail.contact.contactName} as part of team decision</li>
                  <li>Maintained personalization and professional tone</li>
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={() => setShowAIModal(false)}>
                  Cancel
                </Button>
                <div className="flex gap-2">
                  <Button variant="outline">
                    Customize Further
                  </Button>
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Apply AI Rewrite
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
