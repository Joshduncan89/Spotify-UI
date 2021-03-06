import { SwitchHorizontalIcon, VolumeOffIcon } from "@heroicons/react/outline";
import {
  FastForwardIcon,
  RewindIcon,
  VolumeUpIcon,
  PlayIcon,
  PauseIcon,
  ReplyIcon,
} from "@heroicons/react/solid";
import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import { selectedPlaylist } from "../atoms/playlistAtom";
import useSongInfo from "../hooks/useSongInfo";
import { useSpotify } from "../hooks/useSpotify";

function Player() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [playlist, setPlaylist] = useRecoilState(selectedPlaylist);
  const [volume, setVolume] = useState(50);
  const [preVol, setPreVol] = useState(volume);

  const [playbackState, setPlaybackState] = useState();

  const songInfo = useSongInfo();

  useEffect(() => {
    if (spotifyApi.getAccessToken() && !currentTrack) {
      fetchCurrentSong();
      setVolume(50);
    }
  }, [currentTrack, playlist]);

  useEffect(() => {
    if (volume > 0 && volume < 100) {
      debounceVolume(volume);
    }
  }, [volume]);

  console.log(playlist);

  const fetchCurrentSong = () => {
    if (!songInfo) {
      spotifyApi.getMyCurrentPlayingTrack().then((data) => {
        setCurrentTrack(data.body?.item?.id);
      });

      spotifyApi.getMyCurrentPlaybackState().then((data) => {
        setPlaybackState(data);
        setIsPlaying(data.body?.is_playing);
      });
    }
  };

  const skipSong = () => {
    let nextSongIndex;
    const playlistLength = playlist.tracks.items.length;
    const currentSongIndex = playlist.tracks.items.findIndex(
      (song) => song.track.id === currentTrack
    );
    if (currentSongIndex === playlistLength - 1) {
      nextSongIndex = 0;
    } else {
      nextSongIndex = currentSongIndex + 1;
    }
    const nextSongData = playlist.tracks.items[nextSongIndex];
    spotifyApi.play({
      uris: [nextSongData.track.uri],
    });
    setIsPlaying(true);
    setCurrentTrack(nextSongData.track.id);
  };

  const skipToPrevious = () => {
    let nextSongIndex;
    const playlistLength = playlist.tracks.items.length;
    const currentSongIndex = playlist.tracks.items.findIndex(
      (song) => song.track.id === currentTrack
    );
    if (currentSongIndex === 0) {
      nextSongIndex = 0;
      // spotifyApi.seek(0);
    } else {
      nextSongIndex = currentSongIndex - 1;
    }
    const nextSongData = playlist.tracks.items[nextSongIndex];
    spotifyApi.play({
      uris: [nextSongData.track.uri],
    });
    setIsPlaying(true);
    setCurrentTrack(nextSongData.track.id);
  };

  const handlePlayPause = () => {
    spotifyApi.getMyCurrentPlaybackState().then((data) => {
      if (data.body.is_playing) {
        spotifyApi.pause();
        setIsPlaying(false);
      } else {
        spotifyApi.play();
        setIsPlaying(true);
      }
    });
  };

  const handleMute = () => {
    if (volume > 0) {
      setPreVol(volume);
      spotifyApi.setVolume(0);
      setVolume(0);
    } else {
      spotifyApi.setVolume(preVol);
      setVolume(preVol);
    }
  };

  const debounceVolume = useCallback(
    debounce((volume) => {
      spotifyApi.setVolume(volume);
    }, 400),
    []
  );

  return (
    <div className='h-24 bg-gradient-to-b from-black to-gray-800 text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8'>
      {/*LEFT*/}
      <div className='flex items-center space-x-4'>
        <img
          className='hidden md:inline h-10 w-10'
          src={songInfo?.album.images[0]?.url}
          alt=''
        />
        <div>
          <h3>{songInfo?.name}</h3>
          <p>{songInfo?.artists[0].name}</p>
        </div>
      </div>
      {/*CENTER*/}
      <div className='flex items-center justify-evenly'>
        <SwitchHorizontalIcon className='button' />
        <RewindIcon className='button' onClick={skipToPrevious} />
        {isPlaying ? (
          <PauseIcon className='button w-10 h-10' onClick={handlePlayPause} />
        ) : (
          <PlayIcon className='button w-10 h-10' onClick={handlePlayPause} />
        )}
        <FastForwardIcon className='button' onClick={skipSong} />
        <ReplyIcon className='button' />
      </div>
      {/*RIGHT*/}
      <div className='flex items-center space-x-3  md:space-x-4 justify-end pr-5'>
        {volume > 0 ? (
          <VolumeUpIcon className='button' onClick={handleMute} />
        ) : (
          <VolumeOffIcon className='button' onClick={handleMute} />
        )}
        <input
          type='range'
          min={0}
          max={100}
          className='w-14 md:w-28'
          onChange={(e) => setVolume(Number(e.target.value))}
          value={volume}
        />
      </div>
    </div>
  );
}

export default Player;
