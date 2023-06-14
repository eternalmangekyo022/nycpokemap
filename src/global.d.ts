export {};

declare global {
	interface Raid {
		gym_name: string
		cell_id: null | number
		ex_raid_eligible: 0 | 1
		sponsor: null | string
		lat: number
		lng: number
		raid_spawn: number
		raid_start: number
		raid_end: number
		pokemon_id: number
		level: number
		cp: number
		team: number
		move1: string
		move2: string
		is_exclusive: 0 | 1
		form: number
		gender: number
	}
}