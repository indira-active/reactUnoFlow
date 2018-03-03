import React, { Component } from "react";
import Chat from "./Chat"
import Hoc from "./../hoc.js"
import { Button} from "react-bootstrap"
import classes from './index.css';
import io from 'socket.io-client'
import { connect } from 'react-redux';
import Spinner from "../components/Spinner";

import clone from 'clone'

const socket = io('https://damp-plateau-11898.herokuapp.com/');


class ChatContainer extends Component {
    state = {
        users:[],
        currentUser:0
    }
    componentDidMount() {
        this.loadUsers()
        this.socketCall()
        socket.on('reset',()=>{
            this.loadUsers()
        })
    
    }
    componentDidUpdate(nextProps,nextState){
        if(nextProps.users.length>1 && this.state.users.length <1){
            this.updatePage();
        }
    }
    loadUsers(){
       /* fetch('https://damp-plateau-11898.herokuapp.com/api/loadusers')
        .then(res => res.json())
        .then(load=>{
            const users = load.map(val=>{
                return{
                    userId:val.smoochUserId?val.smoochUserId:`anonymous:${val.smoochId}`,
                    _id:val.smoochId,
                    messages:[],
                    notCalled:true,
                    unread:0
                }
            })
            this.setState({users,currentUser:0})
        }).catch(err=>{console.log('err is happening',err)})*/
            /*const currentUser = this.props.users.map((x,location)=>{return{...x,location}}).find((val, index) => {
                            return (val.location === this.props.currentUser) || (val._id === this.props.currentUser)
                        });*/
            if(this.props.users>1){
               this.updatePage()
            }else{
                this.props.refresh();
            }
                
    }
    updatePage = ()=>{
        new Promise((resolve,reject)=>{
                        let currentUser = null;
                        this.props.users.filter((val, location) => {
                    currentUser = currentUser ? currentUser : (location === this.props.currentUser || (val._id === this.props.currentUser) ? resolve({...val,
                        location
                    }) : null)
                    return (val._id === this.props.currentUser) || (location === this.props.currentUser)
                    })
                }).then(currentUser=>{
                    this.setState({
                        users: [...this.props.users],
                        currentUser:currentUser?currentUser.location:7
                        })
                    this.callUsers(currentUser._id,currentUser.userId,currentUser.location);
                })
    }
    socketCall = () => {
        socket.on('testEvent', message => {
            const msg = JSON.parse(message)
            if(msg.trigger === 'merge:appUser'){
                console.log(msg)
                this.postDone(msg.discarded[0]._id,msg.surviving._id,msg.surviving.userId);
                alert(`${msg.discarded[0]._id} is merging with ${msg.surviving.userId} aka ${msg.surviving._id}`)
            }
            if (msg.trigger === 'message:appUser') {
                this.addToMessages({
                    content: msg.messages[0].text,
                    username: msg.appUser.userId || `anonymous : ${msg.appUser._id}`,
                    _id: msg.appUser._id
                })
            }
        });
    }
    postDone = (smoochId,userValue,username)=>{
        if(this.state.users.find(user=>user._id === userValue) === undefined){
            this.postOpen(userValue,true)
        }else{
            this.postOpen(userValue)
        }
        this.setState({currentUser:this.state.currentUser === 0?1:0,users:this.state.users.filter(user=>user._id !== smoochId)})
        fetch(`https://damp-plateau-11898.herokuapp.com/api/updateuser`, {
            method: 'POST',
            body: JSON.stringify({smoochId}), 
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
                console.log('Success:', response)
                setTimeout(() => {
                  this.callUsers(userValue,username)
                }, 300)
          });
    }
    postOpen = (smoochId,update)=>{
        fetch(`https://damp-plateau-11898.herokuapp.com/api/updateusertoactive`, {
            method: 'POST',
            body: JSON.stringify({smoochId}), 
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
                console.log('Success:', response)
                if(update){
                    this.loadUsers();
                }
          });
    }
    callUsers = (user,username,index,change)=>{
        fetch('https://damp-plateau-11898.herokuapp.com/api/getmessages?appUser='+user)
        .then(res => res.json())
        .then(load=>{
            console.log('LOAD IS BEING CALLED')
            console.log(load,'see load here ')
            const messages = load.messages.map(msg=>{
                const content = msg.text.trim() || msg.actions.map((val)=>{
                        return val.text
                    }).join(' ')
                return {
                    content:content,
                    username:msg.role === "appMaker"?"admin":username|| `anonymous : ${username||msg._id}`,
                    id:msg._id,
                    authorId:msg.authorId,
                    readMore:content.length>140?true:false
                }
            })
            const users = clone(this.state.users);
            let indexValue = index;
            if(!indexValue){
                users.forEach((item,index) => {
                  if(item._id === user)
                  {
                    indexValue = index;
                  }
                })
            }
            const newUser ={...users[indexValue],messages,notCalled:false} 
            users[indexValue] = newUser;
            this.setState({users,currentUser:change?indexValue:this.state.currentUser})
        }).catch(err=>{console.log('err is happening',err)})
    }
    wipeUnread = (userIndex)=>{
        this.setState({
            users:this.state.users.map((user,index)=>{
                if(userIndex === index){
                    return {
                        ...user,
                        unread:0
                    }
                }
                return user
            })
        })
    }
    changeReadMore = (messageId)=>{
        const users = [...this.state.users];
        const currentUser = users[this.state.currentUser];
        const messages  = currentUser.messages.map((msg,index)=>{
            if(messageId === msg.id){
                return {...msg,readMore:false}
            }
            else {
                return msg
            }
        });
        const newUser = {...currentUser,messages};
        users[this.state.currentUser] = newUser;
        this.setState({
            users
        })
    }
    addToMessages = (message) => {
        let change = false;
        this.setState((state) => {

            const result = {
                users: state.users.map((user, index, arr) => {
                    if (user._id === message._id && user.userId !== message.username && message.username !== "admin") {
                        change = true;
                        return {
                            ...user,
                            userId: message.username,
                            unread:user.unread+1,
                            messages: user.messages.concat({
                                content: message.content,
                                username: message.username,
                                readMore:message.content.length>140?true:false
                            })
                        }
                    } else if (user._id === message._id && message.username !== "admin") {
                        change = true;
                        return {
                            ...user,
                            unread:user.unread+1,
                            messages: user.messages.concat({
                                content: message.content,
                                username: message.username,
                                readMore:message.content.length>140?true:false
                            })
                        }
                    }else if(user._id === message._id){
                        change = true;
                        return {
                            ...user,
                            messages: user.messages.concat({
                                content: message.content,
                                username: message.username,
                                readMore:message.content.length>140?true:false
                            })
                        }
                    } else {
                        return user
                    }
                })
            }
            if (!change) {

                return {
                    users: result.users.concat({
                        userId: message.username,
                        _id: message._id,
                        unread:1,
                        messages: [{
                            content: message.content,
                            username: message.username
                        }]
                    })
                }
            } else if (message.username === "admin") {
                socket.emit("message", {
                    msg: message.content,
                    id: message._id
                })
                return result
            } else {
                return result
            }

        })
    }
    /*.sort((a,b)=>{
                    const status = b.unread - a.unread;
                    return status != 0?status:(a.userId.replace(/@/g,'')>b.userId.replace(/@/g,'')?1:-1);
                })*/
    render() {
        console.log(this.state)
        const USER = this.state.users[this.state.currentUser];
        return !this.state.users.length?(<Spinner/>):(
            <div style={{position:"fixed"}}>
                <div style={{ height: "10vh", overflow: "scroll" }}>{USER?this.state.users.map(
                    (user, index) => {
                        return (
                            <div key={user._id+Date.now()+Math.random()} style={{ display: 'inline-block', margin: "3px",position:'relative'}}>
                                <Button
                                    onClick={() => { return user.notCalled?this.callUsers(user._id,user.userId,index,true):this.setState({currentUser:index})}}
                                    bsStyle='primary'
                                    bsSize="small">{user.userId?user.userId:`NR ${user._id}`}</Button>
                                <Button
                                    onClick={() => {this.callUsers(user._id,user.userId,index)}}
                                    bsStyle="success"
                                    bsSize="small">
                                    update</Button>
                                <Button
                                    onClick={() => {this.postDone(user._id)}}
                                    bsStyle="danger"
                                    bsSize="small">
                                    close</Button>
                                <span style={{position:"absolute",top:"-5px",left:"0px",backgroundColor:"black",color:"white",fontSize:"12px"}}>
                                {user.unread || null}
                                </span>
                            </div>
                        )
                    }):(<h3 style={{textAlign:"center"}}>NO MORE USERS</h3>)}
                </div>
                {USER?(<div className={classes.App}>
                    <Chat wipeUnread={this.wipeUnread}
                     newMessage={this.addToMessages}
                     changeReadMore={this.changeReadMore}
                      currentIndex={this.state.currentUser}
                       currentUser={USER} messages={USER.messages} />
                </div>):null}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        users: state.users.users,
        currentUser:state.users.currentUser
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addUsers: () => dispatch({type:"USERS",payload:"something"}),
        changeCurrentUser: (currentUser) => dispatch({type:"CURRENT",payload:currentUser}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(ChatContainer)