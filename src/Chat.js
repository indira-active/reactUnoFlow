import React, { Component } from 'react';
import './App.css';
import Message from './Message.js';

class Chat extends Component {
  state = {
            text:""
        }
        scrollToBottom = () => {
            const {thing} = this.refs;
            thing.scrollTop = thing.scrollHeight - thing.clientHeight;
          }
          
          componentDidUpdate() {
                this.scrollToBottom(); 
          }
          


    submitMessage(e) {
        e.preventDefault();
        this.props.newMessage({
            _id:this.props.currentUser._id,
            content:this.state.text,
            username:"admin"
        })
        this.setState({
            text:""
        })
    }
    typeHandler = (event)=>{
        this.setState({
            text:event.target.value
        })
    }

    render() {
        const username = "admin";
        const chats = this.props.messages;

        return (
            <div className="chatroom">
                <h3>Indira({this.props.currentUser.userId})</h3>
                <ul ref={`thing`} className="chats">
                    {chats?chats.map((chat,index) => 
                            <Message key={index} chat={chat} user={username} />
                        ):null
                    }
                </ul>
                <div style={{height:"1px"}} ref={(el) => { this.messagesEnd = el; }}></div>
                <form className="input" onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" onFocus={()=>this.props.wipeUnread(this.props.currentIndex)} value={this.state.text} onChange={this.typeHandler} />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Chat;
