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

      <div style={this.props.style}>
        <button style={{width:"100%"}} onClick={()=>this.signOut()} hidden={!this.state.loggedIn} >
          Sign-out
        </button>
        <button style={{width:"100%"}} hidden={this.state.loggedIn} onClick={()=>{this.signIn()}}>
         Sign-in with Google
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

export default connect(mapStateToProps, mapDispatchToProps)(Center)
