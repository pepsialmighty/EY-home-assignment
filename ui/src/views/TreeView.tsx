import { ReactFlow, Background, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTreeData } from '../api/useTreeData';

export function TreeView() {
  const { data, isLoading, error } = useTreeData();

  if (isLoading) {
    return <p>Loading tree…</p>;
  }

  if (error) {
    return <p>Failed to load tree: {error.message}</p>;
  }

  if (!data || data.nodes.length === 0) {
    return <p data-testid="empty-tree">No people yet. Add some from the People tab.</p>;
  }

  return (
    <div data-testid="tree-view" style={{ height: '100vh' }}>
      <ReactFlow nodes={data.nodes} edges={data.edges} fitView>
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  );
}
