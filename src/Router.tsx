import { Route, Routes } from 'react-router-dom'
import EntityList from '@/pages/Entities/EntityList'
import EntityPage from '@/pages/Entities/EntityPage'
import QuestList from '@/pages/Quests/QuestList'
import QuestPage from '@/pages/Quests/QuestPage'
import { RecordPage } from '@/pages/Records/RecordPage'
import SettingsPage from '@/pages/Settings/SettingsPage'
import EntityLayout from '@/pages/Entities/EntityLayout'
import EntityEditPage from '@/pages/Entities/EntityEditPage'
import QuestEditPage from '@/pages/Quests/QuestEditPage'
import GameCreateEditPage from '@/pages/Games/GameCreateEditPage'
import NotesPage from '@/pages/Notes/NotesPage'

const AppRouter = () => {
  return (
    <Routes>
        <Route path="/" element={<RecordPage />} />

        <Route path=":entityType" element={<EntityLayout />}>
          <Route index element={<EntityList />} />
          <Route path=":ext" element={<EntityPage />} />
          <Route path="new" element={<EntityEditPage />} />
          <Route path=":ext/edit" element={<EntityEditPage />} />
        </Route>

        <Route path="quests"> {/* element={<QuestLayout />}> */}
          <Route index element={<QuestList />} />
          <Route path=":ext" element={<QuestPage />} />
          <Route path="new" element={<QuestEditPage />} />
          <Route path=":ext/edit" element={<QuestEditPage />} />
        </Route>

        <Route path="games"> {/* element={<GameLayout />}> */}
          {/* <Route path=":id" element={<GamePage />} /> */}
          <Route path="new" element={<GameCreateEditPage />} />
          <Route path=":ext/edit" element={<GameCreateEditPage />} />
        </Route>

        <Route path="settings" element={<SettingsPage />} />
        <Route path="notes" element={<NotesPage />} />

      {/* <Route path="/" element={<RecordPage key={1} />} />

      <Route path="/chars" element={<CharsList key={"chars"} />} />
      <Route path="/char/:ext" element={<EntityPage key={11} metaData={CharMetaData} />} />
      <Route path="/char/new" element={<EntityEditPage key={12} metaData={CharMetaData} />} />
      <Route path="/char/:ext/edit" element={<EntityEditPage key={13} metaData={CharMetaData} />} />

      <Route path="/npcs" element={<EntitiesList key={"npcs"} metaData={NPCMetaData} />} />
      <Route path="/npc/:ext" element={<EntityPage key={21} metaData={NPCMetaData} />} />
      <Route path="/npc/new" element={<EntityEditPage key={22} metaData={NPCMetaData} />} />
      <Route path="/npc/:ext/edit" element={<EntityEditPage key={23} metaData={NPCMetaData} />} />

      <Route path="/locations" element={<EntitiesList key={"locations"} metaData={LocationMetaData} />} />
      <Route path="/location/:ext" element={<EntityPage key={31} metaData={LocationMetaData} />} />
      <Route path="/location/new" element={<EntityEditPage key={32} metaData={LocationMetaData} />} />
      <Route path="/location/:ext/edit" element={<EntityEditPage key={33} metaData={LocationMetaData} />} />

      <Route path="/quests" element={<QuestsList key={"quests"} />} />
      <Route path="/quest/:ext" element={<QuestPage key={31} />} />
      <Route path="/quest/new" element={<QuestEditPage key={32} />} />
      <Route path="/quest/:ext/edit" element={<QuestEditPage key={33} />} />

      <Route path="/game/:ext" element={<GameCreateEditPage key={400001} />} />
      <Route path="/game/new" element={<GameCreateEditPage key={400002} />} />

      <Route path="settings" element={<SettingsPage key={999} />} /> */}
    </Routes>
  )
}

export default AppRouter
