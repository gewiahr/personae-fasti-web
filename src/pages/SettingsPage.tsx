//import { useState } from 'react';
//import { SelectInput } from '../components/SelectInput';
import { useAuth } from '../hooks/useAuth'

const SettingsPage = () => {
  const { player } = useAuth();
  //const [ currentGame, setCurrentGame ] = useState(); 

  return (
    <div className='flex'>
      <h2 className='text-xl'>{player.username}</h2>
      <div>
        {/* <SelectInput /> */}
      </div>
    </div>
  )
}

export default SettingsPage
