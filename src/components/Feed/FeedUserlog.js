import { Col } from "antd";
  import Avatar from '../custom/Avatar'
  import '../../styles/Feed/SocialFeed.scss'
  import { ReactComponent as Options }  from "../../assets/images/Options.svg"; 
  import React, { useEffect, useState,useRef } from "react";
  import feedService from "../../services/Feed";
  import { useSelector } from "react-redux";
  import ConfirmModal from "../../components/Social-v2/ConfirmModal";
  import Toast from "../custom/CustomToast";

  const FeedUserlog = (props) => {
  const { createdAt,username,worldLogo,handleEditBox,feedId,refreshFeeds} = props;
  const account = useSelector((state) => state.account);
  const [showoptions, setshowoptions] = useState("false");
  const [disableoptions, setdisableoptions] = useState("enable");
  const [deleteflg, setdeleteflg] = useState(false);
  const ref = useRef(null);
  
  const handleshowoptions=()=>{
    if(disableoptions=="disable")
    setshowoptions("false")
    else
    setshowoptions("true")
  }
 const handleEdit=()=>{
  handleEditBox(true)
  setshowoptions("false")
 }
 const handleDelete=()=>{
  setdeleteflg("true");
  setshowoptions("false")
 }
 useEffect(() => {
  if(username!==account?.username)
  setdisableoptions("disable")
  else
  setdisableoptions("enable")
}, []);

 const handleDeleteconfirm=async()=>{
  try {
       const response = await feedService.deleteSocialFeed(account.token,feedId);
       Toast.success("Post deleted!","Your Post is deleted.");
       refreshFeeds();
       setdeleteflg(false);
     } 
     catch (error) {
       console.log(error);
     }
 }
 

 const handleClickOutside = (event) => {
     if (ref.current && !ref.current.contains(event.target)) {
      setshowoptions("false")
     }
 };

 useEffect(() => {
     document.addEventListener('click', handleClickOutside, true);
     return () => {
         document.removeEventListener('click', handleClickOutside, true);
     };
 }, []);
 //deleteSocialFeed
    return (<>
    <div className="social_feed_container">
         <Avatar image={worldLogo} size={40}/>
         <div>
                <Col><label className="prfusername">{username}</label></Col>
                <Col><label className="prfusrtime">{createdAt}</label></Col>
         </div>
         <div className={(disableoptions=="enable"||showoptions!="true")?"optionsbtn":"cursor-not-allowedOptions"}><Options onClick={handleshowoptions}/></div>
         <div ref={ref} className="editdelete_box" style={{visibility:showoptions=="true"?"visible":"hidden"}}>
              <span><a onClick={handleEdit}>Edit</a></span>
              <span><a onClick={handleDelete}>Delete</a></span>
        </div>
        {deleteflg && (
        <ConfirmModal
          type="delete"
          onCancel={() => {
            setdeleteflg(false);
          }}
          onOkay={handleDeleteconfirm}
        />
      )}
    </div>
    </>);}

    export default FeedUserlog