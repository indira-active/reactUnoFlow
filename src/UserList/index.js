import React, { Component } from 'react';
import Hoc from "./../hoc"
import classes from "./index.css"
import Header from "./../Header"
import {connect} from "react-redux"
import {withRouter} from "react-router"
import moment from "moment"

class UserList extends Component {
   state = {
    users:null,
      currentUser:0,
      left:0,
      right:5,
      tabs:['Home','Search','Chat','Filter','Users']
  }
  setUze = (val,uze)=>{
    let leftVal = Math.abs(this.state.left - val);
    let rightVal = Math.abs(this.state.right - val);
    let left = this.state.left
    let right = this.state.right
    const length = this.state.users.length;
    const amount = [2,1]
    if((leftVal<1 && left>0)||(right<length-1 && rightVal<1)){
      this.setState({
        currentUser:val,
        left:leftVal<2?left -amount[leftVal]:left+amount[rightVal],
        right:rightVal<2?right+amount[rightVal]:right-amount[leftVal]
      })
    }
    else{
      this.setState({
        currentUser:val
      })
    }
  }
  componentDidMount(){
    this.setState({users:this.props.users})
  }
  previous = ()=>{
    let left = this.state.left;
    let right = this.state.right;
    let currentUser = this.state.currentUser;
    if(currentUser>2 && currentUser === left ){
      currentUser = currentUser - 1;
      left = left - 3;
      right = right - 3;
    }else if(this.state.currentUser>0){
      currentUser = currentUser - 1
    }
    this.setState({
      left,right,currentUser
    })
  }
  next = ()=>{
    let left = this.state.left;
    let right = this.state.right;
    let currentUser = this.state.currentUser;
    const length = this.state.users.length;
    if(currentUser<length-1 && currentUser === right ){
      currentUser = currentUser + 1;
      left = left + 3;
      right = right + 3;
    }else if(currentUser<length-1){
      currentUser = currentUser + 1
    }
    this.setState({
      left,right,currentUser
    })
  }

  render() {
     console.log(this.props)
      if(this.state.users)
{

        const uze = this.state.currentUser;
        const length = this.state.users.length;
        const left = this.state.left;
        const right = this.state.right;
        const pages = Array(length/10).fill(null).map((x,y)=>y);
        console.log(this.state)
        return (
          <Hoc>
            <div className={classes.container}>
                <header className={classes['container-header']}>
                    <Header tabs={this.state.tabs}/>
                </header>
              <div className={classes['item-container']}>
                {this.state.users.slice(this.state.currentUser*10,(this.state.currentUser*10)+10).map((x,y)=>{
                 return(
                      <div className={classes.item} key={y+1}>
                         <span className={classes.name}>Name: {`${x.name}`}</span>
                         <div className={classes.userid}>
                           <span> UserId: {y+1} </span>
                           <span style={{marginLeft:"2px"}}> SmoochId:{x.smoochId}</span>
                         </div>
                         <span className={classes.date} >Date entered: {new moment(x.date).format("MMM Do YY")}</span>
                         <button className={classes.button}>Click Me</button>
                      </div>
                      )
              })}
              </div>
            <div className={classes.footer}>
    
              <div className={classes.pagination}>
                <button onClick={this.previous} className={classes.prevPage}>prev</button>
                {pages.slice(left,right+1).map((val,index)=>{
                  const cls = val === uze?"blue":'';
                  return (              
                  <button 
                    key={index} 
                    className={`${classes[cls]?classes[cls]:''}`}
                    onClick={()=>{this.setUze(val,uze)}}>{val}</button>
                  )
                })}
                <button onClick={this.next} className={classes.nextPage}>next</button>
              </div>

             {/* <div className={classes.footerContent}>
               footer content here
              </div>*/}
            </div>
            </div>
          </Hoc>
        );
}else{
    return (<h1>loading...</h1>)
}

  }
}

const mapStateToProps = state => {
    return {
        usrs: state.users.users
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addUsers: () => dispatch({type:"USERS",payload:"something"}),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(UserList));
