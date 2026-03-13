import FaceExpression from '../../Expression/components/FaceExpression'
import Player from '../components/Player'
import { useSong } from '../hooks/useSong'
import "../style/home.scss"

const Home = () => {
  const { handleGetSong } = useSong()
  return (
    <div className='home'>
      <FaceExpression
        onClick={(expression) => { handleGetSong({ mood: expression }) }}
      />
      <Player />
    </div>

  )
}

export default Home