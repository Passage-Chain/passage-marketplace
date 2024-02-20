import "./RecentlyAdded.scss";
import rg1Url from '../../assets/images/RecentGame1.png'
import rg2Url from '../../assets/images/RecentGame2.png'
import rg3Url from '../../assets/images/RecentGame3.png'

import { ReactComponent as Extend } from '../../assets/images/extend.svg'

const RecentlyAdded = () => {
    return (
        <div className="Main-Recent-Container">
            <div className="Recent-Container">
                <div className="header-frame">
                    <label className="header-title">Recently Played</label>
                </div>
                <div className="games-container">
                    <div className="game-tab">
                        <div className="game-img-div">
                            <img src={rg1Url} alt="Recent Game 1" className="game-img" />
                        </div>
                        <div className="game-name-container">
                            <div className="game-name-inner">
                                <span className="game-name">The Hub</span>
                                <span className="game-status-active">in play now</span>
                            </div>
                            <div className="extend-action-div">
                                <Extend className="extend-img" />
                            </div>
                        </div>
                    </div>
                    <div className="game-tab">
                        <div className="game-img-div">
                            <img src={rg2Url} alt="Recent Game 2" className="game-img" />
                        </div>
                        <div className="game-name-container">
                            <div className="game-name-inner">
                                <span className="game-name">Huahuaverse</span>
                                <span className="game-status-inactive">1 day ago</span>
                            </div>
                            <div className="extend-action-div">
                                <Extend className="extend-img" />
                            </div>
                        </div>
                    </div>
                    <div className="game-tab">
                        <div className="game-img-div">
                            <img src={rg3Url} alt="Recent Game 3" className="game-img" />
                        </div>
                        <div className="game-name-container">
                            <div className="game-name-inner">
                                <span className="game-name">Strange Clan</span>
                                <span className="game-status-inactive">3 days ago</span>
                            </div>
                            <div className="extend-action-div">
                                <Extend className="extend-img" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecentlyAdded;
