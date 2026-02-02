
import React from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { StoryView } from './components/StoryView';
import { Discovery } from './components/Discovery';
import { Library } from './components/Library';

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/story/:id" element={<StoryView />} />
          <Route path="/discovery" element={<Discovery />} />
          <Route path="/library" element={<Library />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
