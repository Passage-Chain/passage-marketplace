import FeedUserlog from './FeedUserlog'
import Post from './Post'
import '../../styles/Feed/SocialFeed.scss'
import WritePost from './WritePost';
import React, { useEffect, useState } from "react";
import { FEED_USER_TYPES } from 'src/utils/globalConstant';

const Feed = (props) => {
    const {feedPost, refreshFeeds,gettoppaddingvalue,isEdit,id}=props;
    const [isEditEnabled, setEditEnabled] = useState(false);
    const handleEditBox=(flag)=>{
      setEditEnabled(flag)
    }
    useEffect(() => {
      if(isEdit==='Y'&&feedPost?.id===id)
      {
        setEditEnabled(true);
      }
    }, [isEdit]);
    function timeSince(date) {
        date = new Date(date);
        var seconds = Math.floor((new Date() - date) / 1000);
        var interval = seconds / 31536000;
      
        if (interval > 1) {
          return Math.floor(interval) + " years";
        }
        interval = seconds / 2592000;
        if (interval > 1) {
          return Math.floor(interval) + " months";
        }
        interval = seconds / 86400;
        if (interval > 1) {
          return Math.floor(interval) + " days";
        }
        interval = seconds / 3600;
        if (interval > 1) {
          return Math.floor(interval) + " hours";
        }
        interval = seconds / 60;
        if (interval > 1) {
          return Math.floor(interval) + " minutes";
        }
        return Math.floor(seconds) + " seconds";
      }
    return (<div className='feeddiv'>
    <div className='postborder'>
    <FeedUserlog createdAt={timeSince(feedPost?.createdAt)+" ago"} refreshFeeds={refreshFeeds} feedId={feedPost?.id} handleEditBox={handleEditBox} username={feedPost?.user?.nickname} worldLogo={feedPost?.user?.profileImage} />
    {isEditEnabled==false?<Post feedPost={feedPost} refreshFeeds={refreshFeeds} />:
    <WritePost handleEditBox={handleEditBox} isEditEnabled={isEditEnabled} editObj={feedPost} refreshFeeds={refreshFeeds} gettoppaddingvalue={gettoppaddingvalue} usertype={feedPost?.world==null? FEED_USER_TYPES.SELF : FEED_USER_TYPES.OTHER}/>}
    </div>
    </div>);}

    export default Feed;