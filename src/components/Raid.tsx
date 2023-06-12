import { useRef } from 'react'
import { Map } from 'leaflet'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import PokeImage from './PokeImage'

interface Props {
	raid: Raid
	teams: { [key: string]: string }
}

export default function Raid({ raid, teams }: Props) {
	const map = useRef<Map>();

	const getColorByTeam = (team: number) => (
		{
			'0': 'white',
			'1': '#00C4FF',
			'2': '#FEA1A1',
			'3': '#FFD95A'
		}[team]
	)

	return <>
		<div className='w-[30rem] h-[25rem] border-2 flex flex-col relative items-center justify-evenly'>
		
		{/** this goes to top */}
			<span className='ml-2 mt-1 font-bold' style={{
				color: getColorByTeam(raid.team)
			}} >{teams[raid.team]}</span>
			<span>{raid.gym_name === '' ? '<Gym name missing>': raid.gym_name}</span>
			<PokeImage pokemon_id={raid.pokemon_id} />
			<MapContainer ref={map as React.Ref<Map>} zoomControl={false} className='w-[90%] h-[50%]' center={[raid.lat, raid.lng]} zoom={12.5} scrollWheelZoom={false} doubleClickZoom={false}>
				<TileLayer url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png' />
				<Marker position={[raid.lat, raid.lng]}>
					<Popup className='w-72'>{raid.pokemon_id}</Popup>
				</Marker>
			</MapContainer>
			<br />
			{ /** this goes to bottom */ }
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
}