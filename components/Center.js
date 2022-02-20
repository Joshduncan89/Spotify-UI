import { ChevronDownIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import { shuffle } from "lodash";
import { useState, useEffect } from "react";
import { playlistIdState, selectedPlaylist } from "../atoms/playlistAtom";
import { useRecoilValue, useRecoilState } from "recoil";
import spotifyApi from "../lib/spotify";
import { Songs } from "./Songs";

export const Center = () => {
  const { data: session } = useSession();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(selectedPlaylist);

  const colors = [
    "from-indigo-500",
    "from-pink-500",
    "from-blue-500",
    "from-green-500",
    "from-red-500",
    "from-cyan-500",
    "from-yellow-500",
    "from-purple-500",
  ];

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    spotifyApi
      .getPlaylist(playlistId)
      .then((data) => {
        setPlaylist(data.body);
      })
      .catch((err) => console.log("something went wrong", err));
  }, [playlistId, spotifyApi]);

  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
      <header className='top-5 right-8 absolute'>
        <div className='flex bg-black text-white items-center space-x-3 opacity-90 hover:opacity-80 cursor-pointer rounded-full p-1 pr-2'>
          <img
            className='rounded-full w-10 h-10'
            src={session?.user.image}
            alt='user'
          />
          <h2>{session?.user.name}</h2>
          <ChevronDownIcon className='h-5 w-5' />
        </div>
      </header>
      <section
        className={`flex items-end bg-gradient-to-b to-black ${color} h-80 p-8 text-white space-x-7`}
      >
        <img
          src={playlist?.images?.[0]?.url || "/images/logo.jpg"}
          className='h-44 w-44 shadow-xl'
        />
        <div>
          <p>Playlist</p>
          <h1 className='text-2xl md:text-3xl xl:text-4xl'>{playlist.name}</h1>
        </div>
      </section>
      <Songs />
    </div>
  );
};