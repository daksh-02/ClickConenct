import React from "react";
import { Input } from "@/components/ui/input";
import Login from "@/comps/Login";
import Signup from "@/comps/Signup";
import defaultuser from "../assets/defuser.jpg";
import { useSelector, useDispatch } from "react-redux";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";
import Logout from "@/alerts/Logout";

const Navbar = () => {
  const { isLoggedIn, avatar, username } = useSelector(
    (state) => state.userInfo
  );

  return (
    <nav className="bg-black text-white flex items-center justify-between p-4 border-b border-white">
      <div className="flex items-center space-x-4">
        <img src="/path/to/logo.png" alt="Logo" className="h-10" />
      </div>
      <div className="flex-grow flex justify-center">
        <Input
          className="bg-gray-800 text-white w-full max-w-md"
          placeholder="Search"
        />
      </div>
      {!isLoggedIn ? (
        <div className="flex items-center space-x-2">
          <Login />
          <Signup />
        </div>
      ) : (
        <div className="flex gap-4">
          <Link to={`/${username}`}>
            <Avatar>
              <AvatarImage src={avatar ? avatar : defaultuser} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </Link>
          <Logout />
        </div>
      )}
    </nav>
  );
};

export default Navbar;
