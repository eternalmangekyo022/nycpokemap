import { Marker, useMapEvent, } from 'react-leaflet'
import { LeafletMouseEvent } from 'leaflet';


export default function SelectPos({ setState, pos }: { pos: Coord2, setState: (dist: number, pos: Coord2) => void} ) {
	const NYC = [40.757400090129245, -73.98296356201173] as [number, number];
 
	const handleEvent = (e: LeafletMouseEvent) => {
		const dist = e.latlng.distanceTo(NYC)
		setState(Math.round(dist), e.latlng)
	}
  
	useMapEvent('click', handleEvent)
  
	return <Marker eventHandlers={{
		drag(e) {
			handleEvent(e as LeafletMouseEvent)
		}
	}} draggable position={pos} />
}