import React, { Component } from 'react';
import Hoc from "./../hoc"
import classes from "./index.css"
import Header from "./../Header"
import {connect} from "react-redux"
import {withRouter} from "react-router"
import moment from "moment"
import {Link} from "react-router-dom"
import Spinner from "../components/Spinner";
import Search from "../Search"


class UserList extends Component {
   state = {
    show:false
  }
  setUze = (val)=>{
    this.props.reconcileMappedState({currentPage:val});
  }
  changeShow = ()=>{
    this.setState({show:!this.state.show})
  }
  changeCurrentUser = (x)=>{
    this.props.changeCurrentMappedUser(x)
  }

  next = ()=>{
    let left = this.props.left;
    let right = this.props.right;
    const quotient = this.props.quotient;
    let currentPage = this.props.currentPage;
    const length = this.props.users.length;
    const userAmount = this.props.userAmount;
    if(currentPage==right && right-left>=quotient && right<(userAmount-1)){
      currentPage = currentPage + 1;
      right = right +1;
      left = right - quotient;
    }else if(currentPage<right){
      currentPage = currentPage + 1
    }
    this.props.reconcileMappedState({
      left,right,currentPage
    })
  }
   previous = ()=>{
    let left = this.props.left;
    let right = this.props.right;
    const quotient = this.props.quotient;
    let currentPage = this.props.currentPage;
    const length = this.props.users.length;
    const userAmount = this.props.userAmount;
    if(currentPage==left && left>0 && quotient>4){
      currentPage = currentPage - 1;
      right = right -1;
      left = right - quotient;
    }else if(currentPage>left){
      currentPage = currentPage - 1
    }
    this.props.reconcileMappedState({
      left,right,currentPage
    })
  }

  render() {
    const unWound = this.props.users;
    console.log(this.props);
      if(unWound.length > 0){
          const MU = this.props.mappedUsers;
          const uze = this.props.currentPage;
          const length = unWound.length;
          const left = Math.min(this.props.left,this.props.right-this.props.quotient);
          const right = this.props.right;
          const pages = Array(Math.floor(length/10)).fill(null).map((x,y)=>y);
          /*{this.props.users.map((element,index)=>{return {...element,index}}).slice(this.props.currentPage*10,(this.props.currentPage*10)+10).map((x,y)=>{
                   return(
                        <div className={classes.item} key={y+1}>
                           <div className={classes.userid+' '+' '+classes.all}>
                             <div>{x.userId} </div>
                             <div style={{marginLeft:"2px"}}>{x._id}</div>
                           </div>
                           <span className={classes.date+' '+classes.all} >Date entered: {new moment(x.date).format("MMM Do YY")}</span>
                           <Link to='/Chat' onClick={(e)=>{e.preventDefault();this.props.changeCurrentUser(x.index);this.props.history.push('/Chat')}} className={classes.button+' '+classes.all} >Chat</Link>
                        </div>
                        )
                })}*/
          return (
            <Hoc>
            <Search show={this.state.show} modalClosed={this.changeShow}/>
              <div className={classes.container}>
                  <header className={classes['container-header']}>
                      <Header changeShow={this.changeShow} tabs={this.props.tabs}/>
                  </header>
                <div className={classes['item-container']}>
                  {unWound.slice(this.props.currentPage*10,(this.props.currentPage*10)+10).map((x,y)=>{
                   return(
                        <div className={classes.item} key={x}>
                           <div className={classes.userid+' '+' '+classes.all}>
                             <div>{MU[x].userId} </div>
                             <div style={{marginLeft:"2px"}}>{x}</div>
                           </div>
                           <span className={classes.date+' '+classes.all} >Date entered: {new moment(MU[x].date).format("MMM Do YY")}</span>
                           <Link to='/Chat' onClick={(e)=>{e.preventDefault();this.changeCurrentUser(x);this.props.history.push('/Chat')}} className={classes.button+' '+classes.all} >Chat</Link>
                        </div>
                        )
                })}
                </div>
              <div className={classes.footer}>
      
                <div className={classes.pagination}>
                  <button onClick={this.previous} className={classes.prevPage}>prev</button>
                  {pages.slice(left,right+1).map((val,index)=>{
                    return (              
                    <button 
                      key={val} 
                      style={{backgroundColor:val===uze?'aquamarine':''}}
                      onClick={()=>{this.setUze(val)}}>{val+1}</button>
                    )
                  })}
                  <button onClick={this.next} className={classes.nextPage}>next</button>
                </div>
              </div>
              </div>
            </Hoc>
          );
      }
    else{
          return (<Spinner/>)
      }

  }
}

const mapStateToProps = state => {
    return {
        users: Object.keys(state.mappedUsers.users),
        quotient:state.mappedUsers.quotient,
        currentUser:state.mappedUsers.currentUser,
        currentPage:state.mappedUsers.currentPage,
        userAmount:state.mappedUsers.userAmount,
        left:state.mappedUsers.left,
        right:state.mappedUsers.right,
        tabs:state.mappedUsers.tabs,
        mappedUsers:state.mappedUsers.users
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addUsers: () => dispatch({type:"USERS",payload:"something"}),
        changeCurrentUser: (currentUser) => dispatch({type:"CURRENT",payload:currentUser}),
        reconcileState:(payload)=>dispatch({type:"CHANGEPAGEVALUES",payload}),
        reconcileMappedState:(payload)=>dispatch({type:"CHANGEMAPPEDVALUES",payload}),
        changeCurrentMappedUser: (currentUser) => dispatch({type:"MAPPEDCURRENT",payload:currentUser}),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserList));
