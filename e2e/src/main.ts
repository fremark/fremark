import './style.css'

import fremark from 'fremark'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = await String(await fremark.process(`test^1
    `))
