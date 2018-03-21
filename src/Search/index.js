import React,{Component} from "react";
import Modal from '../components/Modal';
import {connect} from "react-redux";
import {withRouter,Link} from "react-router-dom"
import classes from "./index.css"


class Search extends Component {
	state ={
		text:'',
		searchResults:null
	}
	fetchResults = (q)=>{
		fetch(`https://us-central1-unoflow-8ec7e.cloudfunctions.net/searchValues/?q=${q}`).then(res=>res.json()).then(test=>{
			if(test[0].length>0){
				this.setState({searchResults:test[0]})
			}else{
				this.setState({searchResults:test[1]})
			}
		})

	}

	clickHandler = ()=>{
	this.setState({
		text:'',
		searchResults:null
		})
		this.props.modalClosed();
	}
	render(){
		console.log(this.state)
		return(
			<Modal show={this.props.show} modalClosed={this.clickHandler}>
				<form className={classes.form} onSubmit={(event)=>{event.preventDefault()}}>
						<input onChange={(event)=>{this.setState({text:event.target.value})}} value={this.state.text} type="text" style={{width:"100%",height:"100%"}} placeholder='e.g john@gmail.com'/>
						<input onClick={()=>{this.fetchResults(this.state.text)}} type="submit" value='search'/>
				</form> 
				<div className={classes.parent}>
					{this.state.searchResults !== null?(this.state.searchResults.map((val)=>{
						const result = (
						<div className={classes.totalGrid} key={val.objectID}>
							<p style={{display:"inline-block"}}>{val.smoochUserId}</p>
							<Link to='/Chat' onClick={(event)=>{
								event.preventDefault();
								this.props.changeCurrentMappedUser(val.objectID);
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
        users: state.mappedUsers.users,
        db:state.fb.db
    };
}

const mapDispatchToProps = dispatch => {
    return {
        addUsers: () => dispatch({type:"USERS",payload:"something"}),
        changeCurrentMappedUser: (currentUser) => dispatch({type:"MAPPEDCURRENT",payload:currentUser}),
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(Search))
