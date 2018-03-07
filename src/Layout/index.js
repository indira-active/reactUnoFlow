import React,{Component} from "react";
import ChatContainer from "../ChatContainer"
import {Route,Switch,Redirect,withRouter} from "react-router-dom"
import Basic from '../Basic'
import UserList from "../UserList"
import {connect} from "react-redux"
import moment from "moment"
import clone from "clone"

class Layout extends Component {
	state={
	     users:null
	  }	
	componentDidMount(){
		this.start(true);
	}
    start = (start)=>{
        fetch('https://damp-plateau-11898.herokuapp.com/api/loadusers')
        .then(res => res.json())
        .then(load=>{
            const mappedUsers = {}
            const users = load.map(val=>{
                mappedUsers[val.smoochId] = {
                    userId:val.smoochUserId?val.smoochUserId:`anonymous:${val.smoochId}`,
                    messages:{},
                    active:true,
                    notCalled:true,
                    unread:0,
                    date:val.created
                }
                return{
                    userId:val.smoochUserId?val.smoochUserId:`anonymous:${val.smoochId}`,
                    _id:val.smoochId,
                    messages:[],
                    notCalled:true,
                    unread:0,
                    date:val.created
                }
            })
            if(start){
            const right = Math.floor(users.length/10)>5?5:Math.floor(users.length/10);
            this.props.reconcileMappedState({users:mappedUsers,right,quotient:right,userAmount:Math.floor(users.length/10)})
            this.props.reconcileState({right,quotient:right,userAmount:Math.floor(users.length/10)})
            this.props.addUsers(users)
            }else{
                const quotient = Math.floor(users.length/10)>5?5:Math.floor(users.length/10);
                const userAmount = Math.floor(users.length/10);
                const newUsers = clone(mappedUsers);
                this.props.reconcileMappedState({users:newUsers,quotient,userAmount})
            }
           
        }).catch(err=>{console.log('err is happening',err)})
    }
    refresh = ()=>{
        console.log('refreshing baby')
        this.start();
    }
	render(){
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
        users: state.users.users,
        currentPage:state.users.currentPage,
        left:state.users.left,
        right:state.users.right,
        mappedUsers:state.mappedUsers.users
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addUsers: (payload) => dispatch({type:"USERS",payload}),
        reconcileState:(payload)=>dispatch({type:"CHANGEPAGEVALUES",payload}),
        reconcileMappedState:(payload)=>dispatch({type:"CHANGEMAPPEDVALUES",payload})
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Layout))