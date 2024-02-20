import { ReactComponent as PlayIcon } from '../../assets/images-v2/play.svg'
import { ReactComponent as BookmarkIcon } from '../../assets/images-v2/bookmark-star.svg'
import "./index.scss"
import SocialFeedPostWorldGame from '../SocialFeedPostWorldGame/SocialFeedPostWorldGame';
import SimilarGames from '../SimilarGames/SimilarGames';
import plusbtn from '../../assets/images/plusbtn.svg'
import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from 'react';
import worldService from '../../services/world';
import staroutlined from '../../assets/images/staroutlined.svg'
import userservice from '../../services/userservice'
import { useDispatch, useSelector } from "react-redux";
import { TRACKING_ID } from '../../utils/globalConstant';
import { googleAnalyticsActions } from '../../utils/googleAnalyticsInit';
import UE5Engine from '../layout/UE5Engine';
import { setIsInWorld, setSelectedWorld } from '../../redux/worldSlice'
import { setUpdateFavouriteList } from '../../redux/favouriteSlice'
import Toast from '../custom/CustomToast'
import Conference from '../Conference'
import Loader from '../Loader';
import { Modal } from "antd";
import { ReactComponent as CloseIcon } from "../../assets/images/icon-close.svg";
import { Tooltip } from 'antd'
import { categoryForWorldName } from 'src/utils/viewHelpers';
import "../gating/index.css";
import "../UserHome/newuser.scss";

import { World as IWorld, RootState } from '../../../_types/types';
import Schedule from './Schedule';

interface WorldParams {
  id: string
}

export const WorldModal= (props: any) => {
  return (
    <Modal {...props}>
      {props.children}
    </Modal>
  )
}

const World = () => {
  const account = useSelector((state: RootState) => state.account);
  const { isInWorld } = useSelector((state: RootState) => state.world );
  const history = useHistory()
  const [world, setWorld] = useState<IWorld|undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  //const [isPlaying, setIsPlaying] = useState(false);
  //const [isBuilding, setIsBuilding] = useState(false);
  //const [myWorldFlag, setmyWorldFlag] = useState(false);
  const [status, setStatus] = useState<string>();
  const { id } = useParams<WorldParams>();
  const dispatch = useDispatch();

  // When the world ID changes, load the new world and scroll to the top of the page
  useEffect(() => {
    getWorld();
    document.getElementById('world-container').scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [id]);

  const getWorld = async () => {
    if (id) {
      const response = await worldService.getworldbyid(id);
      if (response.status === 200) {
        setWorld(response.data as IWorld);
      }
    }
  };

  const openWorldPage = () => {
    history.push("/feeds", { usertype: 'O' });
  }

  useEffect(() => {
    return () => {
      dispatch(setSelectedWorld(null))
      dispatch(setIsInWorld(false))
    }
  }, [])

  // TODO: This should show a modal while in the connecting state and update isPlaying/isBuilding/isInWorld once connected.
  const connectToGameInstance = async (gameId: string) => {
    setIsConnecting(true);
    //dispatch(setIsInWorld(true));
    /*setIsPlaying(true);
    setIsBuilding(false);
    dispatch(setIsInWorld(true));*/

    /* Debugging */
    if (false) {
      setStatus('Connected');
      setIsConnecting(false);
      dispatch(setIsInWorld(true));
    }

  }

  const updateStatus = (status: string) => {
    setStatus(status);
    if (status === 'Connected') {
      setIsConnecting(false);
      setIsInWorld(true);
    }
  }

  const removeWorldFromFav=async(worldId:string)=>{
    try {
      const payload = {
        worldId: worldId
      };
      let token = account.token;
      const response = await userservice.removeWorldFromFav(payload,token);
      Toast.success(`${world.worldName} has been removed from your favorites.`);
      //updateList && updateList();
      setWorld({ ...world, isFavourite: false } as IWorld);
      dispatch(setUpdateFavouriteList(new Date().getTime()))
    } catch (error) {
      console.log(error);
      Toast.error("Unsuccessful", "Something went wrong, please try again!");
    }
  }

  const addworldtofav=async(worldId: string)=>{
    try {
      const payload = {
        worldId: worldId
      };
      let token = account.token;
      const response = await userservice.makeworldFavourite(payload,token);
      setWorld({ ...world, isFavourite: true } as IWorld);
      Toast.success(`${world.worldName} has been added to favorites.`);
      dispatch(setUpdateFavouriteList(new Date().getTime()))
      googleAnalyticsActions.initGoogleAnalytics(TRACKING_ID, 'Added', 'Successful');
    } catch (error: any) {
      console.log(error);
      if(error.response.status === 500){
        Toast.error("Unsuccessful", "You have already made this world a favorite.");
      }
      else{
        Toast.error("Unsuccessful", "Something went wrong, please try again!");
      }

    }
  }

  const renderAboutGame = () => {
    return (
      <div className='about-game-wrapper'>
        <div className='about-game-header'>ABOUT { world?.worldName }</div>
        <div className='game-addition-description'>
          {world?.longDescription}
        </div>
        <div className='game-tags'>
          {world?.tags?.map((tag, index) => (
            <div key={index} className='tag-label'>{tag}</div>
          ))}
        </div>
      </div>
    )
  }

  const renderPlayButton = (isSuperUser=false) => {
    const now = Date.now();
    const isLive = world.tours.find(t => {
      const start = new Date(t.startDate).getTime();
      const end = new Date(t.endDate).getTime();
      return now > start && now < end;
    });

    if (account?.isSuperUser || account?.isSuper || isLive) {
      return (
        <button className='play-btn' onClick={() => connectToGameInstance(world._id)}>
            <PlayIcon />
          <span>PLAY</span>
        </button>
      )
    } else {
      return (
        <Tooltip placement="top" title="Coming soon!">
          <button className='play-btn'>
              <PlayIcon />
            <span>PLAY</span>
          </button>
        </Tooltip>
      )
    }
  }

  return (
    <div id='world-container' className='world-container'>
      { world && (isConnecting || isInWorld) &&
        <UE5Engine accountToken={account.token} world={world} updateStatus={updateStatus} />
      }
      { world && isConnecting &&
        <WorldModal
          className="gating-container"
          visible={true}
          onCancel={() => setIsConnecting(false)}
          footer={null}
          title=""
          closeIcon={<CloseIcon />}
          centered
          maskClosable={false}
        >
          <div className="loader-wrapper">
            <Loader />
            <span>{status}...</span>
          </div>
        </WorldModal>
      }
      {
        world && isInWorld &&
        <Conference></Conference>
      }
      { world && !isInWorld &&
        <>
          <div className='world-detail-container'
            style={{
              backgroundImage: `url(${world?.worldHeaderImage})`
            }}
          >
            <div
              className='overlay-content-wrapper'
              style={{
                backgroundColor: "#000",
                borderRadius: "50px",
                minHeight: "460px",
                padding: "30px",
                maxWidth: "520px",
              }}
            >
              <span className='description-txt' style={{ marginTop: "0px" }}>
              { categoryForWorldName(world.worldName) }
              </span>
              <span style={{
                fontFamily: "Archivo Black",
                fontStyle: "normal",
                fontWeight: "900",
                fontSize: "32px",
                lineHeight: "48px",
                color: "#FFFFFF"
              }}>{world?.worldName}</span>
              <span className='description-txt' style={{ marginTop: "2px", color: "#d3d3d3" }}>{ world?.shortDescription }</span>
              <div className='world-cta-wrapper' style={{ marginTop: "200px", gap: "16px" }}>
                { renderPlayButton() }
                <button className='bookmark-btn' style={{ width: "48px", height: "48px", border: "1px solid #C3CFD5", background: 'none' }}>
                {(world.isFavourite)?<BookmarkIcon className='favicon' onClick={()=>removeWorldFromFav(world._id)}/>:
                <div><img className='favicon' src={staroutlined} alt={world.worldName} onClick={()=>addworldtofav(world._id)} style={{ marginTop: "-4px" }}/>
                </div>}
                </button>

                {/* Days and Schedule data can be passed as props to keep Schedule Component reusable. */}
                { world?.tours?.length && <Schedule /> }
              </div>
            </div>
          </div>

          <div className='world-bottom-container'>
            <div className='world-bottom-left'>
                {renderAboutGame()}
              </div>
            <div className='world-bottom-right'></div>
          </div>
          <div className='world-bottom-container'>
            <SimilarGames to={world}/>
          </div>
          {
            world.owner === account.id &&
            <span className='add-post-button' onClick={openWorldPage}><img src={plusbtn} onClick={openWorldPage} alt="plus icon"/>ADD POST TO WORLD PAGE</span>
          }
          <div className='world-bottom-container'>
            <SocialFeedPostWorldGame world={world} />
          </div>
        </>}

    </div>
  )
}

export default World
