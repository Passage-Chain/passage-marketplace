import { ReactSVG } from "react-svg";
import Likes from "../../assets/images/Likes.svg";
import likefilled from "../../assets/images/likefilled.svg";
import { Row, Col } from "antd";
import feedService from "../../services/Feed";
import { useSelector } from "react-redux";

const Post = ({ feedPost, refreshFeeds }) => {
  const account = useSelector((state) => state.account);
  const handleLikeUnlike = async () => {
    try {
      const response = await feedService.likeSocialFeed(account.token, feedPost.id);
      refreshFeeds()
    }
    catch (error) {
      console.log(error);
    }
  }
  return (<>
    <Row>
      <Col>
        <div className="posttext" dangerouslySetInnerHTML={{ __html: feedPost?.feedContent }}>
        </div>
      </Col>
    </Row>
    {(feedPost && feedPost?.imageUrls?.length !== 0 && feedPost?.imageUrls[0] !== 'undefined') && <div className='containerimgupld'>
      <div className='frstcolmn'>
        {feedPost && feedPost?.imageUrls?.length === 1 ?
          <img className="singleimg" src={feedPost && feedPost?.imageUrls?.[0]} alt='singleImg' />
          : (feedPost?.imageUrls[0] !== 'undefined') && <img className="singleimginmultiple" alt='multipleImg' src={feedPost && feedPost?.imageUrls?.[0]} />}
      </div>
      <div style={{ display: 'flex', flexFlow: 'column' }} className="scndColmn">
        {
          feedPost.imageUrls?.map((file, i) => {
            if (i > 0 && file != 'undefined')
              return (
                <img src={file} className="scndclmnimg" alt="columImg" />
              )
          })
        }
      </div>
    </div>}
    <div className="social_bottom_tag">
      <span className="postfooter_left">
        <span>
          {
            feedPost?.isLiked == true ?
              <ReactSVG className="postmr_10" src={likefilled} onClick={handleLikeUnlike}></ReactSVG> :
              <ReactSVG className="postmr_10" src={Likes} onClick={handleLikeUnlike}></ReactSVG>
          }
          <span className="posttime_text">{feedPost?.likeCount}</span></span>
      </span>
    </div>
  </>);
}

export default Post;