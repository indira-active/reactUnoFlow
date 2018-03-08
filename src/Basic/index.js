import React from "react";
import {Link} from "react-router-dom"
import Hoc from "./../hoc"


const basic = (props)=>{
	return(
    <Hoc>
        <h1 style={{textAlign:"center",fontSize:"50px"}}>
        select what you want to do below!
        </h1>
        <Link to="/Users">
        <h2 style={{margin:"50px",fontSize:"40px"}}>
        Users
        </h2>
        </Link>
        <Link to="/Chat">
        <h2 style={{margin:"50px",fontSize:"40px"}}>
        Chat 
        </h2>
        </Link>
        <Link to="/Upload">
        <h2 style={{margin:"50px",fontSize:"40px"}}>
        Upload
        </h2>
        </Link>
        <Link to="/Create">
        <h2 style={{margin:"50px",fontSize:"40px"}}>
        Create
        </h2>
        </Link>
    </Hoc>
		)
}

export default basic