import GraphAnalyzer from '@/components/GraphAnalyzer';

export default function Home() {
  return (
    <main style={{ padding: '30px', fontFamily: 'monospace', maxWidth: '900px', margin: '0 auto', color: 'black', backgroundColor: 'white' }}>
      <h1 style={{ borderBottom: '2px solid black', paddingBottom: '10px' }}>Node Hierarchy Analyzer</h1>
      <p style={{ marginBottom: '30px' }}>
        REST API testing interface. Processes hierarchical relationships and returns structured JSON output.
      </p>

      <GraphAnalyzer />
    </main>
  );
}
