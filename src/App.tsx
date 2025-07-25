/////////////////////////////////////////////
//     Rich text with suggestions test     //
/////////////////////////////////////////////

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthGate } from './components/AuthGate';
import { Layout } from './components/Layout';
import { RecordPage } from './pages/RecordPage';
import { CharsList } from './pages/CharsList';
// import { CharPage } from './pages/CharPage';
// import CharEditPage from './pages/CharEditPage';
import EntityPage from './pages/EntityPage';
import { EntitiesList } from './pages/EntitiesList';
import { CharMetaData, LocationMetaData, NPCMetaData } from './types/entities';
import EntityEditPage from './pages/EntityEditPage';
import SettingsPage from './pages/SettingsPage';
import QuestPage from './pages/QuestPage';
import { QuestsList } from './pages/QuestsList';
import QuestEditPage from './pages/QuestEditPage';


export const App = () => {
  return (
    <Router>
      <AuthGate>
        <Layout>
          <Routes>
            <Route path="/" element={<RecordPage key={1} />} />

            <Route path="/chars" element={<CharsList key={"chars"} />} />
            <Route path="/char/:id" element={<EntityPage key={11} metaData={CharMetaData} />} />
            <Route path="/char/new" element={<EntityEditPage key={12} metaData={CharMetaData} />} />
            <Route path="/char/:id/edit" element={<EntityEditPage key={13} metaData={CharMetaData} />} />

            <Route path="/npcs" element={<EntitiesList key={"npcs"} metaData={NPCMetaData} />} />
            <Route path="/npc/:id" element={<EntityPage key={21} metaData={NPCMetaData} />} />
            <Route path="/npc/new" element={<EntityEditPage key={22} metaData={NPCMetaData} />} />
            <Route path="/npc/:id/edit" element={<EntityEditPage key={23} metaData={NPCMetaData} />} />
            
            <Route path="/locations" element={<EntitiesList key={"locations"} metaData={LocationMetaData} />} />
            <Route path="/location/:id" element={<EntityPage key={31} metaData={LocationMetaData} />} />
            <Route path="/location/new" element={<EntityEditPage key={32} metaData={LocationMetaData} />} />
            <Route path="/location/:id/edit" element={<EntityEditPage key={33} metaData={LocationMetaData} />} />

            <Route path="/quests" element={<QuestsList key={"quests"} />} />
            <Route path="/quest/:id" element={<QuestPage key={31} />} />
            <Route path="/quest/new" element={<QuestEditPage key={32} />} />
            <Route path="/quest/:id/edit" element={<QuestEditPage key={33} />} />

            <Route path="settings" element={<SettingsPage key={999}/>} />
          </Routes>
        </Layout>
      </AuthGate>
    </Router> 
  );
};

export default App;
