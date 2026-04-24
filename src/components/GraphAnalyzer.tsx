"use client";

import React, { useState } from 'react';

interface Summary {
  total_trees: number;
  total_cycles: number;
  largest_tree_root: string | null;
}

interface Hierarchy {
  root: string;
  tree: Record<string, any>;
  depth?: number;
  has_cycle?: boolean;
}

interface ApiResponse {
  is_success: boolean;
  user_id: string;
  email_id: string;
  college_roll_number: string;
  hierarchies: Hierarchy[];
  invalid_entries: string[];
  duplicate_edges: string[];
  summary: Summary;
  error?: string;
}

const TreeNode = ({ name, children }: { name: string; children: any }) => {
  const childKeys = Object.keys(children);
  return (
    <div style={{ marginLeft: '20px', borderLeft: '1px solid #ddd', paddingLeft: '15px', marginTop: '5px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <span style={{ color: '#666' }}>└─</span>
        <span style={{ background: '#f0f0f0', padding: '2px 8px', borderRadius: '4px', fontSize: '14px' }}>{name}</span>
      </div>
      {childKeys.map((childName) => (
        <TreeNode key={childName} name={childName} children={children[childName]} />
      ))}
    </div>
  );
};

export default function GraphAnalyzer() {
  const [inputData, setInputData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [activeTab, setActiveTab] = useState<'tree' | 'table' | 'cards'>('cards');

  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shashikumar-ezhilarasu-bfhl.onrender.com/bfhl';

  const loadExample = () => {
    const example = `A->B, A->C, B->D, C->E, E->F\nX->Y, Y->Z, Z->X\nP->Q, Q->R, P->Q\nG->H, G->I, H->J\nhello, 1->2, A->\na->b`;
    setInputData(example);
  };

  const handleAnalyze = async () => {
    setError(null);
    setResult(null);
    setLoading(true);

    try {
      const dataArray = inputData
        .split(/[,\n]/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (dataArray.length === 0) {
        throw new Error('Please enter nodes to analyze.');
      }

      if (dataArray.length > 50) {
        throw new Error('Maximum 50 edges allowed per request.');
      }

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: dataArray }),
      });

      const data = await res.json();

      if (!res.ok || !data.is_success) {
        throw new Error(data.error || 'Server error occurred');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const renderTreeView = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {result?.hierarchies.map((h, idx) => (
        <div key={idx} style={{ background: '#fff', border: '1px solid black', padding: '20px' }}>
          <div style={{ fontWeight: 'bold', borderBottom: '1px solid #eee', marginBottom: '10px', paddingBottom: '5px' }}>
            Hierarchy Root: {h.root} {h.has_cycle && <span style={{ color: 'red' }}>(Cycle Detected)</span>}
          </div>
          {!h.has_cycle && (
            <div style={{ marginTop: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ background: '#000', color: '#fff', padding: '2px 8px', borderRadius: '4px', fontSize: '14px' }}>{h.root}</span>
              </div>
              {Object.keys(h.tree).map((childName) => (
                <TreeNode key={childName} name={childName} children={h.tree[childName]} />
              ))}
            </div>
          )}
          {h.has_cycle && <div style={{ color: '#666', fontStyle: 'italic' }}>Detailed tree visualization unavailable for cyclic components.</div>}
        </div>
      ))}
    </div>
  );

  const renderTableView = () => {
    const rows: { root: string; parent: string; child: string }[] = [];
    result?.hierarchies.forEach((h) => {
      const traverse = (nodeName: string, children: any) => {
        Object.keys(children).forEach((childName) => {
          rows.push({ root: h.root, parent: nodeName, child: childName });
          traverse(childName, children[childName]);
        });
      };
      if (!h.has_cycle) {
        traverse(h.root, h.tree);
      }
    });

    return (
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid black' }}>
          <thead>
            <tr style={{ background: '#f5f5f5' }}>
              <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Component Root</th>
              <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Parent Node</th>
              <th style={{ border: '1px solid black', padding: '10px', textAlign: 'left' }}>Child Node</th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr><td colSpan={3} style={{ padding: '10px', textAlign: 'center' }}>No tree relationships to display.</td></tr>
            ) : (
              rows.map((row, i) => (
                <tr key={i}>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{row.root}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{row.parent}</td>
                  <td style={{ border: '1px solid black', padding: '10px' }}>{row.child}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };

  const renderCardView = () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' }}>
      {result?.hierarchies.map((h, idx) => (
        <div key={idx} style={{ border: '1px solid black', padding: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '12px', fontWeight: 'bold', background: '#000', color: '#fff', padding: '2px 6px' }}>COMPONENT {idx + 1}</span>
            {h.has_cycle && <span style={{ fontSize: '10px', color: 'red', border: '1px solid red', padding: '1px 4px' }}>CYCLE</span>}
          </div>
          <div style={{ fontSize: '24px', fontWeight: 'bold' }}>{h.root}</div>
          <div style={{ fontSize: '14px', color: '#666' }}>
            {h.has_cycle ? 'Circular dependency detected.' : `Max depth: ${h.depth}`}
          </div>
          {!h.has_cycle && (
            <div style={{ marginTop: '5px' }}>
              <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '5px' }}>STRUCTURE:</div>
              <div style={{ maxHeight: '100px', overflowY: 'auto', background: '#f9f9f9', padding: '5px', fontSize: '12px' }}>
                {JSON.stringify(h.tree)}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ fontFamily: 'monospace', color: 'black' }}>
      
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontWeight: 'bold', marginBottom: '10px' }}>
          Input Edges (Format: Parent-&gt;Child):
        </label>
        <textarea
          style={{ width: '100%', height: '150px', padding: '10px', border: '1px solid black', fontFamily: 'monospace' }}
          placeholder="A->B&#10;A->C"
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
        
        <div style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
          <button 
            onClick={handleAnalyze} 
            disabled={loading}
            style={{ padding: '8px 16px', background: 'black', color: 'white', border: '1px solid black', cursor: loading ? 'wait' : 'pointer' }}
          >
            {loading ? 'Processing...' : 'Submit'}
          </button>
          <button 
            onClick={loadExample} 
            disabled={loading}
            style={{ padding: '8px 16px', background: 'white', color: 'black', border: '1px solid black', cursor: 'pointer' }}
          >
            Load Example Data
          </button>
        </div>
      </div>

      {error && (
        <div style={{ border: '2px solid black', padding: '10px', marginBottom: '20px', fontWeight: 'bold' }}>
          ERROR: {error}
        </div>
      )}

      {result && (
        <div style={{ borderTop: '2px solid black', paddingTop: '20px' }}>
          <h2 style={{ marginBottom: '20px' }}>Analysis Result</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px', marginBottom: '30px' }}>
            <div style={{ border: '1px solid black', padding: '10px' }}>
              <span style={{ fontWeight: 'bold', display: 'block', fontSize: '12px' }}>ROLL NUMBER</span>
              {result.college_roll_number}
            </div>
            <div style={{ border: '1px solid black', padding: '10px' }}>
              <span style={{ fontWeight: 'bold', display: 'block', fontSize: '12px' }}>USER ID</span>
              {result.user_id}
            </div>
            <div style={{ border: '1px solid black', padding: '10px' }}>
              <span style={{ fontWeight: 'bold', display: 'block', fontSize: '12px' }}>EMAIL</span>
              {result.email_id}
            </div>
          </div>
          
          <div style={{ border: '1px solid black', padding: '20px', marginBottom: '30px', background: '#fcfcfc' }}>
            <h3 style={{ marginTop: 0 }}>System Summary</h3>
            <div style={{ display: 'flex', gap: '40px' }}>
              <div>
                <span style={{ display: 'block', fontSize: '12px', color: '#666' }}>TOTAL TREES</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{result.summary.total_trees}</span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '12px', color: '#666' }}>CYCLES DETECTED</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold', color: result.summary.total_cycles > 0 ? 'red' : 'black' }}>
                  {result.summary.total_cycles}
                </span>
              </div>
              <div>
                <span style={{ display: 'block', fontSize: '12px', color: '#666' }}>LARGEST ROOT</span>
                <span style={{ fontSize: '20px', fontWeight: 'bold' }}>{result.summary.largest_tree_root || 'N/A'}</span>
              </div>
            </div>
          </div>

          {(result.invalid_entries.length > 0 || result.duplicate_edges.length > 0) && (
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
              {result.invalid_entries.length > 0 && (
                <div style={{ flex: '1', border: '1px solid black', padding: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Invalid Entries ({result.invalid_entries.length})</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {result.invalid_entries.map((entry, idx) => (
                      <span key={idx} style={{ border: '1px solid #ccc', background: '#eee', padding: '2px 8px', fontSize: '12px' }}>{entry}</span>
                    ))}
                  </div>
                </div>
              )}

              {result.duplicate_edges.length > 0 && (
                <div style={{ flex: '1', border: '1px solid black', padding: '15px' }}>
                  <h4 style={{ margin: '0 0 10px 0' }}>Duplicate Edges ({result.duplicate_edges.length})</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {result.duplicate_edges.map((entry, idx) => (
                      <span key={idx} style={{ border: '1px solid #ccc', background: '#eee', padding: '2px 8px', fontSize: '12px' }}>{entry}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div style={{ marginBottom: '20px', display: 'flex', borderBottom: '2px solid black' }}>
            <button 
              onClick={() => setActiveTab('cards')}
              style={{ padding: '10px 20px', background: activeTab === 'cards' ? 'black' : 'transparent', color: activeTab === 'cards' ? 'white' : 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Card View
            </button>
            <button 
              onClick={() => setActiveTab('tree')}
              style={{ padding: '10px 20px', background: activeTab === 'tree' ? 'black' : 'transparent', color: activeTab === 'tree' ? 'white' : 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Tree View
            </button>
            <button 
              onClick={() => setActiveTab('table')}
              style={{ padding: '10px 20px', background: activeTab === 'table' ? 'black' : 'transparent', color: activeTab === 'table' ? 'white' : 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Tabular View
            </button>
          </div>

          <div style={{ marginBottom: '40px' }}>
            {activeTab === 'tree' && renderTreeView()}
            {activeTab === 'table' && renderTableView()}
            {activeTab === 'cards' && renderCardView()}
          </div>

          <div style={{ marginTop: '60px' }}>
            <h3 style={{ borderBottom: '1px solid black', paddingBottom: '10px' }}>Raw Payload Verification</h3>
            <pre style={{ background: '#f0f0f0', padding: '20px', border: '1px solid black', overflowX: 'auto', fontSize: '12px', lineHeight: '1.5' }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>

        </div>
      )}
    </div>
  );
}
