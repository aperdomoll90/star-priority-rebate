export const DownloadSVG = ({ className, color='#fbfbfb' }: { className?: string, color?:string }) => {
 
  return (
    <svg className={className} viewBox='0 0 269 233' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M87.4999 139H21.4999C16.1666 138 5.49994 139.6 5.49994 154C5.49994 168.4 5.49994 195.667 5.49994 207.5C4.99994 214.5 7.49994 228.5 21.4999 228.5C35.4999 228.5 180.667 228.5 251.5 228.5C255.833 227.833 264.5 224.1 264.5 214.5C264.5 204.9 264.5 170.167 264.5 154C264.667 149 262.3 139 251.5 139C240.7 139 201.333 139 183 139'
        stroke={color}
        strokeWidth='9'
        strokeLinecap='round'
        className='svg-rectangle'
      />
      <path className='svg-arrow' d='M204.5 88L145.5 148C136.3 157.2 129.167 151.833 126 148C107.833 133.167 68.1203 91.6004 65 88C58.5 80.5 61.5 70 69 70H109V8C109 1.2 113.333 0.166667 115.5 0H154.5C161.3 0 162.333 6 162 9V70H198.5C210.5 70 211.5 81 204.5 88Z' fill={color} />
      <circle className='svg-circle' cx='221.5' cy='187.5' r='12.5' fill={color} />
    </svg>
  )
}
