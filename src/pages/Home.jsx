import { logoutUser } from "../firebase/auth";
import pfp from "../img/person-circle.svg"

export default function Home() {
  return (
    <div className="container">
      <div className="home-wrapper">
        <div className="home-navbar">
          <div className="navbar-left">
            <img src={pfp} alt="" className="profile-picture" />
          </div>
          <div className="navbar-right">
            <ul className="navbar-ul">
              <li className="navbar-li">
                <p className="navbar-link">Support</p>
              </li>
              <li className="navbar-li">
                <p className="navbar-link">About us</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
