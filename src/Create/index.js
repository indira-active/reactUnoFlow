import React,{Component} from "react";
import classes from "./index.css"

class Create extends Component {
	state ={
		text:"",
		newProperty:'',
		properties:[]
	}
	changeProp=(e,indexValue)=>{
		this.setState({properties:this.state.properties.map((val,index)=>{
			if (index === indexValue){
			 return {...val,content:e.target.value}
			}else{return val}
		})})
	}
	postNewUser = ()=>{
		fetch(`https://damp-plateau-11898.herokuapp.com/api/newUser?${this.state.properties.map(val=>{return `${val.name}=${val.content}`}).join('')}`, {
            method: 'POST',
            body: JSON.stringify({userId:this.state.text}), 
            headers: new Headers({
              'Content-Type': 'application/json'
            })
          }).then(res => res.json())
          .catch(error => console.error('Error:', error))
          .then(response => {
                console.log(response)
          });
	}
	render(){
		return(

			<form style={{padding:"40px",borderStyle:"solid",borderColor:"black",borderWidth:"5px"}} onSubmit={(e)=>{e.preventDefault();this.postNewUser()}}>
				<input onChange={(e)=>{this.setState({text:e.target.value})}} className={classes.block} name="userId" value={this.state.text} type="text"/>
				<input onChange={(e)=>{this.setState({newProperty:e.target.value})}} className={classes.block} name="newProperty" type="text" placeholder="new property" value={this.state.newProperty}/>
				{this.state.properties?this.state.properties.map((val,index)=>{
					return (<div>
						<label htmlFor={val.name}>{val.name}</label>
						<input name={val.name} key={index} className={classes.block} type="text" onChange={(e)=>{this.changeProp(e,index)}} value={val.content} placeholder={val.name}/>
					</div>)
				}):null}

				<button onClick={()=>{this.setState({properties:this.state.properties.concat({name:this.state.newProperty,content:''})})}}>+</button>
				<br/>
				<br/>
				<button type="submit">submit</button>
			</form>

			)
	}
}

	
export default Create