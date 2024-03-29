import React, {useState, useEffect} from 'react'
import queryString from 'query-string';
import io from "socket.io-client";

import './Chat.css';
import Messages from '../Messages/Messages'
import InfoBar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import TextContainer from "../TextContainer/TextContainer";

// const ENDPOINT = 'https://project-chat-application.herokuapp.com/';


let socket;

const Chat = ({location}) => {
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState('');
  const ENDPOINT = 'localhost:5000'

  useEffect(() => {
    const {name, room} = queryString.parse(location.search)

    socket = io(ENDPOINT, {transports: ['websocket', 'polling', 'flashsocket']})

    setRoom(room);
    setName(name)

    socket.emit('join', {name, room}, (error) => {
      if (error) {
        alert(error);
      }
    });
  }, [ENDPOINT, location.search]);

  useEffect(() => {
    socket.on('message', (message) => {
      setMessages([...messages, message]);
    })

    // socket.on('roomData', ({users}) => {
    //   setUsers(users)
    // })

  }, [messages])

  const sendMessage = event => {
    event.preventDefault()

    if (message) {
      socket.emit('sendMessage', message, () => setMessage(''));
    }
  }

  return (
      <div className="outerContainer">
        <div className="container">
          <InfoBar room={room}/>
          <Messages messages={messages} name={name}/>
          <Input
              message={message}
              sendMessage={sendMessage}
              setMessage={setMessage}
          />
        </div>
        {/*<TextContainer users={users}/>*/}
      </div>
  )
}
export default Chat