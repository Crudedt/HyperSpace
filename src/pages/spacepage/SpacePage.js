import ChannelView from "components/channel/ChannelView";
import MySpace from "components/space/MySpace";
import SpaceBanner from "components/space/spaceBanner";
import Thread from "components/thread/Thread";
import LocationContext from "contexts/LocationContext";
import { useState } from "react";
import { findChannel, findThread } from "utils/find";
import Navbar from "../../components/navbar/Navbar";
import CreateChannelPopUp from "components/channel/create-channel-popup";

import "./spacepage.css";

function SpacePage(props) {
	const [currentChannel, setCurrentChannel] = useState(
		findChannel(props.space.channelsID[0])
	);

	function handleChangeCurrentChannel(channelID) {
		const channel = findChannel(channelID);
		setCurrentChannel(channel);
	}

	const channelsArray = props.space.channelsID.map((channelID) =>
		findChannel(channelID)
	);

	const threads = currentChannel.threadsID.map((threadID) => {
		const thread = findThread(threadID);

		return (
			<Thread
				key={thread.ID}
				space={props.space}
				channel={currentChannel}
				{...thread}
			/>
		);
	});

	const [isCreateChannelPopUpOpen, setIsCreateChannelPopUpOpen] =
		useState(false);

	function handleCreateChannelPopUp(event) {
		setIsCreateChannelPopUpOpen(!isCreateChannelPopUpOpen);

		console.log(!isCreateChannelPopUpOpen);
	}

	const [newChannel, setNewChannel] = useState("");

	function handleCreateChannelChange(event) {
		event.stopPropagation();
		setNewChannel(event.target.value);
	}

	function handleCreateChannelSubmit(event) {
		setIsCreateChannelPopUpOpen(!isCreateChannelPopUpOpen);
		console.log(newChannel);
	}

	return (
		<div className="all font_size_rule">
			<Navbar />
			<div className="body">
				<div className="left-container">
					<MySpace />
				</div>
				<div className="middle-container">
					<LocationContext.Provider
						value={{
							currentChannel: currentChannel,
							changeCurrentChannel: handleChangeCurrentChannel,
						}}
					>
						<div className="middle-container__filter-bar">
							<ChannelView
								channelsArray={channelsArray}
								user={props.user}
								space={props.space}
								handleCreateChannelPopUp={
									handleCreateChannelPopUp
								}
							/>
						</div>
					</LocationContext.Provider>

					<div className="middle-container__thread-section">
						<SpaceBanner isJoined={false} spaceData={props.space} />

						{threads.length ? (
							threads
						) : (
							<div className="middle-container__thread-section__text">
								<h1>There's nothing here!</h1>
								<p>Maybe navigate to another channel?</p>
							</div>
						)}
					</div>
				</div>

				{isCreateChannelPopUpOpen && (
					<CreateChannelPopUp
						handleCreateChannelPopUp={handleCreateChannelPopUp}
						handleCreateChannelChange={handleCreateChannelChange}
						handleCreateChannelSubmit={handleCreateChannelSubmit}
					/>
				)}
			</div>
		</div>
	);
}

export default SpacePage;