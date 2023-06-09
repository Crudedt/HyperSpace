import UserContext from "contexts/UserContext";
import { useContext, useEffect, useState } from "react";
import shortenNumber from "utils/number";
import "./spaceBanner.css";

export default function SpaceBanner({ spaceData }) {
	const [user, setUser] = useContext(UserContext);
	const [hasJoined, setHasJoined] = useState(null);
	const [membersCount, setMembersCount] = useState(spaceData.members.length);

	useEffect(() => {
		async function checkJoin() {
			try {
				const res = await fetch("/api/checkjoinspace", {
					method: "POST",
					headers: {
						Accept: "application/json",
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						key: user.key,
						userID: user._id,
						spaceID: spaceData._id,
					}),
				});
				const resData = await res.json();
				if (res.ok && resData.true !== undefined) {
					setHasJoined(true);
					return;
				}
			} catch (error) {}
			setHasJoined(false);
		}
		if (user) {
			checkJoin();
		}
	}, [spaceData._id, user, hasJoined]);

	async function handleJoin() {
		try {
			const res = await fetch("/api/joinspace", {
				method: "POST",
				headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					key: user.key,
					userID: user._id,
					spaceID: spaceData._id,
				}),
			});
			console.log(await res.json());
		} catch (error) {}
		setHasJoined((prev) => {
			setUser((prev) => ({
				...prev,
				joinedSpaces: prev.joinedSpaces.filter(
					(space) => space._id !== spaceData._id
				),
			}));
			if (prev) {
				setMembersCount((prev) => prev - 1);
			} else {
				setMembersCount((prev) => prev + 1);
			}
			return !prev;
		});
	}

	return (
		<div className="space__banner__container">
			{spaceData.bannerPicture && (
				<img
					className="space__banner__background"
					src={spaceData.bannerPicture}
					alt=""
				/>
			)}
			<div className="space__banner__data">
				<div className="space__banner__top">
					<div className="space__profile">
						{spaceData.picture && (
							<img
								className="space__profile-picture"
								src={spaceData.picture}
								alt=""
							/>
						)}

						<div className="space__data">
							<p className="space__title">{spaceData.name}</p>
							<p className="space__member">
								{shortenNumber(membersCount) + " Members"}
							</p>
						</div>
					</div>

					<div className="space__button">
						{hasJoined !== null && (
							<button
								className={
									hasJoined
										? "space__button__joined"
										: "space__button__Notjoined"
								}
								onClick={handleJoin}
							>
								{hasJoined ? "Joined" : "Join"}
							</button>
						)}
					</div>
				</div>

				<div className="space__banner__bottom">
					<p className="space__banner__desc">
						{spaceData.description}
					</p>
				</div>
			</div>
		</div>
	);
}
