export default class Coord {
	lat: number
	lng: number
	constructor(lat: number, lng: number) {
		this.lat = lat;
		this.lng = lng;
	}
	
	toList = () => [this.lat, this.lng]
	toObj = () => ({ lat: this.lat, lng: this.lng })
}