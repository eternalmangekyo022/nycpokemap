import { useState, useRef } from 'react';
import axios from 'axios'
import SelectPos from './components/SelectPos'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import CircleLoader from './components/CircleLoader'
import PokeImage from './components/PokeImage';
import { tsp } from './hooks'


// https://nycpokemap.com/raids.php
// https://nycpokemap.com/json/moves.json
// https://nycpokemap.com/json/forms.json
// https://pokeapi.co/api/v2/

/**
 * level 6 : mega
 * level 1 : lvl 1
 * level 1 : lvl 1 shadow
 * level 3 : lvl 3
 * 
 */
export default function App() {
  const MAX = 30000
  const NYC = [40.757400090129245, -73.98296356201173] as [number, number];
  const [raids, setRaids] = useState<Raid[]>([]);
  const forms = useRef<{ [key: string]: string }>({});
  const moves = useRef<{ [key: string]: string }>({});
  const teams = useRef<{ [key: string]: string }>({});
  const [maxRaids, setMaxRaids] = useState(36);
  // (Date.UTC(0, 0, 1) * -1 + Date.UTC(2023, 5, 10)) - Date.UTC(0, 0, 1) * -1 ----- today

  const [location, setLocation] = useState<Coord | null>(null);
  const [distTo, setDistTo] = useState(0);
  const [markerPos, setMarkerPos] = useState<Coord2>({ lat: NYC[0], lng: NYC[1] });

  async function loadData(location: Coord) {
    let raids: Raid[];
    try {
      raids = (await axios.get<never, { data: { raids: Raid[] } }>('data.json')).data.raids;
    } catch {
      if(10 < Math.random()) setMaxRaids(0)
      raids = (await axios.get<never, { data: { raids: Raid[] } }>('https://sour-stoat-53.deno.dev/', { headers: { 'Content-Type': 'application/json' } })).data.raids
    }
    const { data: _forms } = await axios.get('forms.json');
    const { data: _moves } = await axios.get('moves.json');
    const { data: _teams } = await axios.get('teams.json');
    forms.current = _forms
    moves.current = _moves
    teams.current = _teams
    setRaids(tsp(location, raids.filter(raid => raid.pokemon_id !== 0), 36))
  }
  const getColorByTeam = (team: number) => (
    {
      '0': 'white',
      '1': '#00C4FF',
      '2': '#FEA1A1',
      '3': '#FFD95A'
    }[team]
  )

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
                {raids.map((raid, idx) => {
                  if(idx < maxRaids) return <>
                    <div className='w-[30rem] h-[25rem] border-2 flex flex-col relative items-center justify-evenly'>
                      
                      {/** this goes to top */}
                      <span className='ml-2 mt-1 font-bold' style={{
                        color: getColorByTeam(raid.team)
                      }} >{teams.current[raid.team]}</span>
                      <span>{raid.gym_name === '' ? '<Gym name missing>': raid.gym_name}</span>
                      <PokeImage pokemon_id={raid.pokemon_id} />
                      <MapContainer zoomControl={false} className='w-[90%] h-[50%]' center={[raid.lat, raid.lng]} zoom={12.5} scrollWheelZoom={false} doubleClickZoom={false}>
                        <TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
                        <Marker position={[raid.lat, raid.lng]}>
                          <Popup className='w-72'>{raid.pokemon_id}</Popup>
                        </Marker>
                      </MapContainer>
                      <br />
                      { /** this goes to bottom */}
                      <div className='absolute w-full bottom-0 h-[10%] border-t-2 flex items-center'>
                        <a target='_blank' href={`https://maps.google.com/maps?q=${raid.lat},${raid.lng}`} className='text-xs ml-[95%]'>
                          <img src="https://www.svgrepo.com/show/469229/maps.svg" width={21} alt="" />
                        </a>
                        <button className='text-xs absolute left-1'>
                          <img src="https://www.svgrepo.com/show/387251/copy.svg" onClick={() => navigator.clipboard.writeText(`${raid.lat}, ${raid.lng}`)} width={21} alt="" />
                        </button>
                      </div>
                    </div>
                  </>
                })}
              </>}
            </div>
          </div>
        </div>
      </>: <>
      <MapContainer className='w-screen h-[90vh] border-b-2 border-b-black' center={NYC} zoom={13} doubleClickZoom={false} scrollWheelZoom={true}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <SelectPos pos={markerPos} setState={(dist, pos) => {
          setMarkerPos(pos)
          setDistTo(dist)
        }} />
      </MapContainer>
      <div className='w-screen h-[10vh] flex justify-center items-center relative'>
        <button
        onClick={() => {
          if(distTo < MAX) {
            const temp: Coord = [markerPos.lat, markerPos.lng];
            setLocation(temp)
            loadData(temp)
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