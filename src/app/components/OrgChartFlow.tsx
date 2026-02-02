import { useCallback, useMemo } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  MarkerType,
  Handle,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { User, Mail, TrendingUp, Building2, Linkedin } from 'lucide-react';
import { Badge } from '@/app/components/ui/badge';

interface Contact {
  id: string;
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  stakeholderRole?: string;
  relationshipScore?: number;
  reportsTo?: string;
  accountId: string;
  linkedInUrl?: string;
  discProfile?: string;
}

interface Account {
  id: string;
  name: string;
  investor?: string;
  investorType?: string;
}

interface OrgChartFlowProps {
  contacts: Contact[];
  account: Account;
  mode: 'hierarchy' | 'relationships';
}

// Custom node component
function ContactNode({ data }: { data: any }) {
  const getStakeholderColor = (role?: string) => {
    switch (role) {
      case 'Economic Buyer':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'Champion':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'Decision Maker':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'Blocker':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'Influencer':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'Technical Evaluator':
        return 'bg-indigo-100 text-indigo-700 border-indigo-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRelationshipColor = (score?: number) => {
    if (!score) return 'bg-gray-300';
    if (score >= 8) return 'bg-green-500';
    if (score >= 6) return 'bg-yellow-500';
    if (score >= 4) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getDISCColor = (profile?: string) => {
    if (!profile) return 'bg-gray-400 text-white';
    const firstLetter = profile.charAt(0).toUpperCase();
    switch (firstLetter) {
      case 'D':
        return 'bg-red-500 text-white';
      case 'I':
        return 'bg-yellow-500 text-white';
      case 'S':
        return 'bg-green-500 text-white';
      case 'C':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-white border-2 border-gray-200 min-w-[280px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3" />
      
      <div className="flex items-start gap-3">
        <div className={`w-10 h-10 ${data.isInvestor ? 'bg-indigo-100' : 'bg-blue-100'} rounded-full flex items-center justify-center flex-shrink-0`}>
          {data.isInvestor ? (
            <Building2 className="w-5 h-5 text-indigo-600" />
          ) : (
            <User className="w-5 h-5 text-blue-600" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 flex-1">
              <p className="font-semibold text-gray-900 text-sm truncate">
                {data.name}
              </p>
              {data.linkedInUrl && (
                <a 
                  href={data.linkedInUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-shrink-0 hover:opacity-70 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Linkedin className="w-4 h-4 text-blue-600" />
                </a>
              )}
            </div>
            {data.relationshipScore && (
              <div className="flex items-center gap-1 ml-2">
                <div className={`w-2 h-2 rounded-full ${getRelationshipColor(data.relationshipScore)}`} />
                <span className="text-xs font-medium text-gray-600">{data.relationshipScore}/10</span>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600 mb-2 truncate">{data.title}</p>
          
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            {data.stakeholderRole && (
              <Badge className={`${getStakeholderColor(data.stakeholderRole)} text-xs`}>
                {data.stakeholderRole}
              </Badge>
            )}
            {data.discProfile && (
              <Badge className={`${getDISCColor(data.discProfile)} text-xs font-bold border-0`}>
                {data.discProfile}
              </Badge>
            )}
          </div>
          
          {data.email && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{data.email}</span>
            </div>
          )}
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3" />
    </div>
  );
}

// Investor node component
function InvestorNode({ data }: { data: any }) {
  return (
    <div className="px-4 py-3 shadow-lg rounded-lg bg-indigo-50 border-2 border-indigo-300 min-w-[280px]">
      <Handle type="target" position={Position.Top} className="w-3 h-3 !bg-indigo-400" />
      
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-indigo-200 rounded-full flex items-center justify-center flex-shrink-0">
          <Building2 className="w-5 h-5 text-indigo-700" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-indigo-900 text-sm mb-1">
            {data.name}
          </p>
          {data.investorType && (
            <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300 text-xs">
              {data.investorType}
            </Badge>
          )}
          <p className="text-xs text-indigo-600 mt-1">Investor Organization</p>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} className="w-3 h-3 !bg-indigo-400" />
    </div>
  );
}

const nodeTypes = {
  contact: ContactNode,
  investor: InvestorNode,
};

export function OrgChartFlow({ contacts, account, mode }: OrgChartFlowProps) {
  // Build nodes and edges based on hierarchy
  const { initialNodes, initialEdges } = useMemo(() => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    
    let yOffset = 0;
    const xSpacing = 350;
    const ySpacing = 150;

    // Add investor node if exists
    if (account.investor && mode === 'hierarchy') {
      nodes.push({
        id: 'investor',
        type: 'investor',
        position: { x: 400, y: yOffset },
        data: {
          name: account.investor,
          investorType: account.investorType,
          isInvestor: true,
        },
      });
      yOffset += ySpacing;
    }

    // Find CEO (no reportsTo)
    const ceo = contacts.find(c => !c.reportsTo);
    
    if (ceo) {
      nodes.push({
        id: ceo.id,
        type: 'contact',
        position: { x: 400, y: yOffset },
        data: {
          name: `${ceo.firstName} ${ceo.lastName}`,
          title: ceo.title,
          email: ceo.email,
          stakeholderRole: ceo.stakeholderRole,
          relationshipScore: ceo.relationshipScore,
          linkedInUrl: ceo.linkedInUrl,
          discProfile: ceo.discProfile,
        },
      });

      // Add edge from investor to CEO
      if (account.investor && mode === 'hierarchy') {
        edges.push({
          id: `investor-${ceo.id}`,
          source: 'investor',
          target: ceo.id,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#6366f1', strokeWidth: 2 },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: '#6366f1',
          },
        });
      }

      yOffset += ySpacing;

      // Find direct reports
      const directReports = contacts.filter(c => c.reportsTo === ceo.id);
      const reportCount = directReports.length;
      const totalWidth = reportCount * xSpacing;
      const startX = 400 - totalWidth / 2 + xSpacing / 2;

      directReports.forEach((report, index) => {
        const xPos = startX + index * xSpacing;
        
        nodes.push({
          id: report.id,
          type: 'contact',
          position: { x: xPos, y: yOffset },
          data: {
            name: `${report.firstName} ${report.lastName}`,
            title: report.title,
            email: report.email,
            stakeholderRole: report.stakeholderRole,
            relationshipScore: report.relationshipScore,
            linkedInUrl: report.linkedInUrl,
            discProfile: report.discProfile,
          },
        });

        // Add reporting edge
        edges.push({
          id: `${ceo.id}-${report.id}`,
          source: ceo.id,
          target: report.id,
          type: mode === 'hierarchy' ? 'smoothstep' : 'default',
          animated: mode === 'relationships',
          style: { 
            stroke: mode === 'relationships' && report.relationshipScore ? 
              (report.relationshipScore >= 8 ? '#22c55e' :
               report.relationshipScore >= 6 ? '#eab308' :
               report.relationshipScore >= 4 ? '#f97316' : '#ef4444') 
              : '#94a3b8', 
            strokeWidth: 2 
          },
          markerEnd: {
            type: MarkerType.ArrowClosed,
            color: mode === 'relationships' && report.relationshipScore ? 
              (report.relationshipScore >= 8 ? '#22c55e' :
               report.relationshipScore >= 6 ? '#eab308' :
               report.relationshipScore >= 4 ? '#f97316' : '#ef4444')
              : '#94a3b8',
          },
        });

        // Find subordinates
        const subordinates = contacts.filter(c => c.reportsTo === report.id);
        const subCount = subordinates.length;
        const subWidth = subCount * (xSpacing * 0.8);
        const subStartX = xPos - subWidth / 2 + (xSpacing * 0.4);

        subordinates.forEach((sub, subIndex) => {
          const subXPos = subStartX + subIndex * (xSpacing * 0.8);
          
          nodes.push({
            id: sub.id,
            type: 'contact',
            position: { x: subXPos, y: yOffset + ySpacing },
            data: {
              name: `${sub.firstName} ${sub.lastName}`,
              title: sub.title,
              email: sub.email,
              stakeholderRole: sub.stakeholderRole,
              relationshipScore: sub.relationshipScore,
              linkedInUrl: sub.linkedInUrl,
              discProfile: sub.discProfile,
            },
          });

          edges.push({
            id: `${report.id}-${sub.id}`,
            source: report.id,
            target: sub.id,
            type: mode === 'hierarchy' ? 'smoothstep' : 'default',
            animated: mode === 'relationships',
            style: { 
              stroke: mode === 'relationships' && sub.relationshipScore ? 
                (sub.relationshipScore >= 8 ? '#22c55e' :
                 sub.relationshipScore >= 6 ? '#eab308' :
                 sub.relationshipScore >= 4 ? '#f97316' : '#ef4444')
                : '#94a3b8',
              strokeWidth: 2 
            },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              color: mode === 'relationships' && sub.relationshipScore ? 
                (sub.relationshipScore >= 8 ? '#22c55e' :
                 sub.relationshipScore >= 6 ? '#eab308' :
                 sub.relationshipScore >= 4 ? '#f97316' : '#ef4444')
                : '#94a3b8',
            },
          });
        });
      });
    }

    return { initialNodes: nodes, initialEdges: edges };
  }, [contacts, account, mode]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  return (
    <div style={{ width: '100%', height: '700px' }} className="bg-gray-50 rounded-lg border border-gray-200">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
      >
        <Controls />
        <Background color="#e5e7eb" gap={16} />
      </ReactFlow>
    </div>
  );
}