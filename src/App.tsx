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
import { CharPage } from './pages/CharPage';
import CharEditPage from './pages/CharEditPage';
//import { PlacesList } from './pages/PlacesList';
//import { PlacePage } from './pages/PlacePage';

export const App = () => {
  return (
    <Router>
      <AuthGate>
        <Layout>
          <Routes>
            <Route path="/" element={<RecordPage />} />
            <Route path="/chars" element={<CharsList />} />
            <Route path="/char/:id" element={<CharPage />} />
            <Route path="/char/new" element={<CharEditPage />} />
            <Route path="/char/:id/edit" element={<CharEditPage />} />
            {/*<Route path="/npcs" element={<NPCsList />} />
            <Route path="/npcs/:id" element={<NPCPage />} />*/}
            {/*<Route path="/locations" element={<LocationsList />} />
            <Route path="/locations/:id" element={<LocationPage />} />*/}
          </Routes>
        </Layout>
      </AuthGate>
    </Router>
  );
};

export default App;
