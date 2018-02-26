import React,{Component} from "react";
import ChatContainer from "../ChatContainer"
import "./index.css"
import {Route,Switch,Redirect,withRouter} from "react-router-dom"
import Basic from '../Basic'
import UserList from "../UserList"
import {connect} from "react-redux"
import moment from "moment"

class Layout extends Component {
	state={
	     users:Array(1000).fill('x').map((val,index)=>{
	       return {
	        name:"test"+(index+1),
	        userId:"test"+(index+1),
	        smoochId:index+1,
	        date:new Date(),
	        notCalled:true,
          unread:0
	      }
	    })
	  }	
	componentDidMount(){
		fetch('https://damp-plateau-11898.herokuapp.com/api/loadusers')
        .then(res => res.json())
        .then(load=>{

            const users = load.map(val=>{
                return{
                    userId:val.smoochUserId,
                    _id:val.smoochId,
                    messages:[],
                    notCalled:true,
                    unread:0
                }
            })
           this.props.addUsers(users)
        }).catch(err=>{console.log('err is happening',err)});
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

	
const mapStateToProps = state => {
    return {
        users: state.users.users
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addUsers: (payload) => dispatch({type:"USERS",payload}),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))