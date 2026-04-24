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

export default function GraphAnalyzer() {
  const [inputData, setInputData] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);

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
          <h2>Analysis Result</h2>
          
          <div style={{ border: '1px solid black', padding: '15px', marginBottom: '20px' }}>
            <h3>Summary</h3>
            <p>Total Trees: {result.summary.total_trees}</p>
            <p>Total Cycles: {result.summary.total_cycles}</p>
            <p>Largest Tree Root: {result.summary.largest_tree_root || 'None'}</p>
          </div>

          <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '20px' }}>
            {result.invalid_entries.length > 0 && (
              <div style={{ flex: '1', border: '1px solid black', padding: '10px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>Invalid Entries ({result.invalid_entries.length})</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {result.invalid_entries.map((entry, idx) => (
                    <span key={idx} style={{ border: '1px solid black', padding: '2px 6px', fontSize: '12px' }}>{entry}</span>
                  ))}
                </div>
              </div>
            )}

            {result.duplicate_edges.length > 0 && (
              <div style={{ flex: '1', border: '1px solid black', padding: '10px' }}>
                <h4 style={{ margin: '0 0 10px 0' }}>Duplicate Edges ({result.duplicate_edges.length})</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
                  {result.duplicate_edges.map((entry, idx) => (
                    <span key={idx} style={{ border: '1px solid black', padding: '2px 6px', fontSize: '12px' }}>{entry}</span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <h3>Hierarchies Found</h3>
          {result.hierarchies.length === 0 ? (
            <p style={{ fontStyle: 'italic' }}>No valid hierarchies processed.</p>
          ) : (
            result.hierarchies.map((h, idx) => (
              <div key={idx} style={{ border: '1px solid black', padding: '15px', marginBottom: '15px' }}>
                <p style={{ fontWeight: 'bold', margin: '0 0 10px 0' }}>Root Node: {h.root}</p>
                
                {h.has_cycle ? (
                  <p style={{ fontWeight: 'bold' }}>[CYCLE DETECTED IN THIS GROUP]</p>
                ) : (
                  <>
                    <p>Depth: {h.depth}</p>
                    <pre style={{ background: '#f5f5f5', padding: '10px', border: '1px solid black', overflowX: 'auto' }}>
                      {JSON.stringify(h.tree, null, 2)}
                    </pre>
                  </>
                )}
              </div>
            ))
          )}

        </div>
      )}
    </div>
  );
}
