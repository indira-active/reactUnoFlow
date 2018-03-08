import React,{Component} from "react";

class Upload extends Component {
	state ={
		uploaded:false,
		src:''

	}
	readURL = (input)=>{
    if (input.files && input.files[0]) {
        var reader = new FileReader();

        reader.onload = (e)=>{
        		this.setState({uploaded:true,src:e.target.result})
        }

        reader.readAsDataURL(input.files[0]);
    }
	}

	render(){
		return(
			<div style={{border:"black 5px",padding:"50px",margin:"100px",fontSize:"25px",textAlign:"center",borderStyle:"solid"}}>
			<form target='#blank' action="http://localhost:8080/api/addToSmooch" method="POST" encType="multipart/form-data">
				<label htmlFor="photo">
					<input ref={`thing`} onChange={()=>{this.readURL(this.refs.thing)}} style={{padding:"10px"}} type="file" name="photo" accept="image/gif, image/png, image/jpeg" />
					
				</label>
				<label htmlFor="submit">
							<input type="submit" name="submit" />
				</label>
			</form>
			{this.state.uploaded?<img style={{maxWidth:"400px"}} src={this.state.src} alt="photo"/>:null}
			</div>
		
			)
	}
}

	
export default Upload