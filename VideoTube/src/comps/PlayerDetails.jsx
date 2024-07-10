import React, { useEffect, useState } from "react";
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiOutlineSave,
  AiFillLike,
  AiFillDislike,
} from "react-icons/ai";
import { SlUserFollowing } from "react-icons/sl";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useParams } from "react-router-dom";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import axios from "axios";
import { server } from "@/constants";
import { useSelector } from "react-redux";
import { LiaUserEditSolid } from "react-icons/lia";

const PlayerDetail = ({ video }) => {
  const curUsername = useSelector((state) => state.userInfo.username);
  const { videoId } = useParams();
  const [like, setLike] = useState(null);
  const [disLike, setDisLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const toggleLike = async () => {
    try {
      const response = await axios.post(
        `${server}/likes/toggle/v/${videoId}`,
        {},
        { withCredentials: true }
      );
      const res = response.data;
      if (res.message === "Like Added") {
        setLike(true);
        setLikeCount((prevCount) => prevCount + 1);
        setDisLike(false);
      } else if (res.message === "Like Removed") {
        setLike(false);
        setLikeCount((prevCount) => prevCount - 1);
      }
    } catch (error) {
      console.log("Unable to make changes to the like button", error);
    }
  };

  const handleDisLike = async () => {
    setDisLike(!disLike);
    if (like && !disLike) {
      await toggleLike();
    }
  };

  useEffect(() => {
    const getTotalLikes = async () => {
      try {
        const response = await axios.get(`${server}/videos/likes/${videoId}`, {
          withCredentials: true,
        });
        const res = response.data;
        setLikeCount(res.data.totalLikes);
        if (like === null) {
          const isLiked = await axios.get(
            `${server}/likes/toggle/v/${videoId}`,
            { withCredentials: true }
          );
          setLike(isLiked.data.data.isLiked);
          console.log(isLiked.data);
        }
      } catch (error) {
        console.log("Unable to fetch likes", error);
      }
    };
    getTotalLikes();
  }, [videoId, like]);

  const toggleSubscription = async () => {
    try {
      const response = await axios.post(
        `${server}/subscriptions/c/${video.ownerDetails.username}`,
        {},
        { withCredentials: true }
      );
      console.log(response.data);
      setIsSubscribed(!isSubscribed);
    } catch (error) {}
  };

  useEffect(() => {
    const checkSubscription = async () => {
      try {
        const response = await axios.get(
          `${server}/subscriptions/${video.ownerDetails.username}`,
          {
            withCredentials: true,
          }
        );
        const res = response.data;
        setIsSubscribed(res.data.status);
        console.log(res);
      } catch (error) {
        console.log(error);
      }
    };
    if (video && video.ownerDetails.username !== curUsername)
      checkSubscription();
  }, [video]);

  return (
    <div className="my-6 border-2 border-white rounded-lg">
      <div className="p-4 px-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-white text-2xl font-bold mt-2 overflow-hidden text-ellipsis max-w-full">
              {video ? video.title : "Default Video Title"}
            </h1>
            <div className="text-white flex items-center space-x-2 mt-2">
              <span>{video ? `${video.views} Views` : "0 Views"}</span>
              <span>•</span>
              <span>
                {video ? getTimeDifference(video.createdAt) : "Just now"}
              </span>
            </div>
          </div>
          <div className="flex space-x-4 mr-4">
            <div className="flex gap-4 border-y-2 border-x border-white px-2 rounded-lg">
              <button
                className="flex items-center text-white space-x-2"
                onClick={toggleLike}
              >
                {like ? (
                  <AiFillLike size={20} style={{ color: "#ff00ff" }} />
                ) : (
                  <AiOutlineLike size={20} style={{ color: "#ff00ff" }} />
                )}
                <span>{likeCount === 0 ? "" : likeCount}</span>
              </button>
              <button
                className="flex items-center text-white space-x-2"
                onClick={handleDisLike}
              >
                {disLike ? (
                  <AiFillDislike size={20} />
                ) : (
                  <AiOutlineDislike size={20} />
                )}
              </button>
            </div>
            <Button variant="secondary" className="ml-4">
              <AiOutlineSave className="mr-2" size={18} />
              <span className="font-bold">Save</span>
            </Button>
          </div>
        </div>
        {video && (
          <div className="flex justify-between items-center mt-4">
            <Link to={`/${video.ownerDetails.username}`}>
              <div className="flex items-center mb-3 gap-2">
                <Avatar className="h-12 w-12 hover:border-2 border-purple-500">
                  <AvatarImage src={video.ownerDetails.avatar} />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <p className="text-white text-lg hover:text-purple-500 hover:underline hover:underline-offset-4 hover:decoration-purple-500">
                  {video.ownerDetails.username}
                </p>
              </div>
            </Link>
            {video && video.ownerDetails.username === curUsername ? (
              <Button className="text-white bg-purple-500 hover:bg-purple-700 mr-4 mb-2">
                {<LiaUserEditSolid className="mr-2" size={20} />} Edit
              </Button>
            ) : !isSubscribed ? (
              <Button
                className="text-white bg-purple-500 hover:bg-purple-700 mr-4 mb-2"
                onClick={toggleSubscription}
              >
                <SlUserFollowing className="mr-2" /> Subscribe
              </Button>
            ) : (
              <Button
                className="text-white bg-purple-700 hover:bg-purple-500 mr-4 mb-2"
                onClick={toggleSubscription}
              >
                <SlUserFollowing className="mr-2" /> Subscribed
              </Button>
            )}
          </div>
        )}
        <Accordion
          type="single"
          collapsible
          className="text-white border-t border-white mt-6"
        >
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-lg">Description</AccordionTrigger>
            <AccordionContent>
              {video ? video.description : ""}
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

const getTimeDifference = (date) => {
  const now = new Date();
  const videoDate = new Date(date);
  const diffInSeconds = Math.floor((now - videoDate) / 1000);

  const minutes = Math.floor(diffInSeconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) return `${years} year${years > 1 ? "s" : ""} ago`;
  if (months > 0) return `${months} month${months > 1 ? "s" : ""} ago`;
  if (days > 0) return `${days} day${days > 1 ? "s" : ""} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  return `just now`;
};

export default PlayerDetail;
