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

        <Route path="quests">
          <Route index element={<QuestList />} />
          <Route path=":ext" element={<QuestPage />} />
          <Route path="new" element={<QuestEditPage />} />
          <Route path=":ext/edit" element={<QuestEditPage />} />
        </Route>

        <Route path="games">
          <Route path="new" element={<GameCreateEditPage />} />
          <Route path=":ext/edit" element={<GameCreateEditPage />} />
        </Route>

        <Route path="settings" element={<SettingsPage />} />
        <Route path="notes" element={<NotesPage />} />
    </Routes>
  )
}

export default AppRouter
