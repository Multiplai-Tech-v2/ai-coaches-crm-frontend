import { useState, useRef, useEffect } from 'react';
import { Code2, Sparkles, Eye, User, Building2, Mail, Calendar, Briefcase, MapPin, Phone, Globe, ChevronDown, Plus, X } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Badge } from '@/app/components/ui/badge';
import { Label } from '@/app/components/ui/label';
import { Input } from '@/app/components/ui/input';
import { Textarea } from '@/app/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/app/components/ui/dialog';

interface EmailTemplateEditorProps {
  subject: string;
  body: string;
  onSubjectChange: (value: string) => void;
  onBodyChange: (value: string) => void;
  contactName?: string;
  accountName?: string;
}

interface Variable {
  id: string;
  label: string;
  syntax: string;
  category: 'contact' | 'account' | 'user' | 'custom' | 'date';
  icon: any;
  example: string;
}

const VARIABLES: Variable[] = [
  // Contact Variables
  { id: 'firstName', label: 'First Name', syntax: '{{firstName}}', category: 'contact', icon: User, example: 'Jennifer' },
  { id: 'lastName', label: 'Last Name', syntax: '{{lastName}}', category: 'contact', icon: User, example: 'Martinez' },
  { id: 'fullName', label: 'Full Name', syntax: '{{fullName}}', category: 'contact', icon: User, example: 'Jennifer Martinez' },
  { id: 'title', label: 'Job Title', syntax: '{{title}}', category: 'contact', icon: Briefcase, example: 'CEO' },
  { id: 'email', label: 'Email Address', syntax: '{{email}}', category: 'contact', icon: Mail, example: 'j.martinez@techventure.com' },
  { id: 'phone', label: 'Phone Number', syntax: '{{phone}}', category: 'contact', icon: Phone, example: '+1 (555) 123-4567' },
  { id: 'department', label: 'Department', syntax: '{{department}}', category: 'contact', icon: Briefcase, example: 'Executive' },
  
  // Account Variables
  { id: 'companyName', label: 'Company Name', syntax: '{{companyName}}', category: 'account', icon: Building2, example: 'TechVenture Corp' },
  { id: 'companyIndustry', label: 'Industry', syntax: '{{companyIndustry}}', category: 'account', icon: Building2, example: 'Technology' },
  { id: 'companySize', label: 'Company Size', syntax: '{{companySize}}', category: 'account', icon: Building2, example: '500-1000 employees' },
  { id: 'companyWebsite', label: 'Website', syntax: '{{companyWebsite}}', category: 'account', icon: Globe, example: 'techventure.com' },
  { id: 'companyLocation', label: 'Location', syntax: '{{companyLocation}}', category: 'account', icon: MapPin, example: 'San Francisco, CA' },
  
  // User Variables (Sender)
  { id: 'myFirstName', label: 'My First Name', syntax: '{{myFirstName}}', category: 'user', icon: User, example: 'Sarah' },
  { id: 'myLastName', label: 'My Last Name', syntax: '{{myLastName}}', category: 'user', icon: User, example: 'Johnson' },
  { id: 'myTitle', label: 'My Title', syntax: '{{myTitle}}', category: 'user', icon: Briefcase, example: 'Senior Account Executive' },
  { id: 'myEmail', label: 'My Email', syntax: '{{myEmail}}', category: 'user', icon: Mail, example: 'sarah.johnson@aicoaches.com' },
  { id: 'myPhone', label: 'My Phone', syntax: '{{myPhone}}', category: 'user', icon: Phone, example: '+1 (555) 987-6543' },
  
  // Date Variables
  { id: 'today', label: 'Today\'s Date', syntax: '{{today}}', category: 'date', icon: Calendar, example: 'January 22, 2026' },
  { id: 'todayShort', label: 'Today (Short)', syntax: '{{todayShort}}', category: 'date', icon: Calendar, example: '01/22/26' },
  { id: 'currentYear', label: 'Current Year', syntax: '{{currentYear}}', category: 'date', icon: Calendar, example: '2026' },
  { id: 'currentMonth', label: 'Current Month', syntax: '{{currentMonth}}', category: 'date', icon: Calendar, example: 'January' },
];

export function EmailTemplateEditor({ 
  subject, 
  body, 
  onSubjectChange, 
  onBodyChange,
  contactName = 'Jennifer Martinez',
  accountName = 'TechVenture Corp'
}: EmailTemplateEditorProps) {
  const [showVariables, setShowVariables] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [cursorPosition, setCursorPosition] = useState<number>(0);
  const [activeField, setActiveField] = useState<'subject' | 'body'>('body');
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const subjectRef = useRef<HTMLInputElement>(null);

  const categories = [
    { id: 'all', label: 'All Variables', count: VARIABLES.length },
    { id: 'contact', label: 'Contact', count: VARIABLES.filter(v => v.category === 'contact').length },
    { id: 'account', label: 'Account', count: VARIABLES.filter(v => v.category === 'account').length },
    { id: 'user', label: 'Sender', count: VARIABLES.filter(v => v.category === 'user').length },
    { id: 'date', label: 'Date/Time', count: VARIABLES.filter(v => v.category === 'date').length },
  ];

  const filteredVariables = VARIABLES.filter(v => {
    const matchesCategory = selectedCategory === 'all' || v.category === selectedCategory;
    const matchesSearch = v.label.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         v.syntax.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const insertVariable = (variable: Variable) => {
    if (activeField === 'subject') {
      const ref = subjectRef.current;
      if (ref) {
        const start = ref.selectionStart || 0;
        const end = ref.selectionEnd || 0;
        const newValue = subject.substring(0, start) + variable.syntax + subject.substring(end);
        onSubjectChange(newValue);
        
        // Set cursor position after the inserted variable
        setTimeout(() => {
          ref.focus();
          ref.setSelectionRange(start + variable.syntax.length, start + variable.syntax.length);
        }, 0);
      }
    } else {
      const ref = bodyRef.current;
      if (ref) {
        const start = ref.selectionStart || 0;
        const end = ref.selectionEnd || 0;
        const newValue = body.substring(0, start) + variable.syntax + body.substring(end);
        onBodyChange(newValue);
        
        // Set cursor position after the inserted variable
        setTimeout(() => {
          ref.focus();
          ref.setSelectionRange(start + variable.syntax.length, start + variable.syntax.length);
        }, 0);
      }
    }
  };

  const previewText = (text: string) => {
    const [firstName, lastName] = contactName.split(' ');
    return text
      .replace(/\{\{firstName\}\}/g, firstName || 'Jennifer')
      .replace(/\{\{lastName\}\}/g, lastName || 'Martinez')
      .replace(/\{\{fullName\}\}/g, contactName || 'Jennifer Martinez')
      .replace(/\{\{title\}\}/g, 'CEO')
      .replace(/\{\{email\}\}/g, 'j.martinez@techventure.com')
      .replace(/\{\{phone\}\}/g, '+1 (555) 123-4567')
      .replace(/\{\{department\}\}/g, 'Executive')
      .replace(/\{\{companyName\}\}/g, accountName || 'TechVenture Corp')
      .replace(/\{\{companyIndustry\}\}/g, 'Technology')
      .replace(/\{\{companySize\}\}/g, '500-1000 employees')
      .replace(/\{\{companyWebsite\}\}/g, 'techventure.com')
      .replace(/\{\{companyLocation\}\}/g, 'San Francisco, CA')
      .replace(/\{\{myFirstName\}\}/g, 'Sarah')
      .replace(/\{\{myLastName\}\}/g, 'Johnson')
      .replace(/\{\{myTitle\}\}/g, 'Senior Account Executive')
      .replace(/\{\{myEmail\}\}/g, 'sarah.johnson@aicoaches.com')
      .replace(/\{\{myPhone\}\}/g, '+1 (555) 987-6543')
      .replace(/\{\{today\}\}/g, 'January 22, 2026')
      .replace(/\{\{todayShort\}\}/g, '01/22/26')
      .replace(/\{\{currentYear\}\}/g, '2026')
      .replace(/\{\{currentMonth\}\}/g, 'January');
  };

  const highlightVariables = (text: string) => {
    const parts = text.split(/(\{\{[^}]+\}\})/g);
    return parts.map((part, idx) => {
      if (part.match(/^\{\{[^}]+\}\}$/)) {
        const variable = VARIABLES.find(v => v.syntax === part);
        return (
          <span key={idx} className="bg-blue-100 text-blue-700 px-1 rounded font-medium">
            {part}
          </span>
        );
      }
      return <span key={idx}>{part}</span>;
    });
  };

  const getVariableCount = (text: string) => {
    const matches = text.match(/\{\{[^}]+\}\}/g);
    return matches ? matches.length : 0;
  };

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowVariables(!showVariables)}
            className="bg-white"
          >
            <Code2 className="w-4 h-4 mr-2" />
            Insert Variable
            <ChevronDown className="w-3 h-3 ml-2" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="bg-white"
          >
            <Eye className="w-4 h-4 mr-2" />
            {showPreview ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="bg-white"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Improve
          </Button>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <Code2 className="w-3 h-3" />
            {getVariableCount(subject + body)} variables
          </span>
          <span className="text-gray-300">|</span>
          <span>{subject.length + body.length} characters</span>
        </div>
      </div>

      {/* Variable Picker */}
      {showVariables && (
        <div className="border-2 border-blue-300 rounded-lg bg-white shadow-lg">
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Code2 className="w-5 h-5 text-blue-600" />
              Insert Variable
            </h3>
            
            {/* Search */}
            <Input
              placeholder="Search variables..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="mb-3"
            />

            {/* Category Tabs */}
            <div className="flex gap-2 flex-wrap">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                  }`}
                >
                  {cat.label}
                  <span className="ml-1 opacity-75">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto">
            <div className="grid grid-cols-2 gap-3">
              {filteredVariables.map(variable => {
                const Icon = variable.icon;
                return (
                  <button
                    key={variable.id}
                    onClick={() => insertVariable(variable)}
                    className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-blue-50 hover:border-blue-300 transition-all text-left group"
                  >
                    <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100">
                      <Icon className="w-4 h-4 text-gray-600 group-hover:text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm text-gray-900 mb-1">
                        {variable.label}
                      </div>
                      <code className="text-xs bg-gray-100 text-blue-700 px-1.5 py-0.5 rounded font-mono">
                        {variable.syntax}
                      </code>
                      <div className="text-xs text-gray-500 mt-1">
                        Example: {variable.example}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {filteredVariables.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Code2 className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p>No variables found matching "{searchQuery}"</p>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowVariables(false)}
              className="w-full"
            >
              Close
            </Button>
          </div>
        </div>
      )}

      {/* Subject Field */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
          <span>Subject Line</span>
          {!showPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveField('subject');
                setShowVariables(true);
              }}
              className="h-6 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Variable
            </Button>
          )}
        </Label>
        
        {showPreview ? (
          <div className="p-3 border border-gray-300 rounded-lg bg-gray-50 min-h-[42px]">
            <div className="text-sm text-gray-900">
              {highlightVariables(previewText(subject))}
            </div>
          </div>
        ) : (
          <Input
            ref={subjectRef}
            value={subject}
            onChange={(e) => onSubjectChange(e.target.value)}
            onFocus={() => setActiveField('subject')}
            placeholder="Enter subject line..."
            className="font-medium"
          />
        )}
        
        {!showPreview && getVariableCount(subject) > 0 && (
          <div className="mt-1 text-xs text-gray-500">
            {getVariableCount(subject)} variable{getVariableCount(subject) > 1 ? 's' : ''} detected
          </div>
        )}
      </div>

      {/* Body Field */}
      <div>
        <Label className="text-sm font-semibold text-gray-700 mb-2 flex items-center justify-between">
          <span>Email Body</span>
          {!showPreview && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setActiveField('body');
                setShowVariables(true);
              }}
              className="h-6 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Variable
            </Button>
          )}
        </Label>
        
        {showPreview ? (
          <div className="p-4 border border-gray-300 rounded-lg bg-gray-50 min-h-[300px]">
            <div className="text-sm text-gray-900 whitespace-pre-wrap leading-relaxed">
              {highlightVariables(previewText(body))}
            </div>
          </div>
        ) : (
          <Textarea
            ref={bodyRef}
            value={body}
            onChange={(e) => onBodyChange(e.target.value)}
            onFocus={() => setActiveField('body')}
            placeholder="Enter email body..."
            rows={14}
            className="font-sans resize-none"
          />
        )}
        
        {!showPreview && getVariableCount(body) > 0 && (
          <div className="mt-1 text-xs text-gray-500">
            {getVariableCount(body)} variable{getVariableCount(body) > 1 ? 's' : ''} detected
          </div>
        )}
      </div>

      {/* Preview Notice */}
      {showPreview && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start gap-2">
            <Eye className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-900">
              <strong>Preview Mode:</strong> Variables are shown with example data for {contactName} at {accountName}. 
              Actual values will be personalized for each recipient.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
