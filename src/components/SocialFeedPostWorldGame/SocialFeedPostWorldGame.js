import React, { useEffect, useState,useRef } from "react";
import { ReactSVG } from "react-svg";
import  rightArrow from "../../assets/images/circle-with-right-arrow.svg";
import  leftArrow  from  "../../assets/images/circle-with-left-arrow.svg";
import "./index.scss";
import { timeSince } from "../../components/utils/CommonFunctions/commonfunctions"
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import feedService from "../../services/Feed";
import ConfirmModal from "../../components/Social-v2/ConfirmModal";
import { Toast } from "reactstrap";
import Avatar from '../custom/Avatar'
import { ReactComponent as Options }  from "../../assets/images/Options.svg";
import {
  Row,
  Col,
} from "antd";
import Likes from "../../assets/images/Likes.svg"
import likefilled from "../../assets/images/likefilled.svg"

const SocialFeedPostWorldGame = ({ world }) => {
  const [imageIndex, setImageIndex] = useState(2);
  const [gameList, setfeedList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const history = useHistory();
  const [showoptions, setshowoptions] = useState(0);
  const [disableoptions, setdisableoptions] = useState("enable");
  const [deleteflg, setdeleteflg] = useState(false);
  const [idToDelete, setidToDelete] = useState(false);
  const ref = useRef(null);
  const account = useSelector((state) => state.account);
  const [myworldId, setMyWorldId] = useState();
  const handleshowoptions=(id)=>{
    setshowoptions(id)
  }

  const handleLikeUnlike=async(id)=>{
    try {
         const response = await feedService.likeSocialFeed(account.token,id);
         getWorldFieldData()
       }
       catch (error) {
         console.log(error);
       }
   }

 const handleEdit=(id)=>{
  history.push("/feeds",{usertype:'O',isEdit:'Y',id:id});
 }

 const handleDelete=(id)=>{
  setdeleteflg("true");
  setshowoptions("false")
  setidToDelete(id)
 }
 useEffect(() => {
  //getMyWorld();
}, []);

 const handleDeleteconfirm=async(id)=>{
  try {
       const response = await feedService.deleteSocialFeed(account.token,idToDelete);
       setdeleteflg(false);
       Toast.success("Post deleted!","Your Post is deleted.");
       getWorldFieldData();
     }
     catch (error) {
       console.log(error);
     }
 }

 /*const getMyWorld = async () => {
  try {
    const response = await feedService.getMyWorld(account.token);
    const list = response?.data?.world || [];
    setMyWorldId(list._id);
  } catch (error) {
    console.log(error);
  }
};*/

const handleClickOutside = (event) => {
     if (ref.current && !ref.current.contains(event.target)) {
      setshowoptions("false")
     }
};

const length = gameList.length;
  const onPrevButton = () => {
    setImageIndex(imageIndex === 2 ? imageIndex : imageIndex-1)
  }
  const onNextButton = () => {
    setImageIndex(imageIndex === length-1 ? imageIndex : imageIndex+1)
  }
  useEffect(()=>{
    getWorldFieldData();
  },[world])

  const getWorldFieldData = async() => {
    let gameListdata = await feedService.getWorldFeed(account.token, world._id);
    setfeedList(gameListdata?.data?.feeds);
  }
  const redirectToFeed=()=>{
      history.push("/feeds", {
        usertype:'O'
      })
  }
  useEffect(() => {
    document.addEventListener('click', handleClickOutside, true);
    return () => {
        document.removeEventListener('click', handleClickOutside, true);
    };
}, []);
  return (
    <>
      <section className="world_social_feed_container">
        <div className="social_feed_header">
          <h1 className="header_text">SOCIAL FEED: { world.worldName }</h1>
          <div>
            <ReactSVG src={leftArrow} className={(gameList.length==0||gameList.length<3)? 'cursor_none':(imageIndex === 2 ? 'cursor_none' : 'cursor_pointer')} onClick={onPrevButton}></ReactSVG>
            <ReactSVG src={rightArrow} className={(gameList.length==0||gameList.length<3)? 'cursor_none':(imageIndex === length-1 ? 'cursor_none' : 'cursor_pointer')} onClick={onNextButton}></ReactSVG>
          </div>
        </div>

        <div className="carousel">
        {gameList.length>0?<div className="social_game_container">
            {gameList.map((slide, idx) => (
              <div key={idx} className={(idx <= imageIndex && idx >= imageIndex - 2) ? 'feed_slide_active' : 'feed_slide'}>{(idx <= imageIndex && idx >= imageIndex - 2) && (
              <div className="child" >
                 <div className="world-social-feed">
         <Avatar image={slide?.user?.profileImage} size={40}/>
         <div style={{width:'200px'}}>
                <Col><label className="prfusername">{slide?.user?.nickname}</label></Col>
                <Col><label className="prfusrtime">{timeSince(slide?.createdAt)+" ago"}</label></Col>
         </div>
         <div className={(slide?.user?.nickname==account?.username==true||showoptions==slide.id)?"world-option-button":"cursor-not-allowedOptions"}>
          <Options onClick={(slide?.user?.nickname==account?.username==true||showoptions==slide.id)&&(()=>handleshowoptions(slide.id))}/></div>
         <div ref={ref} className="editdelete_box_world" style={{visibility:showoptions==slide.id?"visible":"hidden"}}>
              <span><a onClick={()=>handleEdit(slide.id)}>Edit</a></span>
              <span><a onClick={()=>handleDelete(slide.id)}>Delete</a></span>
        </div>
        {deleteflg && (
        <ConfirmModal
          type="delete"
          onCancel={() => {
            setdeleteflg(false);
          }}
          onOkay={()=>handleDeleteconfirm(slide?.id)}
        />
      )}
    </div>
                <div className="feedcontainer" onClick={()=>redirectToFeed()}>
                  <div className="feedDescription" dangerouslySetInnerHTML={{__html: slide.feedContent}}></div>
                  <div className="feedGallary">
                  {(slide?.imageUrls?.length!=0 && slide?.imageUrls[0]!='undefined')&&<div className='containerimgupld'>
                          <div className='frstcolmn'>
                          { slide?.imageUrls?.length==1?
                          <img className="largeimage" src={slide?.imageUrls?.[0]} />
                          :(slide?.imageUrls[0]!='undefined')&&<img className="largemultiple" src={slide?.imageUrls?.[0]} />}
                          </div>
                          <div style={{display:'flex',flexFlow:'column'}} className="scndColmn">
                          {
                            slide.imageUrls?.map((file,i)=>{
                               if(i>0&&file!='undefined')
                              return (
                                    <img  src={file} className="smallimages"/>
                                )
                            })
                         }
                         </div>
                         </div>}
                </div>
                </div>
                <div className="social_bottom_tag">
                  <span className="footer_left">
                  {
                    slide?.isLiked==true?
                    <ReactSVG className="mr_10" src={likefilled} onClick={()=>handleLikeUnlike(slide?.id)}></ReactSVG>:
                    <ReactSVG className="mr_10" src={Likes} onClick={()=>handleLikeUnlike(slide?.id)}></ReactSVG>
                  }
                    <span className="time_text">{slide?.likeCount}</span>
                  {/* <span><ReactSVG src={IconFeedComment} className="mr_10">
                    </ReactSVG><span className="time_text">70</span></span> */}
                    </span>
                  {/* <span className="footer_left"><span> <ReactSVG src={IconFeedReply}></ReactSVG> </span>
                   <span><ReactSVG src={IconShare}></ReactSVG></span> </span> */}
                  {/* <a href="''"><ReactSVG src={IconShare}></ReactSVG></a> */}

                </div>
              </div>

              )
              }</div>
            ))}
          </div>:
          <div className="social_game_container_blank">
            No data to display...
          </div>
        }
        </div>
      </section>
    </>
  )
}

export default SocialFeedPostWorldGame;
