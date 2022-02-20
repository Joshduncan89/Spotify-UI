import React from "react";
import { useRecoilValue } from "recoil";
import { selectedPlaylist } from "../atoms/playlistAtom";
import Song from "./Song";

export const Songs = () => {
  const playlist = useRecoilValue(selectedPlaylist);
  console.log(playlist);
  return (
    <div className='flex flex-col px-8 space-y-1 pb-28 text-white'>
      {playlist?.tracks.items.map((track, i) => (
        <Song key={i} track={track} order={i} />
      ))}
    </div>
  );
};
