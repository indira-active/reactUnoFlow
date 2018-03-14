
import React,{Component} from "react";
import ChatContainer from "../ChatContainer"
import {Route,Switch,Redirect,withRouter} from "react-router-dom"
import Basic from '../Basic'
import UserList from "../UserList"
import Upload from "../Upload"
import Create from "../Create"
import Center from "../CenterChat"
import Spinner from "../components/Spinner"


import {connect} from "react-redux"
import clone from "clone"
import * as firebaseInstance from "firebase";
import 'firebase/firestore'
import 'firebase/messaging'

class Layout extends Component {
  state={on:false}

	componentDidMount = ()=>{
    //this time out is just a quick fix, I have to adress some of these delay issues
    setTimeout(() => {
      this.setState({
        on:true
      })
    }, 2000)
        const  config = {
        apiKey: "AIzaSyCTIb6X9HY1NCOngIP2T1IGFvdN71ZCY4E",
        authDomain: "unoflow-8ec7e.firebaseapp.com",
        databaseURL: "https://unoflow-8ec7e.firebaseio.com",
        projectId: "unoflow-8ec7e",
        storageBucket: "unoflow-8ec7e.appspot.com",
        messagingSenderId: "245726400419"
        };

        firebaseInstance.initializeApp(config);
          const auth = firebaseInstance.auth();
          const database = firebaseInstance.database();
          const storage = firebaseInstance.storage();
          const db = firebaseInstance.firestore();
          const messaging = window.firebase.messaging();
          messaging.usePublicVapidKey("BM_9wvZamRDP85vHJHAOUUErAftjGChTQ-nP9TgC6aquy9lmvrHmcfFgWzQR8bMt8w5XF028ZieqtNnBcXnmXOU");
          const request = ()=>{
            messaging.requestPermission().then(function(messaging){
                  console.log('Notification permission granted.');
                  messaging.getToken()
                          .then(function(currentToken){
                            if (currentToken) {
                              this.sendTokenToServer.bind(this)(currentToken);
                            } else {
                              // Show permission request.
                              console.log('No Instance ID token available. Request permission to generate one.');
                              // Show permission UI.
                              this.setTokenSentToServer(false);
                            }
                          }.bind(this))
                          .catch(function(err){
                            console.log('An error occurred while retrieving token. ', err);
                            this.setTokenSentToServer(false);
                          }.bind(this));
                }.bind(this,messaging))
                .catch((err)=>{
                  console.log('Unable to get permission to notify.', err);
                })
          }
          request();
           messaging.onTokenRefresh(()=>{
              messaging.getToken()
              .then((refreshedToken)=>{
                console.log('Token refreshed.');
                this.setTokenSentToServer(false);
                this.sendTokenToServer(refreshedToken);
              })
              .catch((err)=>{
                request();
                console.log('Unable to retrieve refreshed token ', err);
              });
            });
           messaging.onMessage((payload)=>{
            console.log("Message received. ", payload);
          });
          this.start(db);
          this.props.reconcileFirebase({auth,database,storage,firebase:firebaseInstance,db,messaging});
    }

        sendTokenToServer = (currentToken)=>{
            const roll = setInterval(() => {
              if(this.props.firebase){
                clearInterval(roll)
                const database = this.props.firebase.database;
                const auth = this.props.firebase.auth;
              if (!this.isTokenSentToServer()) {
                      console.log('Sending token to server...');
                      if(!auth.currentUser){
                        this.signIn().then(result=>{
                            database.ref('/fcmTokens').child(currentToken)
                              .set(auth.currentUser.uid);
                            this.setTokenSentToServer(true);
                        })
                      }else{
                        database.ref('/fcmTokens').child(currentToken)
                              .set(auth.currentUser.uid);
                            this.setTokenSentToServer(true);
                      }

                    } else {
                      console.log('Token already sent to server so won\'t send it again ' +
                          'unless it changes');
                    }
              }
            }, 20)
            
                    
}
       signIn = ()=>{
            const provider = new this.props.firebase.firebase.auth.GoogleAuthProvider();
                provider.addScope('profile');
                provider.addScope('email');
                return this.props.firebase.auth.signInWithPopup(provider)
        }

        setTokenSentToServer = (sent)=>{
            window.localStorage.setItem('sentToServer', sent ? 1 : 0);
          }

        isTokenSentToServer = ()=>{
            return window.localStorage.getItem('sentToServer') === 1;
          }

         start = (db)=>{
            const mappedUsers = {};
                db.collection("users").where("active", "==", true).orderBy('created','desc')
                    .get()
                    .then(async querySnapshot =>{
                        querySnapshot.forEach((doc)=>{
                                const values = doc.data();
                                    mappedUsers[doc.id] = {
                                    userId:values.smoochUserId,
                                    firebaseId:doc.id,
                                    messages:this.generate(doc,values.smoochUserId,true),
                                    messageFunction:this.generate(doc,values.smoochUserId),
                                    active:true,
                                    notCalled:true,
                                    unread:0,
                                    date:values.created
                                }
                        });
                                if(db){
                            const right = Math.floor(Object.keys(mappedUsers).length/10)>5?5:Math.floor(Object.keys(mappedUsers).length/10);
                            if(mappedUsers[Object.keys(mappedUsers)[0]].notCalled){
                                mappedUsers[Object.keys(mappedUsers)[0]].messages = await mappedUsers[Object.keys(mappedUsers)[0]].messages();
                                mappedUsers[Object.keys(mappedUsers)[0]].notCalled = false;
                            }
                            this.props.reconcileMappedState({currentUser:Object.keys(mappedUsers)[0],users:mappedUsers,right,quotient:right,userAmount:Math.floor(Object.keys(mappedUsers).length/10)})
                            }else{
                                const quotient = Math.floor(Object.keys(mappedUsers).length/10)>5?5:Math.floor(Object.keys(mappedUsers).length/10);
                                const userAmount = Math.floor(Object.keys(mappedUsers).length/10);
                                const newUsers = clone(mappedUsers);
                                this.props.reconcileMappedState({users:newUsers,quotient,userAmount})
                            }
    
                    })
                    .catch(function(error) {
                        console.log("Error getting documents: ", error);
                    });


            }

        generate = (doc,smoochUserId,snap)=>{
            return ()=>{
                   return doc.ref.collection('messages').get().then(result=>{
                        const messages = {}; 
                        result.forEach((item) => {
                            const messageValue = item.data();
                            if(messageValue.text.trim().length>0){
                                messages[item.id] = {
                                    content:messageValue.text,
                                    username:messageValue.role === "appMaker"?"admin":smoochUserId|| `anonymous : ${smoochUserId||item.id}`,
                                    authorId:messageValue.authorId,
                                    readMore:messageValue.text.length>140?true:false
                                }
                            }
                            
                        });
                    return messages
                });
            }
          }

        refresh = ()=>{
            console.log('refreshing baby')
            this.start(this.props.firebase.db);
        }
    	render(){
            console.log('state--------------\n',this.props.state,'\n--------------')
    		return this.state.on?( <Switch>
            <Route path="/Chat" render={()=>{return (<ChatContainer refresh={this.refresh} />)}} />
            <Route path="/Users" render={()=>{return (<UserList refresh={this.refresh} />)}} />
            <Route path="/Search" render={()=>{return (<UserList refresh={this.refresh} />)}} />
            <Route path="/Center" component={Center} />
            <Route path="/Upload" component={Upload} />
            <Route path="/Create" component={Create} />
            <Route path="/" component={Basic} />
            <Redirect to="/" />
          </Switch>):(<Spinner/>)
    	}
}

	
const mapStateToProps = state => {
    return {
        state,
        mappedUsers:state.mappedUsers.users,
        currentUser:state.mappedUsers.currentUser,
        firebase:state.fb
    };
}

const mapDispatchToProps = dispatch => {
    return {
        reconcileFirebase:(payload)=>dispatch({type:"FIRERECONCILE",payload}),
        reconcileMappedState:(payload)=>dispatch({type:"CHANGEMAPPEDVALUES",payload})
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))

