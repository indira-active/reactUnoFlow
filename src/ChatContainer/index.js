import React, { Component } from "react";
import Chat from "./Chat"
import { Button} from "react-bootstrap"
import classes from './index.css';
import io from 'socket.io-client'
import { connect } from 'react-redux';
import Spinner from "../components/Spinner";
import {withRouter,Link} from "react-router-dom"


import clone from 'clone'

const socket = io('https://damp-plateau-11898.herokuapp.com/');


class ChatContainer extends Component {
    state = {
        users:[],
        currentUser:0
    }
    componentDidMount() {
        this.socketCall()
        socket.on('reset',()=>{
            this.props.refresh();
        })
    
    }
    socketCall = () => {
        socket.on('testEvent', message => {
            const msg = JSON.parse(message)
            if(msg.trigger === 'merge:appUser'){
                console.log(msg)
                this.postDoneMapped(msg.discarded[0]._id,msg.surviving._id,msg.surviving.userId);
                alert(`${msg.discarded[0]._id} is merging with ${msg.surviving.userId} aka ${msg.surviving._id}`)
            }
            if (msg.trigger === 'message:appUser') {
                console.log(msg);
                this.addToMessages({
                    content: msg.messages[0].text,
                    username: msg.appUser.userId || `anonymous : ${msg.appUser._id}`,
                    _id: msg.appUser._id,
                    id:msg.messages[0]._id
                })
            }
        });
    }
    postDoneMapped = (smoochId,userValue,username)=>{
        const newUsers = clone(this.props.mappedUsers.users);
        let currentUser = this.props.mappedUsers.currentUser;
        delete newUsers[smoochId]
        if(currentUser === smoochId){
            currentUser = Object.keys(newUsers)[0];
        }        
        this.props.reconcileMappedState({currentUser,users:newUsers})
        if(userValue&&username){
            this.deactivateUser(true,smoochId,userValue,username)
            this.postOpen(userValue)
        }else{
            this.deactivateUser(true,smoochId)
        }
    }
    deactivateUser = (callUsers,smoochId,userValue,username)=>{
        this.changeActiveStatus(false,smoochId,callUsers,userValue,username)
    }
    //this function needs to be reevaluated for merged users use case
    changeActiveStatus = (active,smoochId,callUsers,userValue,username)=>{
        const ID = this.props.mappedUsers.users[smoochId].firebaseId
        const ref = this.props.db.collection('users').doc(ID);
        ref.set({
            active: active?true:false
        }, { merge: true });
        if(callUsers){
            setTimeout(() => {
                  this.callUsersMapped(userValue,username)
            }, 100)
        }
    }

    postOpen = (smoochId)=>{
        this.changeActiveStatus(true,smoochId)
    }
        callUsersMapped =  async (user,username,change)=>{

                const mappedUsers = clone({...this.props.mappedUsers.users});
                const newMappedUser = mappedUsers[user];
                if(newMappedUser.notCalled){
                    newMappedUser.messages = await newMappedUser.messages();
                    newMappedUser.notCalled = false;
                }else{
                    newMappedUser.messages = await newMappedUser.messageFunction();
                }
                this.props.reconcileMappedState({users:mappedUsers,currentUser:change?user:this.props.mappedUsers.currentUser})
    }

    wipeUnreadMapped = (id)=>{
        this.props.reconcileMappedState({
                    ...this.props.mappedUsers,
                    users: {...this.props.mappedUsers.users,
                        [id]: {
                            ...this.props.mappedUsers.users[id],
                            unread:0
                        }
                    }
    })
}

    changeReadMoreMapped = (messageId)=>{
        const users = clone(this.props.mappedUsers.users);
        const currentUser = {...users[this.props.mappedUsers.currentUser]};
        currentUser.messages[messageId] = {...currentUser.messages[messageId],readMore:false}
        users[this.props.mappedUsers.currentUser] = currentUser
        this.props.reconcileMappedState({users})
    }
    updateCurrentMappedUser = (id)=>{
        this.props.changeCurrentMappedUser(id)
    }
    addToMessagesRubricMapped = (MU,message) => {
            const users = clone(MU.users)
            if(message.username === "admin" && message.onClient){
                //have to substitute this for genuine ID at some point
                users[message._id].messages[Date.now()+""+Math.random()] = {
                    content: message.content,
                    username: message.username,
                    readMore:message.content.length>140?true:false
                }
                socket.emit("message", {
                        msg: message.content,
                        id: message._id
                    })
            }else if(users[message._id] === undefined){
                     users[message._id] = {
                        userId: message.username,
                        _id: message._id,
                        unread:1,
                        messages: {
                            [message.id]:{
                            content: message.content,
                            username: message.username,
                            readMore:message.content.length>140?true:false
                            }
                        }
                }
            }else{
                users[message._id] = {
                    ...users[message._id],
                    unread:users[message._id].unread+1
                }
                users[message._id].messages[message.id] = {
                    content: message.content,
                    username: message.username,
                    readMore:message.content.length>140?true:false
                }
            }
            return {users}

        }
    addToMessages = (message) => {
        this.props.reconcileMappedState(this.addToMessagesRubricMapped(this.props.mappedUsers,message))
    }
    render() {
        const USER = this.props.mappedUsers.users[this.props.mappedUsers.currentUser];
        const mUserId = this.props.mappedUsers.currentUser;
        const mUser = this.props.mappedUsers.users[mUserId];
        const mUsers = this.props.mappedUsers.users
        return !Object.keys(this.props.mappedUsers.users).length>0?(<Spinner/>):(
            <div className={classes.container}>
                <div className={classes.frame} >
                    <div className={classes.corner} >
                                <Link to="/Users">
                                Users
                                </Link>
                                <Link to="/Chat">
                                Chat 
                                </Link>
                                <Link to="/Upload">
                                Upload
                                </Link>
                                <Link to="/Create">
                                Create
                                </Link>
                        </div>
                    <div style={{overflowY:"scroll",boxSizing:"border-box"}}>
                    {USER?Object.keys(this.props.mappedUsers.users).map(
                        (user, index) => {
                            return (
                                <div key={user+Date.now()+Math.random()} style={{ display: 'inline-block', margin: "3px"}}>
                                    <Button style={{boxSizing:"border-box"}}
                                        onClick={() => { 
                                            this.updateCurrentMappedUser(user)
                                            return mUsers[user].notCalled?this.callUsersMapped(user,mUsers[user].userId,null,true):this.props.reconcileState({currentUser:index})}}
                                        bsStyle='primary'
                                        bsSize="small">{mUsers[user].userId?mUsers[user].userId:`NR ${user}`}</Button>
                                    <Button 
                                        onClick={() => {this.callUsersMapped(user,mUsers[user].userId)}}
                                        bsStyle="success"
                                        bsSize="small">
                                        update</Button>
                                    <Button 
                                        onClick={() => {this.postDoneMapped(user)}}
                                        bsStyle="danger"
                                        bsSize="small">
                                        close</Button>
                                    <span >
                                    {mUsers[user].unread || null}
                                    </span>
                                </div>
                            )
                        }):(<h3 style={{textAlign:"center"}}>NO MORE USERS</h3>)}
                    </div>
                </div>
                {USER?(<div className={classes.App}>
                    <Chat wipeUnread={this.wipeUnread}
                    wipeUnreadMapped={this.wipeUnreadMapped}
                     newMessage={this.addToMessages}
                     changeReadMore={this.changeReadMore}
                     callUsersMapped={this.callUsersMapped}
                     changeReadMoreMapped = {this.changeReadMoreMapped}
                     currentIndex={this.props.currentUser}
                     currentUser={USER} messages={USER.messages}
                     mUserId={mUserId}
                     mUserIdMessages={mUser.messages} />
                </div>):null}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        mappedUsers:state.mappedUsers,
        db:state.fb.db
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addUsers: () => dispatch({type:"USERS",payload:"something"}),
        changeCurrentUser: (currentUser) => dispatch({type:"CURRENT",payload:currentUser}),
        reconcileState:(payload)=>dispatch({type:"CHANGEPAGEVALUES",payload}),
        reconcileMappedState:(payload)=>dispatch({type:"CHANGEMAPPEDVALUES",payload}),
        changeCurrentMappedUser:(payload)=>dispatch({type:"MAPPEDCURRENT",payload})

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(ChatContainer))
                /*load.messages.forEach(msg=>{
                    this.props.db.collection('users').doc(user).collection('messages').doc(msg._id).set(msg);
                    const content = msg.text.trim() || msg.actions.map((val)=>{
                            return val.text
                        }).join(' ');
                    newMappedUser.messages[msg._id] = {
                            content:content,
                            username:msg.role === "appMaker"?"admin":username|| `anonymous : ${username||msg._id}`,
                            authorId:msg.authorId,
                            readMore:content.length>140?true:false
                        }
                })*/




        /*fetch('https://us-central1-unoflow-8ec7e.cloudfunctions.net/smooch/getMessages?appUser='+user)
            .then(res => res.json())
            .then(async load=>{
                const mappedUsers = clone({...this.props.mappedUsers.users});
                const newMappedUser = mappedUsers[user];
                if(newMappedUser.notCalled){
                    newMappedUser.messages = await newMappedUser.messages();
                    newMappedUser.notCalled = false;
                }
                this.props.reconcileMappedState({users:mappedUsers,currentUser:change?user:this.props.mappedUsers.currentUser})
            }).catch(err=>{console.log('err is happening',err)})*/