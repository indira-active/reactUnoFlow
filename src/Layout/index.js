
import React,{Component} from "react";
import ChatContainer from "../ChatContainer"
import {Route,Switch,Redirect,withRouter} from "react-router-dom"
import Basic from '../Basic'
import UserList from "../UserList"
import Upload from "../Upload"
import Create from "../Create"
import Center from "../CenterChat"


import {connect} from "react-redux"
import clone from "clone"
import * as firebaseInstance from "firebase";
import 'firebase/firestore'
import 'firebase/messaging'

class Layout extends Component {

	componentDidMount = ()=>{
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
          messaging.usePublicVapidKey("BBsxfwngNGxcm-lCfiZ6y-SD5oGAlTEzmua0SCqiDgFiWjDFZKSV3hdnZBrsz87_vN7Y5mY9G8FoMckgLefoIZ0");
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
           messaging.onTokenRefresh(()=>{
              messaging.getToken()
              .then((refreshedToken)=>{
                console.log('Token refreshed.');
                this.setTokenSentToServer(false);
                this.sendTokenToServer(refreshedToken);
              })
              .catch((err)=>{
                console.log('Unable to retrieve refreshed token ', err);
              });
            });
          this.props.reconcileFirebase({auth,database,storage,firebase:firebaseInstance,db,messaging});
          this.start(db)
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
    		return this.props.mappedUsers?( <Switch>
            <Route path="/Chat" render={()=>{return (<ChatContainer refresh={this.refresh} />)}} />
            <Route path="/Users" render={()=>{return (<UserList refresh={this.refresh} />)}} />
            <Route path="/Search" render={()=>{return (<UserList refresh={this.refresh} />)}} />
            <Route path="/Center" component={Center} />
            <Route path="/Upload" component={Upload} />
            <Route path="/Create" component={Create} />
            <Route path="/" exact component={Basic} />
            <Redirect to="/" />
          </Switch>):(<Switch>
            <Route path="/" exact component={Basic} />
            <Redirect to="/" />
          </Switch>)
    	}
}

	
const mapStateToProps = state => {
    return {
        state,
        mappedUsers:state.mappedUsers.users,
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

//initial load 

/*            const mappedUsers = {};
            fetch('https://damp-plateau-11898.herokuapp.com/api/loadusersall')
        .then(res => res.json())
        .then(load=>{
            load.forEach(val=>{
                db.collection("users").doc(val.smoochId).set({
                    smoochUserId:val.smoochUserId,
                    active:true,
                    notCalled:true,
                    unread:0,
                    created:val.created
                });
            })
        });
        db.collection('users').get().then(snapshot=>{
      snapshot.forEach(doc => {
          console.log(doc.data())
            if(!doc.data().smoochUserId){
              doc.ref.delete();
            }
        });
    })*/

//TOTAL LOAD 

/*                db.collection("users").where("active", "==", true).orderBy('created','desc')
                    .get()
                    .then((querySnapshot)=>{
                        querySnapshot.forEach((doc)=>{
                            doc.ref.collection('messages').get().then(result=>{
                                const messages = {}; 
                                const values = doc.data();
                                result.forEach((item) => {
                                    const messageValue = item.data();
                                    messages[item.id] = {
                                        content:messageValue.text,
                                        username:messageValue.role === "appMaker"?"admin":values.smoochUserId|| `anonymous : ${values.smoochUserId||item.id}`,
                                        authorId:messageValue.authorId,
                                        readMore:messageValue.text.length>140?true:false
                                    }
                                })
                                    
                                    mappedUsers[doc.id] = {
                                    userId:values.smoochUserId,
                                    firebaseId:doc.id,
                                    messages,
                                    active:true,
                                    notCalled:true,
                                    unread:0,
                                    date:values.created
                                }
                            })
                        });*/

/*        let unsubscribe = null
        if(snap){
            unsubscribe = doc.ref.collection('messages').onSnapshot(async (test)=>{
                const mappedUsers = clone({...this.props.users});
                const newMappedUser = mappedUsers[smoochUserId];
                if(newMappedUser){
                    if(typeof newMappedUser.unsubscribe === 'function'){
                        newMappedUser.unsubscribe();
                    }
                    newMappedUser.unsubscribe = unsubscribe
                    newMappedUser.messages = await newMappedUser.messageFunction();
                    this.props.reconcileMappedState({users:mappedUsers})
                }
                    
            })
        }*/