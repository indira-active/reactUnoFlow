import React, { Component } from 'react';
import classes from './index.css';
import Hoc from "./../../hoc"
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
       /* style={{
  backgroundColor: 'rgba(0,0,0, .7)',
  display: 'grid',
  height: '100%',
  gridTemplateRows: '10% 85% auto 4%',
  justifyContent:"space-between",
  alignContent:"center",
  gridTemplateColumns: '1fr',
  boxShadow: '0 0 8px 0 rgba(0,0,0, 0.3)'
}}*/

        return (
            <div className={classes.CHAT}>
                <h3>Indira({this.props.currentUser.userId})</h3>
                <div ref={`thing`} className={classes.chats}>
                    {chats?chats.map((chat,index) => {
                        return chat.username == "admin"?(
                    
                            <div key={chat.id+index} className={classes.right + " "+ classes.chatParagraph}>
                               <span style={{fontWeight:"900"}}>{chat.username}</span>
                                <br/>
                                {chat.content}
                            </div>
                        ):(

                            <div key={chat.id} className={classes.left + " "+ classes.chatParagraph}>
                             <span style={{fontWeight:"900"}}>{chat.username}</span>
                                <br/>
                                {chat.content}
                            </div>
                             )
                    }):null}
             
                </div>
                <form ref={(el) => { this.messagesEnd = el; }} className={classes.input} onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" onFocus={()=>this.props.wipeUnread(this.props.currentIndex)} value={this.state.text} onChange={this.typeHandler} />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        );
    }
}

export default Chat;
