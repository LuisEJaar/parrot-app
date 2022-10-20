import Dictaphone from "./components/Dictaphone"
import SpeechForm from "./components/SpeechForm"
import "./styles/style.css"
import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import { FaRegPlayCircle } from 'react-icons/fa'
import SortMatch from "./components/SortMatch"
import { v4 as uuidv4 } from "uuid";
import shuffle from "lodash/shuffle";

const SayItSpellIt = () => {

  const { user } = useSelector(state => state.auth)
  const { saidWord } = useSelector(state => state.word)

 // const [items, setItems] = useState([])
  // const copyWord = saidWord.concat()
  // console.log(copyWord)
  
  // function createLetters(word) {
  //   const words = []
  //     for (let i = 0; i < word.length; i++) {
  //       words.push({
  //         id: uuidv4(),
  //         letter: word[i],
  //         position: i
  //       })
  //     }
  //   }
    // setItems(shuffle(words))
  
//can check and confirm spoken word here
  const speechHandler = (text) => {
    if (saidWord) {
      const msg = new SpeechSynthesisUtterance()
      msg.text = text
      window.speechSynthesis.speak(msg)
    }
  }
//speechForm will only need to pop up on completion of the game

  return (
    <div className="contain">
      <h1>Welcome {user.name}</h1>
      
      {saidWord &&
        <div className="containReplay">
          <span>Confirm correct word</span>
          <button className='replay-btn' onClick={() => speechHandler(saidWord)}>Replay <FaRegPlayCircle />
          </button>

        </div>
      }
  
      
      
     {!saidWord &&
      <>
          <Dictaphone />
      </>
      }
      { saidWord &&
        <SortMatch />
      }
    </div>
  )
}

export default SayItSpellIt

