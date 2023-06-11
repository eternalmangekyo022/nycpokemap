import { useState } from 'react'
//import { v4 } from 'uuid'

interface Props {
	pokemon_id: number
}

export default function PokeImage({ pokemon_id }: Props): JSX.Element {
	const [active, setActive] = useState(false);

return <>
		<img
			src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${active ? 'back/': ''}${pokemon_id}.png`} 
			alt=''
			className='w-20 h-20 absolute left-2 top-2'
			onMouseEnter={() => setActive(true)}
			onMouseLeave={() => setActive(false)}
		/>
	</>
}