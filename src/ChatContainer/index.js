import React, { Component } from "react";
import Chat from "./Chat"
import { Button} from "react-bootstrap"
import classes from './index.css';
import { connect } from 'react-redux';
import Spinner from "../components/Spinner";
import Basic from "../Basic";
import {withRouter,Link} from "react-router-dom"
import clone from 'clone'



class ChatContainer extends Component {

    state = {
        users:[],
        currentUser:0
    }
    componentDidMount() {

      this.socketCall()
      this.setState({date:Date.now()/1000})
    
    }
    socketCall = () => {
      this.props.database.ref('messages').limitToLast(1).on('child_added',(snapshot)=>{
            const values = snapshot.val();
            console.log(Number(values.received)||values.received);
            console.log(this.state.date);
            console.log(Number(values.received) > this.state.date);
            if(values.role !== 'appMaker' && (Number(values.received) > this.state.date)){
                console.log(values);
                            console.log(values)
                    this.addToMessages({
                        content: values.text,
                        username: values.userId || `anonymous : ${values.authorId}`,
                        _id: values.authorId,
                        id:values._id,
                        type:values.type
                    })

            }
          })
    this.props.database.ref('mergedUsers').on('child_changed',(snapshot)=>{
        console.log(snapshot.val())
            const value = snapshot.val();
            const user = snapshot.key;
                this.postDoneMapped(value,user,true);
          })
    }
    postDoneMapped = (smoochId,userValue,username)=>{
        const newUsers = clone(this.props.mappedUsers.users);
        if(!newUsers[smoochId]) return
        let currentUser = this.props.mappedUsers.currentUser;
        const discardedUserId = newUsers[smoochId].userId;
        delete newUsers[smoochId];
        if(currentUser === smoochId){
            currentUser = Object.keys(newUsers)[0];
        } 
        console.log('first')       
        this.props.reconcileMappedState({currentUser,users:newUsers})
        // for merging users
        if(!newUsers[userValue]){
            this.postOpen(smoochId)
            console.log('am I happening')
        }
        if(userValue&&username){
           //  this.deactivateUser(false,smoochId)
            alert(`merging ${discardedUserId} into ${newUsers[userValue].userId || userValue}`)
        }else{
            this.deactivateUser(false,smoochId)
        }
    }
    deactivateUser = (callUsers,smoochId,userValue,username)=>{
        this.changeActiveStatus(false,smoochId,callUsers,userValue,username)
    }
    //this function needs to be reevaluated for merged users use case
    changeActiveStatus = (active,smoochId,callUsers,userValue,username)=>{
        const ref = this.props.db.collection('users').doc(smoochId);
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

                const mappedUsers = await clone({...this.props.mappedUsers.users});
                const newMappedUser = mappedUsers[user];
                if(newMappedUser.notCalled){
                    newMappedUser.messages = await newMappedUser.messageFunction();
                    newMappedUser.notCalled = false;
                }else{
                    newMappedUser.messages = await newMappedUser.messageFunction();
                }
                console.log('second')
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
    sendMessage = (val)=>{
        this.props.database.ref('messages').push(val)
    }
    addToMessagesRubricMapped = (MU,message) => {
            const users = clone(MU.users)
            if(message.username === "admin" && message.onClient){
                //have to substitute this for genuine ID at some point
                users[message._id].messages[Date.now()+""+Math.random()] = {
                    content: message.content,
                    username: message.username,
                    readMore:message.content.length>140?true:false,
                    _id:Date.now()+(Math.random()),
                    authorId:message._id,
                    name:'admin',
                    type:message.type||'text',
                    mediaUrl:message.mediaUrl||null,
                    received:Date.now()/1000
                }
            const toSend = {
                _id:Date.now()+(Math.random()),
                authorId:message._id,
                name:'admin',
                received:Date.now()/1000,
                text:message.content,
                type:message.type||'text',
                mediaUrl:message.mediaUrl||null
            }
            this.sendMessage(toSend)

            }else if(users[message._id] === undefined){
                console.log(this.props.db.collection('users').doc(message._id));
                     users[message._id] = {
                        userId: message.username,
                        _id: message._id,
                        notCalled:true,
                        messageFunction:this.generate({ref:message._id},message.username),
                        unread:1,
                        active:true,
                        firebaseId:message._id,
                        messages: {
                            [message.id]:{
                            content: message.content,
                            username: message.username,
                            authorId:message._id,
                            readMore:message.content.length>140?true:false,
                            type:message.type,
                            mediaUrl:message.mediaUrl||null
                            }
                        }
                }
            }else if(users[message._id]){
                users[message._id] = {
                    ...users[message._id],
                    unread:users[message._id].unread+1
                }
                users[message._id].messages[message.id] = {
                    content: message.content,
                    username: message.username,
                    authorId:message._id,
                    readMore:message.content.length>140?true:false,
                    type:message.type,
                    mediaUrl:message.mediaUrl||null

                }
            }
            return {users}

        }
    addToMessages = (message) => {
        this.props.reconcileMappedState(this.addToMessagesRubricMapped(this.props.mappedUsers,message))
    }
    generate = (doc,smoochUserId)=>{
    return ()=>{
       return this.props.db.collection('users').doc(doc.ref).collection('messages').get().then(result=>{
            const messages = {}; 
            result.forEach((item) => {
                const messageValue = item.data();
                if(messageValue.text.trim().length>0){
                    messages[item.id] = {
                        content:messageValue.text,
                        username:messageValue.role === "appMaker"?"admin":smoochUserId|| `anonymous : ${messageValue.name||item.id}`,
                        authorId:messageValue.authorId,
                        readMore:messageValue.text.length>140?true:false,
                        type:messageValue.type,
                        mediaUrl:messageValue.mediaUrl||null
                    }
                }
                
                });
            return messages
        });
    }
}
    render() {
        const USER = this.props.mappedUsers.users[this.props.mappedUsers.currentUser];
        const mUserId = this.props.mappedUsers.currentUser;
        const mUser = this.props.mappedUsers.users[mUserId];
        const mUsers = this.props.mappedUsers.users
        return !Object.keys(this.props.mappedUsers.users).length>0?(<Spinner/>):(
            <div className={classes.container}>
                <div className={classes.frame} >
                    <div>
                        <Basic/>
                    </div>
                    <div style={{overflowY:"scroll",boxSizing:"border-box"}}>
                    {USER?Object.keys(this.props.mappedUsers.users).map(
                        (user, index) => {
                            return (
                                <div key={user+Date.now()+Math.random()} style={{ display: 'inline-block', margin: "3px"}}>
                                    <Button style={{boxSizing:"border-box"}}
                                        onClick={() => { 
                                            this.updateCurrentMappedUser(user)
                                            return mUsers[user].notCalled?this.callUsersMapped(user,mUsers[user].userId,null,true):null}}
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
                        }):(<Spinner/>)}
                    </div>
                </div>
                {USER?(<div className={classes.App}>
                    <Chat wipeUnread={this.wipeUnread}
                    wipeUnreadMapped={this.wipeUnreadMapped}
                     newMessage={this.addToMessages}
                     changeReadMore={this.changeReadMore}
                     callUsersMapped={this.callUsersMapped}
                     changeReadMoreMapped = {this.changeReadMoreMapped}
                     currentUser={USER} messages={USER.messages}
                     mUserId={mUserId}
                     db={this.props.db}
                     storage={this.props.storage}
                     mUserIdMessages={mUser.messages} />
                </div>):null}
            </div>
        )
    }
}


const mapStateToProps = state => {
    return {
        mappedUsers:state.mappedUsers,
        db:state.fb.db,
        database:state.fb.database,
        storage:state.fb.storage
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