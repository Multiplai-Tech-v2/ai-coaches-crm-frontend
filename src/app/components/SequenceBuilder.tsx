import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Mail, Plus, Trash2, Users, Calendar, Copy, Eye, User } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { EmailTemplateEditor } from '@/app/components/EmailTemplateEditor';
import type { EmailSequence } from '@/app/data/mockData';

interface SequenceBuilderProps {
  sequence: EmailSequence;
  onBack: () => void;
}

export function SequenceBuilder({ sequence, onBack }: SequenceBuilderProps) {
  const [selectedContact, setSelectedContact] = useState(sequence.contacts[0]);
  const [selectedEmail, setSelectedEmail] = useState(selectedContact.emails[0]);
  const [editedSubject, setEditedSubject] = useState(selectedEmail.subject);
  const [editedBody, setEditedBody] = useState(selectedEmail.body);

  // Update edited content when selected email changes
  useEffect(() => {
    setEditedSubject(selectedEmail.subject);
    setEditedBody(selectedEmail.body);
  }, [selectedEmail]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Responded':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Opened':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Sent':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Scheduled':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Bounced':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{sequence.name}</h1>
            <p className="text-gray-600">
              {sequence.accountName} • {sequence.contacts.length} contacts • {' '}
              {sequence.contacts.reduce((acc, c) => acc + c.emails.length, 0)} total emails
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        {/* Contact List */}
        <div className="col-span-3 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">Contacts ({sequence.contacts.length})</h3>
            <Users className="w-4 h-4 text-gray-500" />
          </div>
          <div className="space-y-2">
            {sequence.contacts.map((contact) => {
              const respondedCount = contact.emails.filter(e => e.status === 'Responded').length;
              const openedCount = contact.emails.filter(e => e.status === 'Opened').length;
              const sentCount = contact.emails.filter(e => e.status === 'Sent').length;

              return (
                <button
                  key={contact.contactId}
                  onClick={() => {
                    setSelectedContact(contact);
                    setSelectedEmail(contact.emails[0]);
                  }}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedContact.contactId === contact.contactId
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 truncate">
                        {contact.contactName}
                      </div>
                      <div className="text-xs text-gray-600 mt-1">
                        {contact.emails.length} emails
                      </div>
                      <div className="flex items-center gap-1 mt-2">
                        {respondedCount > 0 && (
                          <span className="text-xs bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded">
                            {respondedCount} replied
                          </span>
                        )}
                        {openedCount > 0 && (
                          <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded">
                            {openedCount} opened
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Email Sequence Timeline */}
        <div className="col-span-4 bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Email Sequence for {selectedContact.contactName}
            </h3>
            <Button variant="outline" size="sm">
              <Plus className="w-3 h-3 mr-1" />
              Add Email
            </Button>
          </div>

          <div className="space-y-3">
            {selectedContact.emails.map((email, index) => (
              <div key={email.id}>
                <button
                  onClick={() => setSelectedEmail(email)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedEmail.id === email.id
                      ? 'bg-blue-50 border-blue-300'
                      : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {email.sequenceNumber}
                      </div>
                      <Mail className="w-4 h-4 text-gray-500" />
                    </div>
                    <Badge className={getStatusColor(email.status)}>
                      {email.status}
                    </Badge>
                  </div>

                  <div className="text-sm font-medium text-gray-900 mb-1 truncate">
                    {email.subject}
                  </div>
                  
                  {email.scheduledDate && (
                    <div className="flex items-center gap-1 text-xs text-gray-600 mt-2">
                      <Calendar className="w-3 h-3" />
                      {email.sentDate 
                        ? `Sent ${new Date(email.sentDate).toLocaleDateString()}`
                        : `Scheduled ${new Date(email.scheduledDate).toLocaleDateString()}`
                      }
                    </div>
                  )}

                  {email.aiRewriteSuggested && (
                    <div className="mt-2 p-2 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800">
                      <strong>AI Rewrite Available:</strong> {email.rewriteReason}
                    </div>
                  )}
                </button>

                {/* Connector Line */}
                {index < selectedContact.emails.length - 1 && (
                  <div className="flex justify-center my-1">
                    <div className="w-0.5 h-4 bg-gray-300"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Email Editor */}
        <div className="col-span-5 bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-semibold text-gray-900">
              Email #{selectedEmail.sequenceNumber}
            </h3>
            <div className="flex items-center gap-2">
              {selectedEmail.aiRewriteSuggested && (
                <Button className="bg-amber-500 hover:bg-amber-600">
                  <span className="mr-2">✨</span>
                  Apply AI Rewrite
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Copy className="w-3 h-3 mr-1" />
                Duplicate
              </Button>
              <Button variant="outline" size="sm">
                <Eye className="w-3 h-3 mr-1" />
                Preview
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {/* Enhanced Email Template Editor */}
            <EmailTemplateEditor
              subject={editedSubject}
              body={editedBody}
              onSubjectChange={setEditedSubject}
              onBodyChange={setEditedBody}
              contactName={selectedContact.contactName}
              accountName={sequence.accountName}
            />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Scheduled Date
                </label>
                <input
                  type="date"
                  value={selectedEmail.scheduledDate || ''}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  readOnly
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={selectedEmail.status}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled
                >
                  <option>Scheduled</option>
                  <option>Sent</option>
                  <option>Opened</option>
                  <option>Responded</option>
                  <option>Bounced</option>
                </select>
              </div>
            </div>

            {selectedEmail.aiRewriteSuggested && (
              <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-semibold text-amber-900 mb-2 flex items-center gap-2">
                  <span>✨</span> AI-Suggested Rewrite
                </h4>
                <p className="text-sm text-amber-800 mb-3">
                  {selectedEmail.rewriteReason}
                </p>
                <div className="bg-white p-3 rounded border border-amber-300 text-sm">
                  <strong>Suggested Subject:</strong> {selectedEmail.subject}
                  <div className="mt-2 text-gray-700 whitespace-pre-wrap">
                    {selectedEmail.body}
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button className="bg-amber-600 hover:bg-amber-700">
                    Accept Rewrite
                  </Button>
                  <Button variant="outline">
                    Customize
                  </Button>
                  <Button variant="outline">
                    Dismiss
                  </Button>
                </div>
              </div>
            )}

            {selectedEmail.openedDate && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm">
                <strong className="text-green-900">Email Activity:</strong>
                <div className="text-green-800 mt-1">
                  Opened: {new Date(selectedEmail.openedDate).toLocaleString()}
                  {selectedEmail.respondedDate && (
                    <div>Responded: {new Date(selectedEmail.respondedDate).toLocaleString()}</div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <Button variant="outline" className="w-full text-red-600 hover:text-red-700 hover:bg-red-50">
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Email
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}