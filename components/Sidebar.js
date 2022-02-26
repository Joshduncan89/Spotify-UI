import {
  HomeIcon,
  SearchIcon,
  LibraryIcon,
  PlusCircleIcon,
  RssIcon,
  HeartIcon,
} from "@heroicons/react/outline";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useSpotify } from "../hooks/useSpotify";
import { playlistIdState } from "../atoms/playlistAtom";
import { useRecoilState } from "recoil";

export const Sidebar = () => {
  const { data: session } = useSession();
  const [playlist, setPlaylist] = useState([]);
  // const [songs, setSongs] = useState([]);
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const spotifyApi = useSpotify();

  useEffect(() => {
    if (spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylist(data.body.items);
      });
    }
  }, [session, spotifyApi]);

  return (
    <div className='text-gray-500 p-5 text-xs lg:text-sm border-r border-gray-900 overflow-y-scroll h-screen scrollbar-hide sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-30'>
      <div className='space-y-4'>
        <button className='flex items-center hover:text-white space-x-2'>
          <HomeIcon className='h-5 w-5' />
          <p>Home</p>
        </button>
        <button className='flex items-center hover:text-white space-x-2'>
          <SearchIcon className='h-5 w-5' />
          <p>Search</p>
        </button>
        <button className='flex items-center hover:text-white space-x-2'>
          <LibraryIcon className='h-5 w-5' />
          <p>My Library</p>
        </button>
        <hr className='border-t-[.01px] border-gray-900' />

        <button className='flex items-center hover:text-white space-x-2'>
          <PlusCircleIcon className='h-5 w-5' />
          <p>Create Playlist</p>
        </button>
        <button className='flex items-center hover:text-white space-x-2'>
          <HeartIcon className='h-5 w-5' />
          <p>Search</p>
        </button>
        <button className='flex items-center hover:text-white space-x-2'>
          <RssIcon className='h-5 w-5' />
          <p>Library</p>
        </button>
        <hr className='border-t-[.01px] border-gray-900' />
        {playlist.map((p) => (
          <p
            key={p.id}
            onClick={() => {
              setPlaylistId(p.id);
            }}
            className='cursor-pointer hover:text-white'
          >
            {p.name}
          </p>
        ))}
      </div>
    </div>
  );
};
