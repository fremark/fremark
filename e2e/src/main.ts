import './style.css'

import fremark from 'fremark'
import { readSync } from 'to-vfile'

import exampleMd from './example.md?raw'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = await String(await fremark.process(exampleMd))


