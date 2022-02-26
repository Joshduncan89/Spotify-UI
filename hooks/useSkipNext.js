import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { playlistIdState } from "../atoms/playlistAtom";
import { useSpotify } from "./useSpotify";

function useSkipNext() {
  const spotifyApi = useSpotify();
  const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);
  const [queue, setQueue] = useState([]);

  useEffect(() => {
    const albumInfo = async () => {
      const tracks = await fetch(
        `https://api.spotify.com/v1/playlists/${playlistId}/tracks`,
        {
          headers: {
            Authorization: `Bearer ${spotifyApi.getAccessToken()}`,
          },
        }
      )
        .then((data) => data.json())
        .catch((err) => console.error(err));
      setQueue(tracks.items);
    };
    albumInfo();
  }, [spotifyApi, playlistId]);

  return queue;
}

export default useSkipNext;
