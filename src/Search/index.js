import React,{Component} from "react";
import Modal from '../components/Modal';
import {connect} from "react-redux";
import {withRouter,Link} from "react-router-dom"
import classes from "./index.css"


class Search extends Component {
	state ={
		text:'',
		searchResults:null,
		filter:"userId"
	}
	fetchResults = (q)=>{
		fetch('https://damp-plateau-11898.herokuapp.com/api/search?q='+q)
        .then(res => res.json())
        .then(load=>{
            this.setState({searchResults:load})
        }).catch(err=>{console.log('err is happening',err)})

	}

	clickHandler = ()=>{
	this.setState({
		text:'',
		searchResults:null
		})
		this.props.modalClosed();
	}
	render(){
		return(
			<Modal show={this.props.show} modalClosed={this.clickHandler}>
				<form className={classes.form} onSubmit={(event)=>{event.preventDefault()}}>
						<input onChange={(event)=>{this.setState({text:event.target.value})}} value={this.state.text} type="text" style={{width:"100%",height:"100%"}} placeholder='e.g john@gmail.com'/>
						<input onClick={()=>{this.fetchResults(this.state.text)}} type="submit" value='search'/>
				</form> 
					<div>{['date','userId'].map((value,index)=>(
						<button 
							onClick={()=>{this.setState({filter:value})}}
							key={index}
							className={this.state.filter === value?`${classes[value]} ${classes.active}`:classes[value]}>
							{value}
						</button>))}
					</div>
				<div className={classes.parent}>
					{this.state.searchResults !== null?(this.state.searchResults.map((val,index)=>{
						const result = (
						<div className={classes.totalGrid} key={val.smoochId}>
							<p style={{display:"inline-block"}}>{val.smoochUserId}</p>
							<Link to='/Chat' onClick={(event)=>{
								event.preventDefault();
								this.props.changeCurrentUser(val.smoochId);
								this.props.history.push('/Chat')}}>chat</Link>
						</div>)
						return result
					})):null}
				</div>
					
			</Modal>

			)
	}
}
const mapStateToProps = state => {
    return {
        users: state.users.users,
        currentUser:state.users.currentUser
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addUsers: () => dispatch({type:"USERS",payload:"something"}),
        changeCurrentUser: (currentUser) => dispatch({type:"CURRENT",payload:currentUser}),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search))
