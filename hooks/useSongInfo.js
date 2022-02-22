import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState } from "../atoms/songAtom";
import { useSpotify } from "./useSpotify";

function useSongInfo() {
  const spotifyApi = useSpotify();
  const [trackId, setTrackId] = useRecoilState(currentTrackState);
  const [songInfo, setSongInfo] = useState(null);

  useEffect(() => {
    const fetchSongInfo = async () => {
      if (trackId) {
        const trackInfo = await fetch(
          `https://api.spotify.com/v1/tracks/${trackId}`,
          {
            headers: {
              Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
            },
          }
        ).then((res) => res.json());
        setSongInfo(trackInfo);
      }
    };
    fetchSongInfo();
  }, [trackId, spotifyApi]);

  return songInfo;
}

export default useSongInfo;
