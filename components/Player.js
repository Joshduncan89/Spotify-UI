import { useSession } from "next-auth/react";
import { useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import useSongInfo from "../hooks/useSongInfo";
import { useSpotify } from "../hooks/useSpotify";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [volume, setVolume] = useState(50);

  const songInfo = useSongInfo();

  console.log(songInfo);

  return (
    <div>
      <div>
        <img
          className='hidden md:inline h-10 w-10'
          src={songInfo?.album.images[0]?.url}
          alt=''
        />
      </div>
    </div>
  );
}

export default Player;
