import { User, Mail, Eye, MessageSquare, Clock, ArrowRight, Zap } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import type { EmailSequence } from '@/app/data/mockData';

interface SequenceVisualizationProps {
  sequence: EmailSequence;
  onRewriteEmail: (emailId: string, contactName: string) => void;
}

export function SequenceVisualization({ sequence, onRewriteEmail }: SequenceVisualizationProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Responded':
        return 'bg-green-500';
      case 'Opened':
        return 'bg-blue-500';
      case 'Sent':
        return 'bg-purple-500';
      case 'Scheduled':
        return 'bg-gray-300';
      default:
        return 'bg-gray-200';
    }
  };

  // Calculate max steps
  const maxSteps = Math.max(...sequence.contacts.map(c => c.emails.length));

  return (
    <div className="space-y-6">
      {/* Horizontal Timeline View */}
      <Card>
        <CardContent className="p-6">
          <div className="overflow-x-auto">
            <div className="inline-flex flex-col gap-4 min-w-max">
              {/* Header Row - Email Steps */}
              <div className="flex gap-4">
                <div className="w-48 flex-shrink-0" /> {/* Spacer for contact names */}
                {Array.from({ length: maxSteps }).map((_, idx) => (
                  <div key={idx} className="w-64 text-center">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <p className="font-semibold text-sm text-gray-900">Email {idx + 1}</p>
                      <p className="text-xs text-gray-500">Step {idx + 1}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact Rows */}
              {sequence.contacts.map((contact) => (
                <div key={contact.contactId} className="flex gap-4 items-center">
                  {/* Contact Info */}
                  <div className="w-48 flex-shrink-0">
                    <div className="flex items-center gap-2 p-2 border border-gray-200 rounded-lg bg-white">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm text-gray-900 truncate">
                          {contact.contactName.split('(')[0].trim()}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {contact.contactName.includes('(') ? contact.contactName.match(/\((.*?)\)/)?.[1] : ''}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Email Cards */}
                  {contact.emails.map((email, idx) => (
                    <div key={email.id} className="w-64 relative">
                      {/* Connector Arrow */}
                      {idx < contact.emails.length - 1 && (
                        <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2 z-10">
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </div>
                      )}

                      <div className={`p-3 rounded-lg border-2 transition-all ${
                        email.status === 'Responded' ? 'border-green-300 bg-green-50' :
                        email.status === 'Opened' ? 'border-blue-300 bg-blue-50' :
                        email.status === 'Sent' ? 'border-purple-300 bg-purple-50' :
                        'border-gray-200 bg-white'
                      }`}>
                        <div className="flex items-center justify-between mb-2">
                          <Badge className={`text-xs ${
                            email.status === 'Responded' ? 'bg-green-100 text-green-700 border-green-300' :
                            email.status === 'Opened' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                            email.status === 'Sent' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                            'bg-gray-100 text-gray-700 border-gray-300'
                          }`}>
                            {email.status === 'Responded' && <MessageSquare className="w-3 h-3 mr-1" />}
                            {email.status === 'Opened' && <Eye className="w-3 h-3 mr-1" />}
                            {email.status === 'Sent' && <Mail className="w-3 h-3 mr-1" />}
                            {email.status === 'Scheduled' && <Clock className="w-3 h-3 mr-1" />}
                            {email.status}
                          </Badge>
                          {email.aiRewriteSuggested && (
                            <Zap className="w-4 h-4 text-amber-500 animate-pulse" />
                          )}
                        </div>
                        
                        <p className="text-xs font-semibold text-gray-900 mb-1 line-clamp-1">
                          {email.subject}
                        </p>
                        
                        <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                          {email.body.substring(0, 80)}...
                        </p>

                        {/* Dates */}
                        <div className="space-y-1 text-xs text-gray-500">
                          {email.sentDate && (
                            <div className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              Sent: {email.sentDate}
                            </div>
                          )}
                          {email.openedDate && (
                            <div className="flex items-center gap-1 text-blue-600">
                              <Eye className="w-3 h-3" />
                              Opened: {email.openedDate}
                            </div>
                          )}
                          {email.respondedDate && (
                            <div className="flex items-center gap-1 text-green-600 font-medium">
                              <MessageSquare className="w-3 h-3" />
                              Responded: {email.respondedDate}
                            </div>
                          )}
                        </div>

                        {/* AI Rewrite Button */}
                        {email.aiRewriteSuggested && (
                          <Button 
                            size="sm" 
                            variant="outline" 
                            className="w-full mt-2 border-amber-300 text-amber-700 hover:bg-amber-50 text-xs"
                            onClick={() => onRewriteEmail(email.id, contact.contactName)}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            View AI Suggestion
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Fill empty slots */}
                  {Array.from({ length: maxSteps - contact.emails.length }).map((_, idx) => (
                    <div key={`empty-${idx}`} className="w-64 h-32" />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm font-semibold text-gray-700 mb-3">Status Legend</p>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="text-xs text-gray-600">Responded (actively engaged)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500" />
                <span className="text-xs text-gray-600">Opened (read but no reply)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-xs text-gray-600">Sent (awaiting open)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-gray-300" />
                <span className="text-xs text-gray-600">Scheduled (not sent yet)</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="w-3 h-3 text-amber-500" />
                <span className="text-xs text-gray-600">AI rewrite suggested</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Engagement Insights */}
      <Card>
        <CardContent className="p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Multi-Threading Insights</h3>
          
          <div className="space-y-3">
            {/* Show who has responded */}
            {sequence.contacts.filter(c => c.emails.some(e => e.status === 'Responded')).map((contact) => {
              const respondedEmail = contact.emails.find(e => e.status === 'Responded');
              const otherContacts = sequence.contacts.filter(c => c.contactId !== contact.contactId);
              const needsRewrite = otherContacts.some(oc => 
                oc.emails.some(e => e.aiRewriteSuggested)
              );

              return (
                <div key={contact.contactId} className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-start gap-3">
                    <MessageSquare className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-semibold text-green-900 text-sm">
                        {contact.contactName} responded to Email {respondedEmail?.sequenceNumber}
                      </p>
                      <p className="text-xs text-green-700 mt-1">
                        Responded on {respondedEmail?.respondedDate}
                      </p>
                      
                      {needsRewrite && (
                        <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                          <p className="text-xs text-amber-900">
                            <strong>AI Recommendation:</strong> Update emails to {otherContacts.length} other contact{otherContacts.length > 1 ? 's' : ''} to mention this active engagement
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
