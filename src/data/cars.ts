import { IMG, type ImageAsset } from './media'

export interface CarModel {
  name: string
  designation: string
  tagline: string
  image: ImageAsset
  stats: { label: string; value: string }[]
  accent: string
}

export const LINEUP: CarModel[] = [
  {
    name: 'Imperator GT',
    designation: '01, FLAGSHIP GRAND TOURER',
    tagline: 'Twelve cylinders, composed like a symphony.',
    image: IMG.lineupGT,
    stats: [
      { label: 'Power', value: '1,180 PS' },
      { label: '0–100', value: '2.4 s' },
      { label: 'V-Max', value: '350 km/h' },
    ],
    accent: '#e9e9ec',
  },
  {
    name: 'Velox RS',
    designation: '02, CIRCUIT INSTRUMENT',
    tagline: 'Downforce you can feel in your teeth.',
    image: IMG.lineupRS,
    stats: [
      { label: 'Power', value: '780 PS' },
      { label: 'Weight', value: '1,198 kg' },
      { label: 'Downforce', value: '820 kg' },
    ],
    accent: '#d6001c',
  },
  {
    name: 'Noctis E',
    designation: '03, ELECTRIC HYPER COUPE',
    tagline: 'Silence, weaponised.',
    image: IMG.lineupE,
    stats: [
      { label: 'Power', value: '1,400 PS' },
      { label: '0–100', value: '1.9 s' },
      { label: 'Range', value: '610 km' },
    ],
    accent: '#b9b9c0',
  },
]

export const FLAGSHIP_SPECS = [
  { value: 1180, suffix: ' PS', label: 'Combined output', decimals: 0 },
  { value: 2.4, suffix: ' s', label: '0–100 km/h', decimals: 1 },
  { value: 350, suffix: ' km/h', label: 'Top speed', decimals: 0 },
  { value: 1420, suffix: ' Nm', label: 'Peak torque', decimals: 0 },
]
