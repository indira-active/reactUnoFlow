import React from "react";
import {Link} from "react-router-dom"
import Hoc from "./../hoc"
import Center from "../CenterChat"


const basic = (props)=>{
	return(
    <Hoc>
        <Link to="/Users">
        <button style={{width:"100px"}}>
        Users 
        </button>
        </Link>
        <br/>
        <Link to="/Chat">
        <button style={{width:"100px"}}>
        Chat
        </button>
        </Link>
        <br/>
        <button style={{color:'#337ab7',width:"100px"}} onClick={props.reset}>reset users</button>
        <br/>   
        <Center style={{color:'#337ab7',width:"100px"}}/>          
    </Hoc>
		)
}

export default basic