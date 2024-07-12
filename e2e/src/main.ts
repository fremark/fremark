import './style.css'

import fremark from 'fremark'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = await String(fremark.process(``))

