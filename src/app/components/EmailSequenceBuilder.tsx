import { useState } from 'react';
import { Plus, Trash2, GripVertical, Sparkles, Calendar, User, Mail } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { Badge } from '@/app/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/app/components/ui/select';
import { mockContacts } from '@/app/data/mockData';

interface EmailStep {
  id: string;
  sequenceNumber: number;
  subject: string;
  body: string;
  delayDays: number;
}

interface SequenceContact {
  id: string;
  name: string;
  title: string;
  email: string;
}

export function EmailSequenceBuilder() {
  const [sequenceName, setSequenceName] = useState('');
  const [selectedAccount, setSelectedAccount] = useState('acc-1');
  const [selectedContacts, setSelectedContacts] = useState<SequenceContact[]>([
    {
      id: 'con-1',
      name: 'Jennifer Martinez',
      title: 'CEO',
      email: 'j.martinez@techventure.com'
    },
    {
      id: 'con-2',
      name: 'Robert Kim',
      title: 'CTO',
      email: 'r.kim@techventure.com'
    },
    {
      id: 'con-3',
      name: 'Amanda Thompson',
      title: 'VP of Operations',
      email: 'a.thompson@techventure.com'
    }
  ]);
  
  const [emailSteps, setEmailSteps] = useState<EmailStep[]>([
    {
      id: 'step-1',
      sequenceNumber: 1,
      subject: 'Introduction Email',
      body: 'Hi {{firstName}},\n\nI hope this email finds you well...',
      delayDays: 0
    },
    {
      id: 'step-2',
      sequenceNumber: 2,
      subject: 'Follow-up with Value Proposition',
      body: 'Hi {{firstName}},\n\nFollowing up on my previous email...',
      delayDays: 3
    },
    {
      id: 'step-3',
      sequenceNumber: 3,
      subject: 'Case Study Share',
      body: 'Hi {{firstName}},\n\nI wanted to share a relevant case study...',
      delayDays: 5
    }
  ]);

  const addEmailStep = () => {
    const newStep: EmailStep = {
      id: `step-${Date.now()}`,
      sequenceNumber: emailSteps.length + 1,
      subject: `Email ${emailSteps.length + 1} Subject`,
      body: 'Hi {{firstName}},\n\n...',
      delayDays: 3
    };
    setEmailSteps([...emailSteps, newStep]);
  };

  const removeEmailStep = (id: string) => {
    setEmailSteps(emailSteps.filter(s => s.id !== id));
  };

  const updateEmailStep = (id: string, field: keyof EmailStep, value: any) => {
    setEmailSteps(emailSteps.map(s => 
      s.id === id ? { ...s, [field]: value } : s
    ));
  };

  return (
    <div className="space-y-6">
      {/* Sequence Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Sequence Configuration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Sequence Name</Label>
              <Input 
                value={sequenceName} 
                onChange={(e) => setSequenceName(e.target.value)}
                placeholder="e.g., Executive Outreach Q1 2026"
              />
            </div>
            <div>
              <Label>Target Account</Label>
              <Select value={selectedAccount} onValueChange={setSelectedAccount}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="acc-1">TechVenture Corp</SelectItem>
                  <SelectItem value="acc-2">Global Finance Ltd</SelectItem>
                  <SelectItem value="acc-3">Healthcare Innovations Inc</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Selected Contacts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Target Contacts ({selectedContacts.length})</CardTitle>
            <Button size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Add Contact
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-3">
            {selectedContacts.map((contact) => (
              <div key={contact.id} className="p-3 border border-gray-200 rounded-lg bg-white">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{contact.name}</p>
                      <p className="text-xs text-gray-500">{contact.title}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                    <Trash2 className="w-3 h-3 text-gray-400" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Email Steps Builder */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Email Sequence Steps</CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Each contact will receive all {emailSteps.length} emails with the specified delays
              </p>
            </div>
            <Button onClick={addEmailStep} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Email
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emailSteps.map((step, index) => (
              <div key={step.id} className="border-2 border-gray-200 rounded-lg p-4 bg-white hover:border-blue-300 transition-colors">
                <div className="flex items-start gap-4">
                  {/* Drag Handle */}
                  <div className="pt-2 cursor-move">
                    <GripVertical className="w-5 h-5 text-gray-400" />
                  </div>

                  {/* Step Number */}
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-bold text-blue-700">{step.sequenceNumber}</span>
                    </div>
                  </div>

                  {/* Email Content */}
                  <div className="flex-1 space-y-3">
                    <div className="grid grid-cols-3 gap-3">
                      <div className="col-span-2">
                        <Label className="text-xs">Email Subject</Label>
                        <Input 
                          value={step.subject}
                          onChange={(e) => updateEmailStep(step.id, 'subject', e.target.value)}
                          placeholder="Email subject line"
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Delay (days)</Label>
                        <Input 
                          type="number"
                          value={step.delayDays}
                          onChange={(e) => updateEmailStep(step.id, 'delayDays', parseInt(e.target.value))}
                          placeholder="0"
                          className="mt-1"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-xs">Email Body</Label>
                      <Textarea 
                        value={step.body}
                        onChange={(e) => updateEmailStep(step.id, 'body', e.target.value)}
                        placeholder="Email content..."
                        rows={5}
                        className="mt-1 font-sans"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        Use variables: {'{'}{'firstName}'}, {'{'}{'lastName}'}, {'{'}{'title}'}, {'{'}{'company}'}
                      </p>
                    </div>

                    {/* AI Assist */}
                    <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                      <Button variant="outline" size="sm">
                        <Sparkles className="w-3 h-3 mr-2" />
                        AI Improve
                      </Button>
                      {index > 0 && (
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => removeEmailStep(step.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Visual Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Sequence Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <div className="inline-flex gap-4 min-w-max pb-4">
              {selectedContacts.map((contact, contactIdx) => (
                <div key={contact.id} className="w-72 space-y-3">
                  {/* Contact Header */}
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-700" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-blue-900">{contact.name}</p>
                        <p className="text-xs text-blue-600">{contact.title}</p>
                      </div>
                    </div>
                  </div>

                  {/* Email Steps for this contact */}
                  {emailSteps.map((step, stepIdx) => (
                    <div key={step.id} className="relative">
                      {stepIdx > 0 && (
                        <div className="absolute left-4 -top-3 w-px h-3 bg-gray-300" />
                      )}
                      <div className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-700">{step.sequenceNumber}</span>
                          </div>
                          <Badge className="bg-gray-100 text-gray-700 text-xs">
                            <Calendar className="w-3 h-3 mr-1" />
                            Day {step.delayDays}
                          </Badge>
                        </div>
                        <p className="text-xs font-semibold text-gray-900 mb-1">{step.subject}</p>
                        <p className="text-xs text-gray-600 line-clamp-2">
                          {step.body.replace(/\{\{firstName\}\}/, contact.name.split(' ')[0])}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline">Save as Draft</Button>
        <Button variant="outline">
          <Sparkles className="w-4 h-4 mr-2" />
          AI Optimize Sequence
        </Button>
        <Button className="bg-green-600 hover:bg-green-700">
          <Mail className="w-4 h-4 mr-2" />
          Activate Sequence
        </Button>
      </div>
    </div>
  );
}
