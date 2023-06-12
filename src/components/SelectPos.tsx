import { Marker, useMapEvent, } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet';
import Coord from '../Coord'

export default function SelectPos({ setState, pos }: { pos: Coord, setState: (dist: number, pos: Coord) => void} ) {
	const NYC = [40.757400090129245, -73.98296356201173] as [number, number];
 
	const handleEvent = (e: LeafletMouseEvent) => {
		const dist = e.latlng.distanceTo(NYC)
		setState(Math.round(dist), new Coord(e.latlng.lat, e.latlng.lng))
	}
  
	useMapEvent('click', handleEvent)
  
	return <Marker eventHandlers={{
		drag(e) {
			handleEvent(e as LeafletMouseEvent)
		}
	}} draggable position={pos} />
}