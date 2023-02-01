export const MacBookSVG = () => {
  return (
    <svg version="1.2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
      <title>macbook retina-sketch</title>
      <defs>
        <clipPath clipPathUnits="userSpaceOnUse" id="cp1">
          <path d="m800 0v600h-800v-600z" />
        </clipPath>
        <linearGradient id="g1" x1="400" y1="102" x2="400" y2="110" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#151515" />
          <stop offset="1" stopColor="#2c2c2c" />
        </linearGradient>
        <filter x="-50%" y="-50%" width="200%" height="200%" id="f1">
          <feDropShadow
            dx="-1.2246467991473532e-16"
            dy="2"
            stdDeviation="1.6666666666666667"
            floodColor="#000000"
            floodOpacity=".5"
          />
        </filter>
        <linearGradient id="g2" x1="399.7" y1="500.6" x2="399.7" y2="510.2" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#96979b" />
          <stop offset="1" stopColor="#2a2b2d" />
        </linearGradient>
        <linearGradient id="g3" x1="763" y1="494" x2="37" y2="494" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#808185" />
          <stop offset="0" stopColor="#95969a" />
          <stop offset="0" stopColor="#cfd0d2" />
          <stop offset="0" stopColor="#949599" />
          <stop offset="0" stopColor="#a7a8ac" />
          <stop offset="0" stopColor="#d3d3d6" />
          <stop offset=".1" stopColor="#d8d8d8" />
          <stop offset=".9" stopColor="#dddee0" />
          <stop offset="1" stopColor="#b1b2b4" />
          <stop offset="1" stopColor="#c2c3c7" />
          <stop offset="1" stopColor="#f1f3f2" />
          <stop offset="1" stopColor="#e9ebea" />
          <stop offset="1" stopColor="#d4d5d7" />
          <stop offset="1" stopColor="#7a7b7f" />
        </linearGradient>
        <linearGradient id="g4" x1="450.5" y1="490.6" x2="348.4" y2="490.6" gradientUnits="userSpaceOnUse">
          <stop offset="0" stopColor="#949599" />
          <stop offset="0" stopColor="#9e9fa3" />
          <stop offset=".1" stopColor="#b9babc" />
          <stop offset=".1" stopColor="#e0e1e3" />
          <stop offset=".9" stopColor="#d8d9db" />
          <stop offset=".9" stopColor="#c2c3c5" />
          <stop offset="1" stopColor="#8d8e90" />
        </linearGradient>
      </defs>
      <style>
        {`.s0 { fill: #121212 } 
		.s1 { fill: none;stroke: #c5c5c5;stroke-linejoin: round;stroke-width: 2 } 
		.s2 { fill: #282828 } 
		.s3 { fill: url(#g1) } 
		.s4 { fill: #103470 } 
		.s5 { filter: url(#f1);fill: url(#g2) } 
		.s6 { fill: url(#g3) } 
		.s7 { fill: url(#g4) } 
        `}
      </style>
      <g id="Page 1">
        <g id="Slices"></g>
        <g id="Mask by bg" clipPath="url(#cp1)">
          <g id="macbook pro retina">
            <g id="monitor">
              <path
                id="screen border"
                className="fill-[#121212]"
                d="m673 91c12.7 0 23 10.3 23 23v373h-593v-373c0-12.7 10.3-23 23-23z"
              />
              <path id="monitor" className="s1" d="m673 90c12.7 0 23 10.3 23 23v381h-593v-381c0-12.7 10.3-23 23-23z" />
              <path id="screen" className="s2" d="m678 116v348h-556v-348z" />
            </g>
            <g id="camera">
              <path
                id="Oval 5"
                className="s3"
                d="m396 106c0-2.2 1.8-4 4-4 2.2 0 4 1.8 4 4 0 2.2-1.8 4-4 4-2.2 0-4-1.8-4-4z"
              />
              <path
                id="Oval 6"
                className="s4"
                d="m398 106c0-1.1 0.9-2 2-2 1.1 0 2 0.9 2 2 0 1.1-0.9 2-2 2-1.1 0-2-0.9-2-2z"
              />
            </g>
            <g id="bottom">
              <path
                id="lower bottom"
                className="s5"
                d="m53.4 501h709.3c-11.5 7.8-29.3 9.2-29.3 9.2h-667.8c-21.4-2-29-9.6-29-9.6z"
              />
              <path id="upper bottom" className="s6" d="m763 487v14h-726v-14z" />
              <path
                id="indent"
                className="s7"
                d="m349.9 487.5h100.6c-1.1 6.7-6 8.5-6 8.5h-90.2c-5.8-2.7-5.9-8.5-5.9-8.5"
              />
            </g>
          </g>
        </g>
      </g>
    </svg>
  )
}
