import { useState, useRef } from 'react';
import axios from 'axios';
import { MapContainer, TileLayer } from 'react-leaflet';
import { Map } from 'leaflet'; // hand made stuff
import SelectPos from './components/SelectPos';
import CircleLoader from './components/CircleLoader';
import { tsp } from './hooks';
import Coord from './Coord';
import Raid from './components/Raid';

// https://nycpokemap.com/raids.php
// https://nycpokemap.com/json/moves.json
// https://nycpokemap.com/json/forms.json
// https://pokeapi.co/api/v2/

/**
 * level 6 : mega
 * level 1 : lvl 1
 * level 1 : lvl 1 shadow
 * level 3 : lvl 3
 */

export default function App() {
  const MAX = 20000
  const NYC = [40.757400090129245, -73.98296356201173] as [number, number];
  const mapRef = useRef<Map>();
  const [raids, setRaids] = useState<Raid[]>([]);
  //const [maxRaids, setMaxRaids] = useState(36);
  const maxRaids = 36;
  // (Date.UTC(0, 0, 1) * -1 + Date.UTC(2023, 5, 10)) - Date.UTC(0, 0, 1) * -1 ----- today
  const [location, setLocation] = useState<Coord | null>(null);
  const [distTo, setDistTo] = useState(0);
  const [markerPos, setMarkerPos] = useState<Coord>(new Coord(NYC[0], NYC[1]));
  const forms = useRef<{ [key: string]: string }>({});
  const moves = useRef<{ [key: string]: string }>({});
  const teams = useRef<{ [key: string]: string }>({});

  async function loadData(location: Coord) {
    let raids: Raid[];
    try {
      raids = (await axios.get<{ raids: Raid[] }>('data.json')).data.raids;
    } catch {
      raids = (await axios.get<{ raids: Raid[] }>('https://sour-stoat-53.deno.dev/', { headers: { 'Content-Type': 'application/json' } })).data.raids;
    }
    
    const { data: _forms } = await axios.get('forms.json');
    const { data: _moves } = await axios.get('moves.json');
    const { data: _teams } = await axios.get('teams.json');
    forms.current = _forms;
    moves.current = _moves;
    teams.current = _teams;
    setRaids(tsp(location, raids.filter(raid => raid.pokemon_id !== 0), maxRaids).map(raid => ({ ...raid, move1: _moves[raid.move1], move2: _moves[raid.move2] })))
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
            <div className='w-full h-16 border-b-2 flex justify-between items-center'>
              {/** filters */}
            </div>
            <br />
            <div className='w-full h-[90%] overflow-y-scroll flex justify-center items-center flex-wrap gap-5'>
              {raids.length === 0 ? <CircleLoader />: <>
                {/** code here later */}
                {raids.map(raid => <Raid raid={raid} teams={teams.current} /> )}
              </>}
            </div>
          </div>
        </div>
      </>: <>
      <MapContainer ref={mapRef as React.Ref<Map>} className='w-screen h-[90vh] border-b-2 border-b-black' center={NYC} zoom={13} doubleClickZoom={false} scrollWheelZoom={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SelectPos pos={markerPos} handler={(dist, pos) => {
          setMarkerPos(pos)
          setDistTo(dist)
        }} />
      </MapContainer>
      <div className='w-screen h-[10vh] flex justify-center items-center relative'>
        <button
        onClick={() => {
          if(distTo < MAX) {
            setLocation(markerPos)
            loadData(markerPos)
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