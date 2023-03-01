import { FaCrown } from "react-icons/fa";
import { getMomentFrom } from "utils/date.js";
import userData from "data/userdata";
import spaceData from "data/spacedata";

export default function Thread(props) {
	const moment = getMomentFrom(new Date(props.postDate));
	const pictures = props.pictures.map((url) => (
		<img
			key={url}
			className="thread__content__pictures__image"
			src={url}
			alt="thread content image"
		/>
	));
	const space = spaceData.find((space) => space.ID === props.spaceID);
	const user = userData.find((user) => user.ID === props.userID);

	return (
		<div>
			<div className="thread__profile">
				<img src={user.profilePicture} alt="user profile picture" />
				<div>
					<p className="thread__profile__spacename">{space.name}</p>
					<div>
						<FaCrown />
						<p className="thread__profile__username">{user.name}</p>
					</div>
				</div>
			</div>
			<div className="thread__info">
				<div className="thread__info__date">{moment}</div>
				<div className="thread__info__views">{props.views}</div>
			</div>
			<div className="thread__content">
				<h2 className="thread__content__title">{props.title}</h2>
				<p className="thread__content__text">{props.text}</p>
				<div className="thread__content__pictures">{pictures}</div>
			</div>
		</div>
	);
}
