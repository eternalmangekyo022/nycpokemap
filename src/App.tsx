import { useState } from 'react'
import axios from 'axios'
import { MapContainer, TileLayer } from 'react-leaflet'
import SelectPos from './components/SelectPos'
import CircleLoader from './components/CircleLoader'

// https://nycpokemap.com/raids.php
// https://nycpokemap.com/json/moves.json
// https://nycpokemap.com/json/forms.json

/* function calculateDistance([lat1, lon1]: [number, number], [lat2, lon2]: [number, number]): number {
  const degToRad = (degrees: number) => degrees * (Math.PI / 180);
  const R = 6371; // Radius of the Earth in kilometers
  const dLat: number = degToRad(lat2 - lat1);
  const dLon: number = degToRad(lon2 - lon1);
  const a: number =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c: number = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance: number = R * c;
  return distance;
} */


export default function App() {
  const MAX = 13000
  const NYC = [40.757400090129245, -73.98296356201173] as [number, number];
  const [raids, setRaids] = useState<Raid[]>([]);
  const [forms, setForms] = useState<null | { [key: string]: string }>(null);
  const [moves, setMoves] = useState<null | { [key: string]: string }>(null);

  const [location, setLocation] = useState<Coord | null>(null);
  const [distTo, setDistTo] = useState(0);
  const [markerPos, setMarkerPos] = useState<Coord2>({ lat: NYC[0], lng: NYC[1] });

  async function loadData() {
    let raids: Raid[];
    try {
      raids = (await axios.get<never, { data: { raids: Raid[] } }>('data.json')).data.raids;
    } catch {
      raids = (await axios.get<never, { data: { raids: Raid[] } }>('https://sour-stoat-53.deno.dev/', { headers: { 'Content-Type': 'application/json' } })).data.raids
      console.log(raids)
    }
    const { data: forms } = await axios.get('forms.json');
    const { data: moves } = await axios.get('moves.json')
    setForms(forms)
    setMoves(moves)
    setRaids(raids)
  }

  return <>
    <div className='w-screen h-screen relative overflow-hidden'>
      {location ? <>
        <div className='w-[90%] h-screen flex flex-col items-center relative left-1/2 -translate-x-1/2'>
          <header className='w-full h-[10%] border-b-2 flex items-center justify-start'>
            <button onClick={() => {setLocation(null); setRaids([])}}>
            <div className="w-4 h-4 border-l-2 border-t-2 border-[#808080] transform -rotate-45" />

            </button>
          </header>
          <div className='w-full h-[90%]'>
            {raids.length === 0 ? <CircleLoader />: <>
              {/** code here later */}
            </>}
          </div>
        </div>
      </>: <>
      <MapContainer className='w-screen h-[90vh] border-b-2 border-b-black' id='map' center={NYC} zoom={13} doubleClickZoom={false} scrollWheelZoom={true}>
        <TileLayer 
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <SelectPos pos={markerPos} setState={(dist, pos) => {
          setMarkerPos(pos)
          setDistTo(dist)
        }} />
      </MapContainer>
      <div className='w-screen h-[10vh] flex justify-center items-center relative'>
        <button
        onClick={() => {
          if(distTo < MAX) {
            setLocation([markerPos.lat, markerPos.lng])
            loadData()
          }
        }}
        style={{
          cursor: distTo > MAX ? 'not-allowed': 'pointer'
        }} className='w-28 h-12 border-2 rounded-lg duration-200 font-bold tracking-wide hover:bg-gray-200 '>Find raids</button>
        <span className='absolute left-[70%] top-[50%] -translate-y-1/2'>Distance to center NYC = <span className={distTo > MAX ? 'text-red-400': ''}>{distTo}</span>m</span>
      </div>
      </>}
    </div>
  </>
}