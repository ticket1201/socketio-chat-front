import React, {useEffect, useRef, useState} from 'react';
import './App.css';
import {io} from 'socket.io-client';

const socket = io('https://socketio-chat-back-production.up.railway.app')
//const socket = io('http://192.168.0.104:3009')

type UserType = {
    id: string
    name: string
}

type MessagesType = {
    message: string
    id: string
    user: UserType
}

function App() {
    const [messages, setMessages] = useState<Array<MessagesType>>([])
    const [users, setUsers] = useState<Array<string>>([])
    const [text, setText] = useState('')
    const [name, setName] = useState('')
    const anchor = useRef<HTMLDivElement>(null)


    useEffect(() => {
        socket.on('init-messages-published', (messages: Array<MessagesType>) => {
            setMessages(messages)
        })
        socket.on('new-message-sent', (message: MessagesType) => {
            setMessages((pred) => [...pred, message])
        })
        socket.on('new-name-sent', (name: string) => {
            setName(name)
        })
        socket.on('user-sent', (names: Array<string>) => {
            setUsers(names)
        })
    }, [])

    useEffect(()=> {
        anchor.current?.scrollIntoView({behavior:'smooth'})
    },[messages])

    return !name
        ? (
            <div className="chat-wrapper">
                <b>Enter your name:</b>
                <textarea value={text} onChange={e => {
                    setText(e.currentTarget.value)
                }}></textarea>
                <button onClick={() => {
                    socket.emit('client-name-sent', text)
                    setText('')
                }}>Set name
                </button>
            </div>
        )
        : (
            <div className="App">
                <div className={'users'}>
                    <p>Online:</p>
                    {users.map((el, i) => {
                        return (
                            <b key={i}>{el} </b>
                        )
                    })}
                </div>
                <div className="chat-wrapper">
                    <div className={'chat'}>
                        {messages.map((el) => {
                            return (<div key={el.id}>
                                <b>{el.user.name}:</b> {el.message}
                                <hr/>
                            </div>)
                        })}
                        <div ref={anchor}></div>
                    </div>
                    <textarea value={text} onChange={e => setText(e.currentTarget.value)}></textarea>
                    <button onClick={() => {
                        socket.emit('client-message-sent', text)
                        setText('')
                    }}>Send
                    </button>
                </div>
            </div>

        );
}

export default App;
