/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
function getDistance([lat1, lon1]: Coord, [lat2, lon2]: Coord): number {
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
}

function useTSP(pos: Coord, raids: Raid[], amount = 10): Raid[] {
	let final: Raid[] = [];
	let added: number[] = [];
	
	while(final.length < amount) {
		let _smallest = getDistance([raids[0].lat, raids[0].lng], pos)
		let smallest = raids[0]
		let idx = 0;
		for(let i = 0; i < raids.length; i++) {
			if(added.includes(i)) continue
			const dist = getDistance(pos, [raids[i].lat, raids[i].lng]);
			if(dist < _smallest) {
				smallest = raids[i]
				_smallest = dist
				idx = i
			}
		}
		final = [...final, smallest]
		added = [...added, idx]
	}

	return final;
}

export { useTSP as tsp };

