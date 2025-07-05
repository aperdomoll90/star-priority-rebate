export const UserIcon = ({
  className = 'profile-icon',
  backgroundColor = '#F4F3F2',
  personColor = '#47565C',
}: {
  className?: string
  backgroundColor?: string
  personColor?: string
}) => {
  return (
    <svg className={className} viewBox='0 0 77 78' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <circle cx='38.5' cy='38.5' r='38.5' fill={backgroundColor} />
      <circle cx='39' cy='31' r='13' fill={personColor} />
      <path
        d='M15 67.5V69.5C18 71.5 26 77 39 77.5C42.997 77.6537 52.5 76 61.5 69.5C61.3333 68.8333 61.5 68 61.5 67C61.5 62.2 56.5 48 41.5 48H36C22 48 15 59.5 15 67.5Z'
        fill={personColor}
      />
    </svg>
  )
}

export const CloseIcon = ({ className = 'close-icon', color = '#F4F3F2' }: { className?: string; color?: string }) => {
  return (
    <svg className={className} viewBox='0 0 123 123' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        fill-rule='evenodd'
        clip-rule='evenodd'
        d='M1.62994 97.9899L38.1799 61.4399L1.62994 24.8899C-0.540059 22.7199 -0.540059 19.1599 1.62994 16.9899L16.9899 1.62994C19.1599 -0.540059 22.7199 -0.540059 24.8899 1.62994L61.4399 38.1799L97.9899 1.62994C100.16 -0.540059 103.72 -0.540059 105.89 1.62994L121.25 16.9899C123.42 19.1599 123.42 22.7199 121.25 24.8899L84.6999 61.4399L121.25 97.9899C123.42 100.16 123.42 103.72 121.25 105.89L105.89 121.25C103.72 123.42 100.16 123.42 97.9899 121.25L61.4399 84.6999L24.8899 121.25C22.7199 123.42 19.1599 123.42 16.9899 121.25L1.62994 105.89C-0.540059 103.72 -0.540059 100.16 1.62994 97.9899Z'
        fill={color}
      />
    </svg>
  )
}

export const CheckmarkIcon = ({ className = 'close-icon', color = '#F4F3F2' }: { className?: string; color?: string }) => {
  return (
    <svg className={className} viewBox='0 0 156 124' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path d='M131.852 0.458252L58.5 75.3394L24.141 42.8997L0 66.9559L58.5 123.458L156 24.508L131.852 0.458252Z' fill={color} />
    </svg>
  )
}

export const DownloadIcon = ({ className, color = '#fbfbfb' }: { className?: string; color?: string }) => {
  return (
    <svg className={className} viewBox='0 0 269 233' fill='none' xmlns='http://www.w3.org/2000/svg'>
      <path
        d='M87.4999 139H21.4999C16.1666 138 5.49994 139.6 5.49994 154C5.49994 168.4 5.49994 195.667 5.49994 207.5C4.99994 214.5 7.49994 228.5 21.4999 228.5C35.4999 228.5 180.667 228.5 251.5 228.5C255.833 227.833 264.5 224.1 264.5 214.5C264.5 204.9 264.5 170.167 264.5 154C264.667 149 262.3 139 251.5 139C240.7 139 201.333 139 183 139'
        stroke={color}
        strokeWidth='9'
        strokeLinecap='round'
        className='svg-rectangle'
      />
      <path
        className='svg-arrow'
        d='M204.5 88L145.5 148C136.3 157.2 129.167 151.833 126 148C107.833 133.167 68.1203 91.6004 65 88C58.5 80.5 61.5 70 69 70H109V8C109 1.2 113.333 0.166667 115.5 0H154.5C161.3 0 162.333 6 162 9V70H198.5C210.5 70 211.5 81 204.5 88Z'
        fill={color}
      />
      <circle className='svg-circle' cx='221.5' cy='187.5' r='12.5' fill={color} />
    </svg>
  )
}
