import { useState } from 'react';
import { Mail, Send, Eye, MessageSquare, Clock, Play, Pause, AlertCircle, Sparkles, User, Calendar, Check, ArrowRight, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/app/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/app/components/ui/dialog';
import { Label } from '@/app/components/ui/label';
import { Textarea } from '@/app/components/ui/textarea';
import { mockEmailSequences, type EmailSequence, type EmailSequenceContact, type SequenceEmail } from '@/app/data/mockData';
import { EmailSequenceBuilder } from '@/app/components/EmailSequenceBuilder';
import { SequenceVisualization } from '@/app/components/SequenceVisualization';

export function EmailSequences() {
  const [sequences, setSequences] = useState<EmailSequence[]>(mockEmailSequences);
  const [selectedSequence, setSelectedSequence] = useState<EmailSequence | null>(sequences[0] || null);
  const [aiRewriteEmail, setAiRewriteEmail] = useState<{email: SequenceEmail, contactName: string} | null>(null);
  const [rewrittenContent, setRewrittenContent] = useState('');
  const [showBuilder, setShowBuilder] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Responded':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Opened':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Sent':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Scheduled':
        return 'bg-gray-100 text-gray-700 border-gray-300';
      case 'Bounced':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Responded':
        return <MessageSquare className="w-3 h-3" />;
      case 'Opened':
        return <Eye className="w-3 h-3" />;
      case 'Sent':
        return <Send className="w-3 h-3" />;
      case 'Scheduled':
        return <Clock className="w-3 h-3" />;
      default:
        return <Mail className="w-3 h-3" />;
    }
  };

  const handleAIRewrite = (email: SequenceEmail, contactName: string) => {
    setAiRewriteEmail({ email, contactName });
    
    // Simulate AI rewrite based on context
    const rewriteSuggestion = `Hi ${contactName.split(' ')[0]},\n\nI wanted to follow up on our AI architecture discussion.\n\nGreat news - Jennifer Martinez, your CEO, has already expressed strong interest in TechVenture's AI transformation initiative! She's excited about the potential for 40% operational efficiency improvements.\n\nGiven her enthusiasm and strategic support, I thought it would be valuable to align on the technical implementation approach that will bring this vision to life.\n\nWould you be available for a brief technical discussion next week to explore how we can build on this executive momentum?\n\nBest regards,\nSarah`;
    
    setRewrittenContent(rewriteSuggestion);
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Email Sequences</h1>
        <p className="text-gray-500 mt-2">Manage multi-contact email campaigns with AI-powered insights</p>
      </div>

      <Tabs defaultValue="active" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="active">Active Sequences</TabsTrigger>
            <TabsTrigger value="all">All Sequences</TabsTrigger>
            <TabsTrigger value="builder">New Sequence</TabsTrigger>
          </TabsList>
          <Button>
            <Play className="w-4 h-4 mr-2" />
            Create Sequence
          </Button>
        </div>

        {/* Active Sequences */}
        <TabsContent value="active" className="space-y-6">
          {sequences.filter(s => s.status === 'Active').map((sequence) => (
            <Card key={sequence.id} className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => setSelectedSequence(sequence)}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{sequence.name}</CardTitle>
                    <CardDescription className="mt-2">
                      {sequence.accountName} • {sequence.contacts.length} contacts • Created {sequence.createdDate}
                    </CardDescription>
                  </div>
                  <Badge className="bg-green-100 text-green-700 border-green-300">
                    <Play className="w-3 h-3 mr-1" />
                    {sequence.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Progress Summary */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <MessageSquare className="w-4 h-4 text-green-600" />
                        <span className="text-xs text-green-600 font-medium">Responded</span>
                      </div>
                      <p className="text-2xl font-bold text-green-700">
                        {sequence.contacts.reduce((acc, c) => acc + c.emails.filter(e => e.status === 'Responded').length, 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-blue-600" />
                        <span className="text-xs text-blue-600 font-medium">Opened</span>
                      </div>
                      <p className="text-2xl font-bold text-blue-700">
                        {sequence.contacts.reduce((acc, c) => acc + c.emails.filter(e => e.status === 'Opened').length, 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Send className="w-4 h-4 text-purple-600" />
                        <span className="text-xs text-purple-600 font-medium">Sent</span>
                      </div>
                      <p className="text-2xl font-bold text-purple-700">
                        {sequence.contacts.reduce((acc, c) => acc + c.emails.filter(e => e.status === 'Sent').length, 0)}
                      </p>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="w-4 h-4 text-gray-600" />
                        <span className="text-xs text-gray-600 font-medium">Scheduled</span>
                      </div>
                      <p className="text-2xl font-bold text-gray-700">
                        {sequence.contacts.reduce((acc, c) => acc + c.emails.filter(e => e.status === 'Scheduled').length, 0)}
                      </p>
                    </div>
                  </div>

                  {/* AI Rewrite Alerts */}
                  {sequence.contacts.some(c => c.emails.some(e => e.aiRewriteSuggested)) && (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-start gap-3">
                        <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <p className="font-semibold text-amber-900 text-sm">AI Rewrite Suggested</p>
                          <p className="text-xs text-amber-700 mt-1">
                            {sequence.contacts.reduce((acc, c) => acc + c.emails.filter(e => e.aiRewriteSuggested).length, 0)} emails can be improved based on recent contact engagement
                          </p>
                        </div>
                        <Button size="sm" variant="outline" className="border-amber-300 text-amber-700 hover:bg-amber-100">
                          Review Suggestions
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Detailed Sequence View */}
          {selectedSequence && (
            <SequenceVisualization 
              sequence={selectedSequence} 
              onRewriteEmail={(emailId, contactName) => {
                const email = selectedSequence.contacts
                  .flatMap(c => c.emails)
                  .find(e => e.id === emailId);
                if (email) {
                  handleAIRewrite(email, contactName);
                }
              }}
            />
          )}
        </TabsContent>

        {/* All Sequences */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <CardTitle>All Email Sequences</CardTitle>
              <CardDescription>View and manage all your email sequences</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12 text-gray-500">
                <Mail className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No additional sequences yet</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* New Sequence Builder */}
        <TabsContent value="builder">
          <EmailSequenceBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}