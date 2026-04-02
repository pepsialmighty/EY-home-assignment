import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { PeopleView } from './views/PeopleView';
import { TreeView } from './views/TreeView';

function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
        <nav style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <strong>Family Tree</strong>
          <NavLink to="/" end style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            People
          </NavLink>
          <NavLink to="/tree" style={({ isActive }) => ({ fontWeight: isActive ? 'bold' : 'normal' })}>
            Family Tree
          </NavLink>
        </nav>
        <Routes>
          <Route path="/" element={<PeopleView />} />
          <Route path="/tree" element={<TreeView />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
