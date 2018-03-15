import React, { Component } from 'react';
import classes from './index.css';
import ReactDOM from 'react-dom';
import Spinner from "../../components/Spinner";
import load from "./load.gif"
//need to add an ability to wipe unread messages

class Chat extends Component {
  state = {
            text:"",
            shouldScroll:true,
            stopScroll:false,
            shouldAutoScroll:true,
            newMessage:false,
            fadeIn:true
        }
        componentDidMount(){
            if(this.props.mUserId){
                this.props.callUsersMapped(this.props.mUserId,this.props.currentUser.userId)
            }
        }
        scrollToBottom = () => {
            const {thing} = this.refs;
            thing.scrollTop = thing.scrollHeight - thing.clientHeight;
          }
          
          componentDidUpdate = (nextprops,nextstate)=>{
            if(this.state.shouldAutoScroll){
                this.scrollToBottom()
            }
            
          }
          componentWillReceiveProps = (nextprops)=>{

            if (Object.keys(this.props.mUserIdMessages).length+1 === (Object.keys(nextprops.mUserIdMessages).length)&&this.props.mUserId === nextprops.mUserId){
                this.scrollToBottom();
                console.log('i hhhehhehhehehe')
                this.setState({shouldAutoScroll:true,newMessage:true,fadeIn:false})
            }else if(Object.keys(this.props.mUserIdMessages).length !== Object.keys(nextprops.mUserIdMessages).length){
                this.scrollToBottom();
                this.setState({shouldAutoScroll:true,newMessage:false,fadeIn:true})
            }else{
                this.setState({
                    shouldAutoScroll:false
                })
            }


          }



    submitMessage(e) {
        e.preventDefault();
        this.props.newMessage({
            _id:this.props.mUserId,
            content:this.state.text,
            username:"admin",
            onClient:true
        })
        this.setState({
            text:""
        })
    }
    changeReadMore = (messageId)=>{
        this.props.changeReadMoreMapped(messageId)
        console.log(messageId);
    }
    readMoreController = (chat)=>{
    	if(chat.readMore){
    		return chat.content.slice(0,Math.min(chat.content.length,140));
    	}else{
    		return chat.content
    	}
    }
    readMoreButtonController = (chat,id)=>{
	    if(chat.readMore){
	    	return (<button onClick={()=>{this.changeReadMore(id)}} style={{marginLeft:"5px"}}>read more ...</button>)
	    }else{
	    	return null
	    }
    }
    typeHandler = (event)=>{
        this.setState({
            text:event.target.value
        })
    }
    stopScroll = (chat) => {
        if (chat.content.length > 140 && !chat.readMore){
                this.setState({
                stopScroll: false
            })
                this.focusDiv();
        }
    }
    focusDiv(ref) {
      ReactDOM.findDOMNode(this.refs['thing']).focus();
    }
    generateChats = (isAdmin,isFirst,chat,id,flop)=>{
        const place = this.state.fadeIn?classes.place:'';
    	const arrToReturn = [];
    	if(isFirst){
    		arrToReturn.push((<div key={id+'1'} className={isAdmin?classes.rightHr:classes.leftHr}><br/><hr/></div>))
   
    	arrToReturn.push(<div key={id+'2'} 
    		className={isAdmin?classes.right:classes.left + " "+ classes.chatParagraph} 
    		style={{fontWeight:"900",padding:"0"}}>
          <h4>{chat.username}</h4>
            </div>)
    	}
    	arrToReturn.push((<div 
    		key={id+'3'} className={(isAdmin?classes.right:classes.left) + " "+ (this.state.newMessage &&flop?(classes.chatParagraph2+' '+classes.chatParagraph):(classes.chatParagraph+' '+place).trim())}>                                
          <div style={{overflowY:chat.content.length>140?"scroll":"none"}}  onClick={()=>{if(chat.content.length>140&&!chat.readMore) this.setState({stopScroll:!this.state.stopScroll})}} 
          onMouseLeave = {()=>this.stopScroll(chat)}
          >{this.readMoreController(chat)}
	          {this.readMoreButtonController(chat,id)}</div> 
          </div>))
    	return arrToReturn
    }

    render() {
        if(this.props.mUserIdMessages){
        const chats = Object.keys(this.props.mUserIdMessages);
        const chatContent = this.props.mUserIdMessages;
        const userValues = []
        chats.forEach((chatId,index,arr) => {
              const message = chatContent[chatId];
              let usernameBefore = index===0?false:chatContent[arr[index-1]].username
        userValues.push(...this.generateChats(message.username==="admin",
                message.username!==usernameBefore,
                message,
                chatId,index === (arr.length-1)
                ))
            })
        const result = chats.length>0?userValues:<img className={classes.center} src={load}/>
        console.log(this.state)
        return (
            <div className={classes.CHAT}>
                <h3 
                onClick={()=>this.props.callUsersMapped(this.props.mUserId,this.props.currentUser.userId)}>{this.props.currentUser.userId}</h3>
                <div style={{overflowY:this.state.stopScroll?"hidden":'scroll'}} ref={`thing`} className={classes.chats}>
                    {result}
                </div>
                <form ref={(el) => { this.messagesEnd = el; }}  className={classes.input} onSubmit={(e) => this.submitMessage(e)}>
                    <input type="text" value={this.state.text} onFocus={()=>this.props.wipeUnreadMapped(this.props.mUserId)} onChange={this.typeHandler} />
                    <input type="submit" value="Submit" />
                </form>
            </div>
        )
    }else{
        return <Spinner/>
    }

    
    }
}

export default Chat;


