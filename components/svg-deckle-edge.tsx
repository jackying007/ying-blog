export default function () {
  return (
    <svg aria-hidden="true" height="0" width="0">
      <defs>
        <filter id="deckle-edge">
          <feTurbulence
            baseFrequency="0.04"
            numOctaves="3"
            result="turb"
            seed="7"
            type="turbulence"
          ></feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="turb"
            scale="1.5"
            xChannelSelector="R"
            yChannelSelector="G"
          ></feDisplacementMap>
        </filter>
      </defs>
    </svg>
  )
}
