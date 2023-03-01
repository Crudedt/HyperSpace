import Navbar from "./components/navbar/Navbar.js"

export default function App() {
  const user = {
    id: 'ketsu_no_ana117',
    subscription: 'Milky Way Astronout',
    profilePicture: 'https://i.pximg.net/img-master/img/2023/02/24/09/23/10/105661350_p0_master1200.jpg'
  }

  return (
    <Navbar User={user} isLogin={true}/>
  );
}
