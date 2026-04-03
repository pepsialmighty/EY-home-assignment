import { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ArrowLeftIcon } from '@heroicons/react/24/outline';
import { PeopleView } from './views/PeopleView';
import { AddPersonView } from './views/AddPersonView';
import { AddRelationshipView } from './views/AddRelationshipView';
import { TreeView } from './views/TreeView';

type Tab = 'tree' | 'people';

function AppShell() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const [activeTab, setActiveTab] = useState<Tab>('tree');

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
          <>
            <div className="flex gap-1 border-b border-gray-200 mb-6">
              <button
                onClick={() => setActiveTab('tree')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'tree'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Family Tree
              </button>
              <button
                onClick={() => setActiveTab('people')}
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'people'
                    ? 'border-gray-900 text-gray-900'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                People
              </button>
            </div>

            {activeTab === 'tree' ? <TreeView /> : <PeopleView />}
          </>
        )}

        <Routes>
          <Route path="/" element={null} />
          <Route path="/add-person" element={<AddPersonView />} />
          <Route path="/add-relationship" element={<AddRelationshipView />} />
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
