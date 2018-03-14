import React,{Component} from "react";
import classes from "./index.css"
import {withRouter,Link} from "react-router-dom"
import { connect } from 'react-redux';

class Center extends Component {
	state ={
		text:"",
		loggedIn:false,
		promises:[]
	}


	componentDidMount = ()=>{
		if(this.props.fb.auth && this.props.fb.auth.currentUser && this.props.fb.auth.currentUser.displayName){
					this.subscribe()
				}else{
			setTimeout(() => {
			  	this.subscribe()
			}, 100)
		}
	}

	componentWillUnmount = ()=>{
		this.state.promises.forEach(x=>x())
	}

	subscribe = ()=>{
			const promise = this.props.fb.auth.onAuthStateChanged((user)=>{
									if(user){
										this.setState({loggedIn:true})
										return
									}else{
										this.signOut()
									}
							})
			this.setState({promises:this.state.promises.concat(promise)})
	}

	componentDidUpdate = ()=>{
				if(this.props.fb.auth && this.props.fb.auth.currentUser && this.props.fb.auth.currentUser.displayName && !this.state.loggedIn){
							this.setState({loggedIn:true})
				}
	}

	signIn = ()=>{
  	const provider = new this.props.fb.firebase.auth.GoogleAuthProvider();
		provider.addScope('profile');
		provider.addScope('email');
		this.props.fb.auth.signInWithPopup(provider).then(function(result) {
			console.log('result is',result)
		});
	}

	signOut = ()=>{
		  this.props.fb.auth.signOut().then((suc)=>{
 			 		console.log(suc)
 			 		this.setState({loggedIn:false})
			}).catch(function(error) {
				console.log(error)			});
	}



	render(){
		return(

<div className={classes.App}>

  <header className="">
    <div className={`${classes.mdc}`}>
      <div style={{padding:"0px",margin:"0px", display:"grid",gridTemplateRows:"80% 10%"}}>
        <h3> Indira UnoChat</h3>
        <br/>
        <Link to="/Home">Home</Link>
      </div>
      <div style={{textAlign:"right"}} id="user-container">
        <div hidden id="user-pic"></div>
        <div hidden id="user-name"></div>
        <button onClick={()=>this.signOut()} hidden={!this.state.loggedIn} >
          Sign-out
        </button>
        <button hidden={this.state.loggedIn} onClick={()=>{this.signIn()}}id="sign-in" className="mdl-button mdl-js-button mdl-js-ripple-effect mdl-color-text--white">
         Sign-in with Google
        </button>
      </div>
    </div>
  </header>

  <div >
  
		    <div className={classes.input}>
		    	<input value={this.state.text} onChange={(e)=>{this.setState({text:e.target.value})}}/>
		    		 <button id="submit" type="submit">
		              Send
		         </button>
		    </div>
		    		 
  </div>
  <button onClick={()=>this.renderMessages()}>
  	renderMessages
  </button>
</div>



			)
	}
}

const mapStateToProps = state => {
    return {
        fb:state.fb
    };
}

const mapDispatchToProps = dispatch => {
    return {
        reconcileFirebase:(payload)=>dispatch({type:"FIRERECONCILE",payload})
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Center))

/*		renderMessages = ()=>{
	  // Reference to the /messages/ database path.
	  const that = this.props.fb.firebase;
	  const database = this.props.fb.database
	  const messagesRef = database.ref('users');
	  console.log(messagesRef);
	  // Make sure we remove all previous listeners.
	  messagesRef.off();

	  // Loads the last 12 messages and listen for new ones.
	  const setMessage = (data)=>{
	    //const val = data.val();
	    this.displayMessage(data.val());
	  };
	  messagesRef.limitToLast(12).on('child_added', setMessage);
	  messagesRef.limitToLast(12).on('child_changed', setMessage);
	}
	displayMessage = (data)=>{
		console.log(JSON.stringify(data))
	}

	saveMessage = ()=>{
    const currentUser = this.props.fb.auth.currentUser;
    this.messagesRef.push({
      name: currentUser.displayName,
      text: this.messageInput.value,
      photoUrl: currentUser.photoURL || '/images/profile_placeholder.png'
    }).then(()=>{
      
    }).catch((error)=>{
      console.error('Error writing new message to Firebase Database', error);
    });
};*/