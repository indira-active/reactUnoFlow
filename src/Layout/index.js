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
import * as firebase from "firebase";
import 'firebase/firestore'




class Layout extends Component {
	state={
	     users:null
	  }	
	componentDidMount = async ()=>{
        const  config = {
        apiKey: "AIzaSyCTIb6X9HY1NCOngIP2T1IGFvdN71ZCY4E",
        authDomain: "unoflow-8ec7e.firebaseapp.com",
        databaseURL: "https://unoflow-8ec7e.firebaseio.com",
        projectId: "unoflow-8ec7e",
        storageBucket: "unoflow-8ec7e.appspot.com",
        messagingSenderId: "245726400419"
        };
        firebase.initializeApp(config);
          const auth = firebase.auth();
          const database = firebase.database();
          const storage = firebase.storage();
          const db = firebase.firestore();
          const messaging = firebase.messaging();
          this.props.reconcileFirebase({auth,database,storage,firebase,db,messaging});
		this.start(db)
	}
    start = (db)=>{
            const mappedUsers = {};

                db.collection("users").where("active", "==", true).orderBy('created','desc')
                    .get()
                    .then((querySnapshot)=>{
                        querySnapshot.forEach((doc)=>{
                            const values = doc.data();
                            const smoochId = values.smoochId;
                                mappedUsers[smoochId] = {
                                userId:values.smoochUserId?values.smoochUserId:`anonymous:${smoochId}`,
                                firebaseId:doc.id,
                                messages:{},
                                active:true,
                                notCalled:true,
                                unread:0,
                                date:values.created
                            }
                        });
                                if(db){
                            const right = Math.floor(Object.keys(mappedUsers).length/10)>5?5:Math.floor(Object.keys(mappedUsers).length/10);
                            this.props.reconcileMappedState({users:mappedUsers,right,quotient:right,userAmount:Math.floor(Object.keys(mappedUsers).length/10)})
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
    refresh = ()=>{
        console.log('refreshing baby')
        this.start(this.props.firebase.db);
    }
	render(){
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