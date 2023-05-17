import InputField from "components/form/inputfield";
import Navbar from "components/navbar/Navbar";
import SubmitBtn from "components/ui/submitBtn";
import UserContext from "contexts/UserContext";
import { useContext, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./createthread.css";

export default function CreateThread() {
	const [user] = useContext(UserContext);
	const navigate = useNavigate();
	const { channelID } = useParams();
	const [newThread, setNewThread] = useState({
		title: "",
		text: "",
		picture: null,
	});

	if (!channelID || !user) {
		navigate("/");
		return;
	}

	function handleTitleChange(event) {
		setNewThread((prev) => ({
			...prev,
			title: event.target.value,
		}));
	}

	function handleBodyChange(event) {
		setNewThread((prev) => ({
			...prev,
			text: event.target.value,
		}));
	}

	async function handleSubmit() {
		const res = await fetch("/api/crud/thread", {
			method: "POST",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				...user,
				userID: user._id,
				channelID: channelID,
				...newThread,
			}),
		});
		if ((await res.json()).status) {
			navigate(-1);
			return;
		}
		alert("Your title or text is too long!");
	}

	return (
		<div className="create__thread font_size_rule">
			<Navbar />
			<div className="create__thread__container font_size_rule">
				<div className="create__thread__title ">
					<div className="border"></div>
					<h1 className="font_size_rule">Create New Thread</h1>
				</div>
				<div className="create__thread__target__container">
					<div className="create__thread__inputField__container">
						<InputField
							label="Thread Title"
							type="inputField__title"
							handleChange={handleTitleChange}
						/>
						<InputField
							label="Thread Text"
							type="inputField__body"
							handleChange={handleBodyChange}
						/>
						<div className="create__thread__inputImage">
							<h1>Image (optional)</h1>
							<input type="file" className="input__image"></input>
						</div>
					</div>
					<SubmitBtn name={"Create Thread"} onClick={handleSubmit} />
				</div>
			</div>
		</div>
	);
}
