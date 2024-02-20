import "./Teams.scss";
import { ReactComponent as Avatar1 } from '../../assets/images/Avatar1.svg'
import { ReactComponent as Avatar3 } from '../../assets/images/Avatar3.svg'
import { ReactComponent as Avatar4 } from '../../assets/images/Avatar1.svg'

const Teams = () => {
    return (
        <div className="Teams-container">
            <div className="Teams-Title-Container">
                <span className="Teams-label">Teams</span>
                <span className="Teams-Count-Div">
                    <span className="Teams-count">6</span>
                </span>
            </div>
            <div className="Teams-community">
                <div className="community">
                    <span className="community-avatar">
                        <Avatar1 />
                    </span>
                    <span className="team-name">
                        <div className="team-name-text">Alpha Team</div>
                        <div className="team-name-time">12 of your friends are in</div>
                    </span>
                </div>
                <div className="community">
                    <span className="community-avatar">
                        <Avatar3 />
                    </span>
                    <span className="team-name">
                        <div className="team-name-text">Beta Team</div>
                        <div className="team-name-time">19 of your friends are in</div>
                    </span>
                </div>
                <div className="community">
                    <span className="community-avatar">
                        <Avatar4 />
                    </span>
                    <span className="team-name">
                        <div className="team-name-text">Gamma Team</div>
                        <div className="team-name-time">14 of your friends are in</div>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default Teams;
