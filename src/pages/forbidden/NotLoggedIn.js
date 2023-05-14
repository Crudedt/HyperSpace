import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import "../notfound/NotFound.css";

export default function NotFound() {
	const logoImg = process.env.PUBLIC_URL + "assets/hyperspace-logo.png";

	const currentPage = useLocation();

	useEffect(() => {
		document.title = "403 Forbidden";

		return () => {
			document.title = "Hyperspace";
		};
	}, []);

	useEffect(() => {
		document.title = "403 Forbidden";
	}, [currentPage]);

	return (
		<div className="NotFoundPage-container">
			<h1 className="NotFoundPage-h1">
				<span className="NotFoundPage-header-textSpan">4</span>0
				<span className="NotFoundPage-header-textSpan">4</span> Page is
				Forbidden For Guests
			</h1>

			<p className="NotFoundPage-p">
				You must be logged in to view this page. Sorry about that.
				<br></br>
				Try searching for something else
			</p>

			<div className="NotFoundPage-subcontainer">
				<Link to="/">
					<h2 className="NotFoundPage-h2">Head back to home</h2>
				</Link>
				<img
					className="NotFoundPage-logoImg"
					src={logoImg}
					alt="Hyperspace Logo"
				/>
			</div>
		</div>
	);
}
