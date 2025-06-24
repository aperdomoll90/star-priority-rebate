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
