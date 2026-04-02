import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PeopleView } from './views/PeopleView';
import { AddPersonView } from './views/AddPersonView';
import { AddRelationshipView } from './views/AddRelationshipView';
import { TreeView } from './views/TreeView';

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div>
      <header className="border-b border-gray-200 py-6 px-6">
        <h1 className="text-2xl font-semibold text-gray-900 m-0">Family Tree Builder</h1>
        <p className="text-gray-500 text-sm mt-1">Build and manage your family relationships</p>
      </header>

      <div className="max-w-[1126px] mx-auto px-6 py-6">
        {!isHome && (
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 transition-colors mb-4">
            <ArrowLeftIcon className="w-4 h-4" />
            Back
          </Link>
        )}

        {isHome && (
          <div className="flex gap-3 mb-6">
            <Link
              to="/add-person"
              data-testid="btn-add-person"
              className="bg-gray-900 text-white rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Add Person
            </Link>
            <Link
              to="/add-relationship"
              className="bg-gray-100 text-gray-900 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Add Relationship
            </Link>
            <Link
              to="/tree"
              className="bg-gray-100 text-gray-900 rounded-xl px-4 py-2 text-sm font-medium hover:bg-gray-200 transition-colors"
            >
              Family Tree
            </Link>
          </div>
        )}

        <Routes>
          <Route path="/" element={<PeopleView />} />
          <Route path="/add-person" element={<AddPersonView />} />
          <Route path="/add-relationship" element={<AddRelationshipView />} />
          <Route path="/tree" element={<TreeView />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppShell />
    </BrowserRouter>
  );
}
