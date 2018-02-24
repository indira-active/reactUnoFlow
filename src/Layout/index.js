import React,{Component} from "react";
import ChatContainer from "../ChatContainer"
import "./index.css"
import {Route,Switch,Redirect} from "react-router-dom"
import Basic from '../Basic'
import UserList from "../UserList"

class Layout extends Component {
state={
	     users:Array(1000).fill('x').map((val,index)=>{
	       return {
	        name:"test"+(index+1),
	        userId:"test"+(index+1),
	        smoochId:index+1,
	        date:new Date()
	      }
	    })
	  }	
	render(){
		return(
      <Switch>
        <Route path="/Users" render={()=>{return (<UserList users={this.state.users}/>)}} />
        <Route path="/Filter" render={()=>{return (<UserList users={this.state.users}/>)}} />
        <Route path="/Search" render={()=>{return (<UserList users={this.state.users}/>)}} />
        <Route path="/Home" render={()=>{return (<UserList users={this.state.users}/>)}} />
        <Route path="/Chat" component={ChatContainer} />
        <Route path="/" exact component={Basic} />
        <Redirect to="/" />
      </Switch>
			)
	}
}

	
export default Layout