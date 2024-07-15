// main entry file (e.g., index.js)
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store/Store.js";
import {
  Route,
  Router,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import {
  Home,
  Profile,
  Video,
  Following,
  Tweet,
  Playlist,
} from "./comps/Compiled";
import { SearchPage, Videopage, WatchHistoryPage } from "./pages/Compiled.js";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route index element={<Home />} />
      <Route path=":profile" element={<Profile />}>
        <Route index element={<Video />} />
        <Route path="following" element={<Following />} />
        <Route path="tweet" element={<Tweet />} />
        <Route path="playlist" element={<Playlist />} />
      </Route>
      <Route path="video/:videoId" element={<Videopage />} />
      <Route path="find/:user" element={<SearchPage />} />
      <Route path="watchHistory" element={<WatchHistoryPage />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <RouterProvider router={router} />
  </Provider>
);
