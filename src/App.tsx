/////////////////////////////////////////////
//     Rich text with suggestions test     //
/////////////////////////////////////////////

// import { RichInput } from "./components/RichInput";
// import { SuggestionData } from "./types/suggestion";

// const App = () => {

// 	const mockSuggestionData : SuggestionData = {
// 		entities: [
// 			{ 
// 				id: 1,
// 				sid: "p:1",
// 				type: "p",
// 				typeName: "person",
// 				ref: "AkodoToturi",
// 				name: "Akodo Toturi"
// 			},
// 			{ 
// 				id: 2,
// 				sid: "p:2",
// 				type: "p",
// 				typeName: "person",
// 				ref: "DojiHotaru",
// 				name: "Doji Hotaru"
// 			},
// 			{ 
// 				id: 3,
// 				sid: "p:3",
// 				type: "p",
// 				typeName: "person",
// 				ref: "IsawaKaede",
// 				name: "Isawa Kaede"
// 			},
// 			{ 
// 				id: 4,
// 				sid: "p:4",
// 				type: "p",
// 				typeName: "person",
// 				ref: "MirumotoDaini",
// 				name: "Mirumoto Daini"
// 			},
// 		]
// 	}

// 	return (
// 		<div className="flex justify-center p-4">
// 			<RichInput fullSuggestionData={mockSuggestionData}/>
// 		</div>
// 	)

// }

// export default App;

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


export const App = () => {
  return (
    <Router>
      <AuthGate>
        <Layout>
          <Routes>
            <Route path="/" element={<RecordPage key={1} />} />

            <Route path="/chars" element={<CharsList key={10} />} />
            <Route path="/char/:id" element={<EntityPage key={11} metaData={CharMetaData} />} />
            <Route path="/char/new" element={<EntityEditPage key={12} metaData={CharMetaData} />} />
            <Route path="/char/:id/edit" element={<EntityEditPage key={13} metaData={CharMetaData} />} />

            <Route path="/npcs" element={<EntitiesList key={20} metaData={NPCMetaData} />} />
            <Route path="/npc/:id" element={<EntityPage key={21} metaData={NPCMetaData} />} />
            <Route path="/npc/new" element={<EntityEditPage key={22} metaData={NPCMetaData} />} />
            <Route path="/npc/:id/edit" element={<EntityEditPage key={23} metaData={NPCMetaData} />} />
            
            <Route path="/locations" element={<EntitiesList key={30} metaData={LocationMetaData} />} />
            <Route path="/location/:id" element={<EntityPage key={31} metaData={LocationMetaData} />} />
            <Route path="/location/new" element={<EntityEditPage key={32} metaData={LocationMetaData} />} />
            <Route path="/location/:id/edit" element={<EntityEditPage key={33} metaData={LocationMetaData} />} />

            <Route path="settings" element={<SettingsPage key={999}/>} />
          </Routes>
        </Layout>
      </AuthGate>
    </Router> 
  );
};

export default App;
