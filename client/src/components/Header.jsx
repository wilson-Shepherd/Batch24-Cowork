import { Link } from "react-router-dom";
import "./Header.css";

const Header = () => {
  return (
    <nav>
      <ul className="nav-items">
        <li>
          <Link to="/home">首頁</Link>
        </li>
        <li>
          <Link to="/check">查看URL</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
