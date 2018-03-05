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
    this.props.reconcileState({currentPage:val});
  }
  changeShow = ()=>{
    this.setState({show:!this.state.show})
  }
/*componentDidMount(){
        if(this.props.users.length>1){
               const right = Math.floor(this.props.users.length/10)>5?5:Math.floor(this.props.users.length/10);
              this.setState({tabs:['Home','Search','Chat','Users'],currentPage:0,users:[...this.props.users],left:0,right,quotient:right,userAmount:Math.floor(this.props.users.length/10)})
            }else{
            this.props.refresh();
            setTimeout(() => {
                const right = Math.floor(this.props.users.length/10)>5?5:Math.floor(this.props.users.length/10);
                this.setState({tabs:['Home','Search','Chat','Users'],currentPage:0,users:[...this.props.users],left:0,right,quotient:right,userAmount:Math.floor(this.props.users.length/10)})
            },300)
    }
  }
  componentDidUpdate(nextProps,nextState){
        if(nextProps.users.length>1 && this.props.users.length <1){
            const right = Math.floor(this.props.users.length/10)>5?5:Math.floor(this.props.users.length/10);
              this.setState({tabs:['Home','Search','Chat','Users'],currentPage:0,users:[...this.props.users],left:0,right,quotient:right,userAmount:Math.floor(this.props.users.length/10)})
        }
    }*/
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
    this.props.reconcileState({
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
    this.props.reconcileState({
      left,right,currentPage
    })
  }

  render() {
     console.log(this.props)
      if(this.props.users.length > 0){

          const uze = this.props.currentPage;
          const length = this.props.users.length;
          const left = Math.min(this.props.left,this.props.right-this.props.quotient);
          const right = this.props.right;
          const pages = Array(Math.floor(length/10)).fill(null).map((x,y)=>y);
          console.log(this.props)
          return (
            <Hoc>
            <Search show={this.props.show} modalClosed={this.changeShow}/>
              <div className={classes.container}>
                  <header className={classes['container-header']}>
                      <Header changeShow={this.changeShow} tabs={this.props.tabs}/>
                  </header>
                <div className={classes['item-container']}>
                  {this.props.users.map((element,index)=>{return {...element,index}}).slice(this.props.currentPage*10,(this.props.currentPage*10)+10).map((x,y)=>{
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
                })}
                </div>
              <div className={classes.footer}>
      
                <div className={classes.pagination}>
                  <button onClick={this.previous} className={classes.prevPage}>prev</button>
                  {pages.slice(left,right+1).map((val,index)=>{
                    return (              
                    <button 
                      key={index} 
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
        users: state.users.users,
        currentUser:state.users.currentUser,
        currentPage:state.users.currentPage,
        left:state.users.left,
        right:state.users.right,
        tabs:state.users.tabs
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addUsers: () => dispatch({type:"USERS",payload:"something"}),
        changeCurrentUser: (currentUser) => dispatch({type:"CURRENT",payload:currentUser}),
        reconcileState:(payload)=>dispatch({type:"CHANGEPAGEVALUES",payload})
        reconcileMappedState:(payload)=>dispatch({type:"CHANGEMAPPEDVALUES",payload})

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserList));
