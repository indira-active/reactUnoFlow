import React,{Component} from "react";
import ChatContainer from "../ChatContainer"
import {Route,Switch,Redirect,withRouter} from "react-router-dom"
import Basic from '../Basic'
import UserList from "../UserList"
import {connect} from "react-redux"
import moment from "moment"

class Layout extends Component {
	state={
	     users:null
	  }	
	componentDidMount(){
		fetch('https://damp-plateau-11898.herokuapp.com/api/loadusers')
        .then(res => res.json())
        .then(load=>{
            const users = load.map(val=>{
              console.log(val,'val')
                return{
                    userId:val.smoochUserId?val.smoochUserId:`anonymous:${val.smoochId}`,
                    _id:val.smoochId,
                    messages:[],
                    notCalled:true,
                    unread:0,
                    date:val.created
                }
            })
            this.props.addUsers(users)
        }).catch(err=>{console.log('err is happening',err)})
	}
    refresh = ()=>{
        fetch('https://damp-plateau-11898.herokuapp.com/api/loadusers')
        .then(res => res.json())
        .then(load=>{
            const users = load.map(val=>{
              console.log(val,'val')
                return{
                    userId:val.smoochUserId?val.smoochUserId:`anonymous:${val.smoochId}`,
                    _id:val.smoochId,
                    messages:[],
                    notCalled:true,
                    unread:0,
                    date:val.created
                }
            })
            this.props.addUsers(users)
        }).catch(err=>{console.log('err is happening',err)})
    }
	render(){
        console.log(this.props.users)
		return this.props.users?( <Switch>
        <Route path="/Chat" render={()=>{return (<ChatContainer refresh={this.refresh} />)}} />
        <Route path="/Users" render={()=>{return (<UserList refresh={this.refresh} />)}} />
        <Route path="/Search" render={()=>{return (<UserList refresh={this.refresh} />)}} />
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
        users: state.users.users
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addUsers: (payload) => dispatch({type:"USERS",payload}),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))