import { Route, Routes, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";

import Album from "./pages/Album";
import Artist from "./pages/Artist";
import Category from "./pages/Category";
import Home from "./pages/Home";
import Navbar from "./components/NavBar";
import Player from "./components/Player";
import { PlayerContext } from "./context/PlayerContext";
import Playlist from "./pages/Playlist";
import Search from "./pages/Search";
import SpinStretch from "react-cssfx-loading/lib/SpinStretch";
import client from "./shared/spotify-client";

enum LoadingStates {
  loading,
  finished,
  error,
}

export default function App() {
  const [loadingState, setLoadingState] = useState(LoadingStates.loading);

  const { playerId } = useContext(PlayerContext);

  useEffect(() => {
    localStorage.setItem("minizing-playing", playerId);
  }, [playerId]);

  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location]);

  useEffect(() => {
    fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${btoa(`fc0889e7c1ba48228dbe8cd9a3a1fb3e:8f7f6e74a92248638ab10a6aa964887a`)}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.access_token) {
          setLoadingState(LoadingStates.finished);
          client.setAccessToken(data.access_token);
        } else setLoadingState(LoadingStates.error);
      })
      .catch((err) => {
        console.log(err);
        setLoadingState(LoadingStates.error);
      });
  }, []);

  if (loadingState === LoadingStates.loading)
    return (
      <div className="w-screen h-screen flex justify-center items-center">
        <SpinStretch />
      </div>
    );

  // if (loadingState === LoadingStates.error) return <div className="h-screen w-screen flex justify-center items-center style">Please Check Your Internet Connection</div>

  let components;
  switch (window.location.pathname) {
    case "/":
      // components = <Home />;
      break;
    case "/category/":
      components = <Category />;
      break;
    case "/playlist":
      components = <Playlist />;
      break;
    default:
      break;
  }

  return (
    <>
      <Navbar />
      {components}
      <div className="min-h-[calc(100vh-144px)]">
        <Routes>
          <Route index element={<Home />} />
          <Route path="album/:id" element={<Album />} />
          <Route path="playlist/:id" element={<Playlist />} />
          <Route path="category/:id" element={<Category />} />
          <Route path="artist/:id" element={<Artist />} />
          <Route path="search" element={<Search />} />
        </Routes>
      </div>

      {!!playerId && <Player key={playerId} />}
    </>
  );
}
