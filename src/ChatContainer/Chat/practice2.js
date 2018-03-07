import React, { Component } from 'react';
import classes from './index.css';
import Hoc from "./../../hoc"
import ReactDOM from 'react-dom';
import CircularJSON from "circular-json"

class Chat extends Component {
  state = {
            text:"",
            shouldScroll:true,
            stopScroll:false
        }
        scrollToBottom = () => {
            const {thing} = this.refs;
            thing.scrollTop = thing.scrollHeight - thing.clientHeight;
          }
          
          componentDidUpdate(nextprops,nextstate) {
            this.scrollToBottom();
                    /*setTimeout(() => {
                        if(this.state.shouldScroll)
                        {
                         this.scrollToBottom();  
                         }
                    }, 50)*/
          }
          componentWillUpdate(newProps,state2){
           /* 
                CHECK THIS OUT WHEN YOU HAVE THE TIME
           if(newProps.messages.length === this.props.messages.length && this.state.shouldScroll){
                this.setState({shouldScroll:false})
            }else if(newProps.messages.length !== this.props.messages.length && !this.state.shouldScroll){
                this.setState({shouldScroll:true})
            }*/
          }



    submitMessage(e) {
        e.preventDefault();
        this.props.newMessage({
            _id:this.props.currentUser._id,
            content:this.state.text,
            username:"admin",
            onClient:true
        })
        this.setState({
            text:""
        })
    }
    changeReadMore = (messageId)=>{
        this.props.changeReadMore(messageId)
    }
    typeHandler = (event)=>{
        this.setState({
            text:event.target.value
        })
    }
    focusDiv(ref) {
      ReactDOM.findDOMNode(this.refs['thing']).focus();
    }

    render() {
        const username = "admin";
        const chats = this.props.messages;
        const userValues = []
        console.log(userValues)
        if(chats){
            chats.forEach((chat,index,arr) => {
                        const elementBefore = (index-1)>-1?arr[index-1]:false
                        if(chat.username == "admin" && (elementBefore && elementBefore.username) == "admin"){
                            userValues.push(<div key={(chat.id||(Math.random()+Date.now()%Math.random()+'')) +'2'+chat.authorId} className={classes.right + " "+ classes.chatParagraph}>                                
                                <div  onClick={()=>{if(chat.content.length>140&&!chat.readMore)this.setState({stopScroll:!this.state.stopScroll})}} onMouseEnter={()=>{
                                    /*this.focusDiv('refno'+index)*/
                                }} onMouseLeave = {()=>{
                                    if(chat.content.length>140&&!chat.readMore){
                                    this.setState({stopScroll:false})
                                    this.focusDiv('refno'+index)
                                    }
                                    
                                }}ref={'refno'+index}>{chat.readMore?chat.content.slice(0,Math.min(chat.content.length,140)):chat.content}{chat.readMore?<button onClick={()=>{this.changeReadMore(chat.id)}} style={{marginLeft:"5px"}}>read more ...</button>:null}</div>
                            </div>)
                        }else if(chat.username == "admin"){
                            userValues.push((<div key={(chat.id||(Math.random()+Date.now()%Math.random()+'')) +'3'+chat.authorId} className={classes.rightHr}>
                                <br/>
                                <hr/>
                            </div>),<div key={(chat.id||(Math.random()+Date.now()%Math.random()+''))+'1'+chat.authorId} className={classes.right + " "+ classes.chatParagraph} style={{fontWeight:"900",padding:"0"}}>
                        
                                <h4>{chat.username}</h4>
                            </div>,<div key={(chat.id||(Math.random()+Date.now()%Math.random()+'')) +'2'+chat.authorId} className={classes.right + " "+ classes.chatParagraph}>                                
                                <div  onClick={()=>{if(chat.content.length>140&&!chat.readMore)this.setState({stopScroll:!this.state.stopScroll})}} onMouseEnter={()=>{
                                    /*this.focusDiv('refno'+index)*/
                                }} onMouseLeave = {()=>{
                                    if(chat.content.length>140&&!chat.readMore){
                                    this.setState({stopScroll:false})
                                    this.focusDiv('refno'+index)
                                    }
                                    
                                }}ref={'refno'+index}>{chat.readMore?chat.content.slice(0,Math.min(chat.content.length,140)):chat.content}{chat.readMore?<button onClick={()=>{this.changeReadMore(chat.id)}} style={{marginLeft:"5px"}}>read more ...</button>:null}</div>
                            </div>)
                        }else if(chat.username == (elementBefore && elementBefore.username)){
                            
                            userValues.push(<div key={(chat.id||(Math.random()+Date.now()%Math.random()+'')) +'2'+chat.authorId} className={classes.left + " "+ classes.chatParagraph}>                                
                                <div  onClick={()=>{if(chat.content.length>140&&!chat.readMore)this.setState({stopScroll:!this.state.stopScroll})}} onMouseEnter={()=>{
                                    /*this.focusDiv('refno'+index)*/
                                }} onMouseLeave = {()=>{
                                    if(chat.content.length>140&&!chat.readMore){
                                    this.setState({stopScroll:false})
                                    this.focusDiv('refno'+index)
                                    }
                                    
                                }}ref={'refno'+index}>{chat.readMore?chat.content.slice(0,Math.min(chat.content.length,140)):chat.content}{chat.readMore?<button onClick={()=>{this.changeReadMore(chat.id)}} style={{marginLeft:"5px"}}>read more ...</button>:null}</div>
                            </div>)

                        } 
                        else{
                            
                            userValues.push((<div key={(chat.id||(Math.random()+Date.now()%Math.random()+'')) +'3'+chat.authorId} className={classes.leftHr}>
                                <br/>
                                <hr/>
                            </div>),<div key={(chat.id||(Math.random()+Date.now()%Math.random()+''))+'1'+chat.authorId} className={classes.left + " "+ classes.chatParagraph} style={{fontWeight:"900",padding:"0"}}>
                                <h4>{chat.username}</h4>
                            </div>,<div key={(chat.id||(Math.random()+Date.now()%Math.random()+'')) +'2'+chat.authorId} className={classes.left + " "+ classes.chatParagraph}>                                
                                <div  onClick={()=>{if(chat.content.length>140&&!chat.readMore)this.setState({stopScroll:!this.state.stopScroll})}} onMouseEnter={()=>{
                                    /*this.focusDiv('refno'+index)*/
                                }} onMouseLeave = {()=>{
                                    if(chat.content.length>140&&!chat.readMore){
                                    this.setState({stopScroll:false})
                                    this.focusDiv('refno'+index)
                                    }
                                    
                                }}ref={'refno'+index}>{chat.readMore?chat.content.slice(0,Math.min(chat.content.length,140)):chat.content}{chat.readMore?<button onClick={()=>{this.changeReadMore(chat.id)}} style={{marginLeft:"5px"}}>read more ...</button>:null}</div>
                            </div>)

                        }
                    })
        }

        return (
            <div className={classes.CHAT}>
                <h3>Indira({this.props.currentUser.userId})</h3>
                <div style={{overflowY:this.state.stopScroll?"hidden":'scroll'}} ref={`thing`} className={classes.chats}>
                    {chats?userValues:null}
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
