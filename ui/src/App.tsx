import { PeopleView } from './views/PeopleView';

function App() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1rem' }}>
      <nav style={{ marginBottom: '1rem' }}>
        <strong>Family Tree</strong>
      </nav>
      <PeopleView />
    </div>
  );
}

export default App;
