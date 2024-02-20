import "./RecentlyAdded.scss";
import Achievments from "./Achievments";
import RecentlyAdded from "./RecentlyAded";
import Teams from './Teams'
import friendPlaceholderUrl from '../../assets/images/friends.png'

const RightContainer = ({ }) => {
    return (
        <div className="Main-Recent-Container grayout">
            <Achievments />
            <RecentlyAdded />
            <Teams />
            <img src={friendPlaceholderUrl} alt="My Friends" className="friends" />
        </div>
    );
}

export default RightContainer;