import React from "react";
import classes from "./index.css"
import {NavLink} from "react-router-dom"

const Header = (props)=>{
	return(
			<nav className={classes.Header}>
				{props.tabs.map(val=>{
					if(val === 'Search'){
						return(<NavLink 
						key={val} 
						onClick={(e)=>{e.preventDefault();props.changeShow()}}
						className={classes[val] +" "+ classes.all}
						activeClassName={classes.activeClassName}
						 to={"/"+val}><span className={classes.align}>{val}</span></NavLink>)
					}
					return (<NavLink 
						key={val} 
						className={classes[val] +" "+ classes.all}
						activeClassName={classes.activeClassName}
						 to={"/"+val}><span className={classes.align}>{val}</span></NavLink>)
						}
				)}
			</nav>
		)
}

export default Header	