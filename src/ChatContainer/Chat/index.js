import React, { Component } from 'react';
import classes from './index.css';
import ReactDOM from 'react-dom';
import Spinner from "../../components/Spinner";
import load from "./load.gif"
import Hoc from "../../hoc"
class Chat extends Component {
  state = {
            text:"",
            shouldScroll:true,
            stopScroll:false,
            shouldAutoScroll:true,
            newMessage:false,
            fadeIn:true,
            src:null,
            top:'500px',
            imageStatus:null,
            sendFile:null,
            promises:[]
        }
        componentDidMount(){
            console.log('mounting')
            if(this.props.mUserId){
                this.props.callUsersMapped(this.props.mUserId,this.props.currentUser.userId)
            }
            if(this.state.shouldAutoScroll){
                this.scrollToBottom();
            }
        }
        scrollToBottom = () => {
            const {thing} = this.refs;
            thing.scrollTop = thing.scrollHeight - thing.clientHeight;
          }
          
          componentDidUpdate = (nextprops,nextstate)=>{
            if(this.state.shouldAutoScroll){
                this.scrollToBottom();
            }
            if(this.state.src && (this.state.top !== `-${this.src.offsetHeight}px`)){
                  this.setState({top:`-${this.src.offsetHeight}px`})
                  console.log(this.src.offsetHeight);
                return
            }
            
          }
          componentWillReceiveProps = (nextprops)=>{

            if(this.props.mUserId !== nextprops.mUserId){
                    this.props.callUsersMapped(nextprops.mUserId)
                this.scrollToBottom();
                        this.setState({
                        text:"",
                        shouldScroll:true,
                        stopScroll:false,
                        shouldAutoScroll:true,
                        newMessage:false,
                        fadeIn:true,
                        src:null,
                        top:'500px',
                        imageStatus:null,
                        sendFile:null
                        })
            } else if (Object.keys(this.props.mUserIdMessages).length+1 === (Object.keys(nextprops.mUserIdMessages).length)&&this.props.mUserId === nextprops.mUserId){
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
        if(this.state.src){
            const txt = this.state.text;
           const upload = (url)=>{
                this.props.newMessage({
                _id:this.props.mUserId,
                content:txt,
                username:"admin",
                onClient:true,
                type:'image',
                mediaUrl: url
            })
            this.setState({
                text:"",
                src:null,
                top:'500px',
                imageStatus:null,
                sendFile:null
            })
        }
        this.state.sendFile(upload)

        }else if(this.state.text){
                this.props.newMessage({
                _id:this.props.mUserId,
                content:this.state.text,
                username:"admin",
                onClient:true
            })
            this.setState({
                text:"",
                src:null
            })
        }
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
    handleFileSelect = (evt)=>{
      evt.stopPropagation();
      evt.preventDefault();
      const file = evt.target.files[0];
      if(!file) return 
        const sendFile = (fun)=>{
            const metadata = {
            'contentType': file.type
          };
          const storageRef = this.props.storage.ref();
          storageRef.child('images/' + file.name).put(file, metadata).then((snapshot)=>{
            console.log('Uploaded', snapshot.totalBytes, 'bytes.');
            console.log(snapshot.metadata);
            var url = snapshot.downloadURL;
            console.log('File available at', url);
            fun(url)
          }).catch(function(error) {
            console.error('Upload failed:', error);
          });
        }
        const reader = new FileReader();

        reader.onload = (e)=>{
                this.setState({src:e.target.result,sendFile})
        }

        reader.readAsDataURL(file);
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
        const heightValue =chat.mediaUrl?'auto':'100%';
    	arrToReturn.push((<div 
    		key={id+'3'} className={(isAdmin?classes.right:classes.left) + " "+ (this.state.newMessage &&flop?(classes.chatParagraph2+' '+classes.chatParagraph):(classes.chatParagraph+' '+place).trim())}>                                
          <div style={{height:heightValue}}  onClick={()=>{if(chat.content.length>140&&!chat.readMore) this.setState({stopScroll:!this.state.stopScroll})}} 
          onMouseLeave = {()=>this.stopScroll(chat)}
          >{chat.type ==='image'?(
            <Hoc>
                <a href={chat.mediaUrl || chat.content} target="_blank">
                    <img onLoad={this.scrollToBottom} src={chat.mediaUrl || chat.content} style={{maxWidth:"200px",height:"auto"}}></img>
                </a>
                <br/>
                {(chat.content.match('https')||chat.content.match('http'))?null:(
                    <p style={{textAlign:(isAdmin?'right':'left')}}>
                    {this.readMoreController(chat)}
                    {chat.type==='image'?((chat.content.match('https')||chat.content.match('http'))?null:this.readMoreButtonController(chat,id)):this.readMoreButtonController(chat,id)}
                    </p>)}
            </Hoc>):this.readMoreController(chat)}
	          </div> 
          </div>),)
    	return arrToReturn
    }
    handleImageLoaded(test) {
        console.log(test)
    this.setState({ imageStatus: true });
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
        console.log(this.state);
        console.log(this.src&&this.src.offsetHeight);
        const image = (<img 
            onChange={()=>{console.log('am I changing')}} 
            ref={(el) => { this.src = el}}
            onLoad={this.handleImageLoaded.bind(this)}  
            style={{maxWidth:"500px",transition:'all 1s',position:'absolute',maxHeight:'100px',top:`${this.state.top}`,left:"10px",opacity:this.state.imageStatus?'.8':'0',border:"solid 5px yellow",borderRadius:"5px"}} 
            src={this.state.src} 
            alt="csupload"/>)
        return (
            <div className={classes.CHAT}>
                <h3 
                onClick={()=>this.props.callUsersMapped(this.props.mUserId,this.props.currentUser.userId)}>{this.props.currentUser.userId}</h3>
                <div style={{overflowY:this.state.stopScroll?"hidden":'scroll'}} ref={`thing`} className={classes.chats}>
                    {result}
                </div>
                <form ref={(el) => { this.messagesEnd = el; }}  className={classes.input} onSubmit={(e) => this.submitMessage(e)}>
                {image}
                    <input ref={(val) => { this.text =val; }} type="text" value={this.state.text} onFocus={()=>this.props.wipeUnreadMapped(this.props.mUserId)} onChange={this.typeHandler} />
                    <input
                     onChange={(event)=>{this.handleFileSelect(event)}}
                     ref={(photo) => { this.clickOn = photo; }}
                     style={{display:'none'}} type="file" name="photo" accept="image/gif, image/png, image/jpeg" />
                    <input type="submit" value="Submit" />
                    <button onClick={(e)=>{e.preventDefault();this.clickOn.click()}} >photo</button>
                </form>
            </div>
        )
    }else{
        return <Spinner/>
    }

    
    }
}

export default Chat;


