import { React } from "react";
import empyAvatar from "../../../../../assets/images/empyAvatar.png"

export default function Avatar(props) {
    const avatar = {
        borderRadius:"60px"
    }
    return(
        <div style={avatar}>
            <img  style={avatar} src={empyAvatar} width="120px" height="120px"></img>
        </div>
    )
    
}