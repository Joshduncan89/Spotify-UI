import { useRecoilState } from "recoil";
import { currentTrackState, isPlayingState } from "../atoms/songAtom";
import { convertToDuration } from "../config";
import { useSpotify } from "../hooks/useSpotify";

export const Song = ({ order, track }) => {
  const spotifyApi = useSpotify();
  const [currentTrack, setCurrentTrack] = useRecoilState(currentTrackState);
  const [isPlaying, setIsPlaying] = useRecoilState(isPlayingState);

  const playSong = () => {
    setIsPlaying(true);
    setCurrentTrack(track.track.id);
    spotifyApi.play({
      uris: [track.track.uri],
    });
  };

  return (
    <div
      className='grid grid-cols-2 text-gray-500 py-4 px-5 hover:bg-gray-900 rounded-lg cursor-pointer'
      onClick={playSong}
    >
      <div className='flex items-center space-x-4'>
        <p>{order + 1}</p>
        <img
          src={track.track.album.images[0].url}
          alt=''
          className='w-10 h-10'
        />
        <div>
          <p className='w-36 lg:w-64 truncate text-white'>{track.track.name}</p>
          <p className='w-40'>{track.track.artists[0].name}</p>
        </div>
      </div>

      <div className='flex items-center justify-between ml-auto md:ml-0'>
        <p className='w-40 hidden md:inline'>{track.track.album.name}</p>
        <p>{convertToDuration(track.track.duration_ms)}</p>
      </div>
    </div>
  );
};
