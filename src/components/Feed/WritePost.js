import Vector from '../../assets/images/Vector.png';
import paperclip from '../../assets/images/paperclip.svg.png';
import '../../styles/Feed/Post.scss'
import { useSelector } from "react-redux";
import feedService from "../../services/Feed";
import Toast from "../custom/CustomToast";
import { useEffect, useState } from "react";
import { useRef } from 'react';
import closeimg from '../../assets/images/closeimg.svg'
import { Spin } from 'antd';
import { handleApiError } from '../utils/AuthVerify/AuthVerify';
import { FEED_USER_TYPES, TRACKING_ID } from '../../utils/globalConstant';
import { googleAnalyticsActions } from '../../utils/googleAnalyticsInit';
import { Tooltip } from 'antd'
import { ENABLE_PHOTO_UPLOAD } from "../../configs";


const WritePost = ({ gettoppaddingvalue, usertype, isEditEnabled, refreshFeeds, editObj = [], handleEditBox }) => {
  const [post, setPost] = useState("");
  const [textboxFlag, settextboxFlag] = useState("S");
  const account = useSelector((state) => state.account);
  const [isValidPost, setIsValidPost] = useState(true);
  const [MyWorldData, setMyWorldData] = useState([]);
  const [username, setUserName] = useState("");
  const inputRef = useRef(null);
  const [images, setImages] = useState([]);
  const [imgupldflag, setimgupldflag] = useState(false);
  const [imgblobs, setimgblobs] = useState([]);
  const [isShow, setisShow] = useState(false);
  const [expandedTextBox, setExpandedTextBox] = useState(false);

  useEffect(() => {
    getMyWorld();
  }, []);

  useEffect(() => {
    if (isEditEnabled != undefined) {
      setpostvalue(editObj?.feedContent);
      let imgblobsfiletered = editObj?.imageUrls?.filter(el => {
        return el !== 'undefined';
      });
      let imgurls = [];
      let imgfiletered = editObj?.imageUrls?.filter(el => {
        return el !== 'undefined';
      });
      imgfiletered?.map((file, i) => {
        imgurls.push({ "url": file });
      })
      setImages(imgurls);
      if (imgblobsfiletered?.length > 0) {

        setimgblobs(imgblobsfiletered)
        setimgupldflag(isEditEnabled);
      }
      else {
        setimgblobs([])
        setimgupldflag(false);
      }

    }
  }, [isEditEnabled]);

  const getMyWorld = async () => {
    setUserName("What’s new, " + account.username + "?");
    /*try {
      const response = await feedService.getMyWorld(account.token);
      const list = response?.data?.world || [];
      setMyWorldData(list);
    } catch (error) {

      setMyWorldData([]);
      handleApiError(error);
    }*/
  };

  const handleCreatePost = async () => {
    //` if (MyWorldData?.length != 0 || usertype == "S") {
    if ((isValidPost && post !== "" && post !== undefined) || imgblobs.length > 0) {
      try {
        const worldid = usertype == FEED_USER_TYPES.SELF ? "" : MyWorldData?._id;
        if (isEditEnabled == true) {
          setisShow(true);
          const response = await feedService.editFeed(account.token, worldid, post, imgblobs, editObj?.id);
          Toast.success("Post edited!", "Your Post has been edited.");
          refreshFeeds && refreshFeeds();
          googleAnalyticsActions.initGoogleAnalytics(TRACKING_ID, 'Edited Post', 'Post Edited successfully!');
        }
        else {
          setisShow(true);
          const response = await feedService.createFeed(account.token, worldid, post, imgblobs);
          Toast.success("Post created!", "Your Post has been created.");
          refreshFeeds && refreshFeeds();
          googleAnalyticsActions.initGoogleAnalytics(TRACKING_ID, 'Create Post', 'Post Created successfully!');
        }

        setisShow(false);
        setimgupldflag(false);
        setimgblobs([]);
        setImages([]);
        setPost("");
        gettoppaddingvalue && gettoppaddingvalue(5);
        settextboxFlag('S');
        handleEditBox && handleEditBox(false)
      } catch (error) {
        console.log(error);
        setisShow(false);
        Toast.error("Unsuccessful", "Something went wrong, please try again!");
      }
    }
    else {
      Toast.error("Action Prohibited!!", "Post can not be empty!");
    }
    /* }
    else {
      Toast.error("Action Prohibited!!","You are not owner of any world");
    } */
  };
  const handleChangePosttxt = (e) => {
    setpostvalue(e.target.value)
  };

  const setpostvalue = (value) => {
    if (value?.length > 1024 || post?.length > 1024) {
      setIsValidPost(false)
      setPost(value);
    }
    else {
      setIsValidPost(true)
      setPost(value);
    }
    if (value?.length > 72) {
      if (images.length === 0) {
        gettoppaddingvalue && gettoppaddingvalue(80);
      }
      else {
        gettoppaddingvalue && gettoppaddingvalue(645);
      }
      setExpandedTextBox(true);
      //settextboxFlag('M')
    }
    else {
      if (images.length === 0) {
        gettoppaddingvalue && gettoppaddingvalue(5);
      }
      setExpandedTextBox(false);
      //settextboxFlag('S')
    }

  }
  const handleUploadPhotos = () => {
    inputRef?.current?.click();
  }
  const cancelUpload = () => {
    setimgblobs([]);
    setImages([]);
    setimgupldflag(false);
    if (textboxFlag === 'S')
      gettoppaddingvalue(5);
    else
      gettoppaddingvalue(80);
  }
  const handleFileChange = (evnt) => {
    let newFiles = [];
    let imgblobsfiletered = imgblobs.filter(el => {
      return el !== 'undefined';
    });
    if (evnt?.target?.files.length > 4 || imgblobs.length > 4 || (evnt?.target?.files.length + imgblobsfiletered.length) > 4) {
      Toast.error("Action Prohibited!!", "Only 4 Images can be uploaded...");
    }
    else {
      setimgblobs(imgblobsfiletered);
      Array.from(evnt?.target?.files).forEach((file) => {
        if (file.type === "image/jpeg" || file.type === "image/png" || file.type === "image/gif") {
          if (file.size < 5000000) {
            setimgupldflag(true);
            setimgblobs(imgblobsfiletered => [...imgblobsfiletered, file])
            newFiles.push(file);
            const url = URL.createObjectURL(file);
            setImages(images => [...images, { "url": URL.createObjectURL(file) }]);
            if (isEditEnabled !== true) {
              let paddingval = (textboxFlag === 'S' ? 590 : 645);
              gettoppaddingvalue(paddingval);//575
            }
          }
          else {
            Toast.error("Action Prohibited!!", "Image size more than 5mb is not allowed");
            if (imgblobs.length === 0) {
              gettoppaddingvalue(10);
              setimgupldflag(false);
              setimgblobs([]);
              setImages([]);
            }

          }
        }
        else {
          Toast.error("Action Prohibited!!", "Image formats allowed : gifs,png,jpg");
        }
      })
    }
  }
  useEffect(() => {
    if (imgblobs?.length > 0) {
      setimgupldflag(true)
    }

  }, [imgblobs]);

  const removeImage = (fileurl) => {
    let arr1 = [...images];
    let arr2 = [...imgblobs];
    let index = arr1.findIndex(v => v.url === fileurl);
    arr1.splice(arr1.findIndex(v => v.url === fileurl), 1);
    arr2.splice(index, 1);
    if (arr1.length > 0) {
      setImages(arr1);
      setimgblobs(arr2);
    }
    else {
      setImages([]);
      setimgblobs([]);
      setimgupldflag(false);
      if (textboxFlag === 'S')
        gettoppaddingvalue(5);
      else
        gettoppaddingvalue(80);
    }
  }

  return (<>
    <div className='imgeuploadcontainer' style={{ width: '100%' }}>
      <div className={`txtwrtpost ${ expandedTextBox ? 'expanded' : ''}`}>
        <input style={{ display: 'none' }} ref={inputRef} multiple type="file" onChange={handleFileChange} />
        <textarea className="txt" value={post} onChange={handleChangePosttxt} placeHolder={username} rows={expandedTextBox ? 5 : 1}></textarea>
        <div style={{ visibility: `${ENABLE_PHOTO_UPLOAD ? 'visible' : 'hidden'}` }}>
          <Tooltip placement="top" title="Attach Image">
            <button className="btnclip">
              <img src={paperclip} alt="AttachImage" onClick={() => { handleUploadPhotos() }}/></button>
          </Tooltip>
        </div>
        <Tooltip placement="top" title={isValidPost ? "Post" : "Invalid Post"}>
          <span className='submit_span'>
            <button className="btnsend" disabled={!isValidPost} onClick={() => { handleCreatePost();}}>
              <img src={Vector} alt="Submit Post"/>
            </button>
          </span>
        </Tooltip>
      </div>
      <div>
        <span style={{ paddingLeft: '18px' }} className={ isValidPost ? 'helper-text' : "error-text" }>
          Max post length is 1024 characters.
        </span>
      </div>
    </div>
    {(images.length !== 0) && <div className='borderdiv' style={{ display: `${imgupldflag === false ? 'none' : 'block'}` }}>
      {(images[0]?.url !== 'undefined') && <div className='containerimgupld'>
        <div className='frstcolmn'>
          <img style={{ width: '300px', height: '500px', borderRadius: "13px" }} src={images[0]?.url} alt="displayImage"/>
          <Tooltip placement="top" title="Remove Image" className='remove_img'>
            <span className='closebtnspan'>
              <img src={closeimg} className="closebtnfirstimg" onClick={() => { removeImage(images[0]?.url) }} alt="closeImage"/>
            </span>
          </Tooltip>
        </div>
        <div style={{ display: 'flex', flexFlow: 'column' }} className="scndColmn">
          {
            images?.map((file, i) => {
              if (i > 0)
                return (
                  <div>
                    <img src={file?.url} className="scndclmnimg" alt='secondImage' />
                    <Tooltip placement="top" title="Remove Image">
                      <span className='second_close_span'>
                        <img src={closeimg} className='closebtnsecimg' onClick={() => { removeImage(file?.url) }} alt='closeImage' />
                      </span></Tooltip>
                  </div>
                )
            })
          }
        </div>
      </div>}
      <div className='cnldiv'><button className='canclebtn' onClick={cancelUpload}>Cancel</button></div>
    </div>}
    <div className="postloader" style={{ display: isShow ? "block" : "none" }}>
      <Spin tip="Loading..." />
    </div>
  </>);
}

export default WritePost;
