import ChannelView from "components/channel/ChannelView";
import CreateChannelPopUp from "components/channel/create-channel-popup";
import Loading from "components/loading/Loading";
import MySpace from "components/space/MySpace";
import SpaceBanner from "components/space/spaceBanner";
import Thread from "components/thread/Thread";
import UserContext from "contexts/UserContext";
import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/navbar/Navbar";
import "./spacepage.css";

function SpacePage() {
	const navigate = useNavigate();
	const [user] = useContext(UserContext);
	const { spaceName, defaultChannelID } = useParams();

	const [isLoading, setIsLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");

	const [spaceData, setSpaceData] = useState({
		_id: "",
		name: spaceName,
		description: "",
		ownerID: "",
		picture: null,
		channels: [],
		members: [],
	});
	const [currentChannel, setCurrentChannel] = useState({
		_id: defaultChannelID,
		name: "",
		threads: [],
		spaceName: spaceName,
	});

	const [isCreateChannelPopUpOpen, setIsCreateChannelPopUpOpen] =
		useState(false);
	const [newChannelName, setNewChannelName] = useState("");

	// get threads and also change channel
	const changeCurrentChannel = useCallback(
		async (newChannel, searchQuery) => {
			try {
				const res = await fetch(
					"http://localhost:3000/api/threads?channelID=" +
						newChannel._id
				);
				if (!res.ok) {
					navigate("/404");
					return;
				}
				const resData = await res.json();

				if (searchQuery !== undefined && searchQuery.trim() !== "") {
					resData.threads = resData.threads.filter((thread) => {
						return (
							thread.title
								.toLowerCase()
								.includes(searchQuery.toLowerCase()) ||
							thread.text
								.toLowerCase()
								.includes(searchQuery.toLowerCase())
						);
					});
				}
				setCurrentChannel((prev) => ({ ...prev, ...resData }));
			} catch (error) {}
		},
		[navigate]
	);

	useEffect(() => {
		async function getSpace() {
			try {
				const res = await fetch(
					"http://localhost:3000/api/space?spaceName=" + spaceName
				);
				if (!res.ok) {
					navigate("/404");
					return;
				}
				const resData = await res.json();
				setSpaceData(resData);
				if (defaultChannelID) {
					await changeCurrentChannel(
						resData.channels.find(
							(channel) => channel._id === defaultChannelID
						)
					);
				} else {
					await changeCurrentChannel(resData.channels[0]);
				}
				setIsLoading(false);
			} catch (error) {}
		}

		getSpace();
	}, [changeCurrentChannel, navigate, spaceName, defaultChannelID]);

	function handleSearch(event) {
		setSearchQuery(event.target.value);
		changeCurrentChannel(currentChannel, event.target.value);
	}

	function handleCreateChannelPopUp() {
		setIsCreateChannelPopUpOpen(!isCreateChannelPopUpOpen);
	}

	function handleCreateChannelChange(event) {
		event.stopPropagation();
		setNewChannelName(event.target.value);
	}

	async function handleCreateChannelSubmit() {
		const res = await fetch("/api/crud/channel", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...user,
				userID: user._id,
				name: newChannelName,
				spaceID: spaceData._id,
			}),
		});
		const resData = await res.json();
		if (resData.status) {
			await changeCurrentChannel(resData.channel, searchQuery);
			setSpaceData((prev) => ({
				...prev,
				channels: [...prev.channels, resData.channel],
			}));
		}
		setIsCreateChannelPopUpOpen(!isCreateChannelPopUpOpen);
	}

	const threads = currentChannel.threads
		.map((thread) => (
			<Thread
				key={thread._id}
				{...thread}
				space={spaceData}
				channel={currentChannel}
			/>
		))
		.reverse();

	return (
		<div className="all font_size_rule">
			{isLoading && <Loading />}
			<Navbar
				searchQuery={searchQuery}
				handleSearch={handleSearch}
				currentChannel={currentChannel}
			/>
			<div className="body">
				<div className="left-container">
					<MySpace />
				</div>
				<div className="middle-container">
					<div className="middle-container__filter-bar">
						<ChannelView
							channels={spaceData.channels}
							space={spaceData}
							handleCreateChannelPopUp={handleCreateChannelPopUp}
							currentChannel={currentChannel}
							changeCurrentChannel={changeCurrentChannel}
						/>
					</div>
					<div className="middle-container__thread-section">
						{!isLoading && <SpaceBanner spaceData={spaceData} />}

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
