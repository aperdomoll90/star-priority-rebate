import checkboxStyles from '../src/components/common/formElements/CheckboxInput.module.scss'

export const SubscribeSVG = ({ isActive }: { isActive: boolean }) => {
    return (
      <svg width='100%' data-active={isActive} className={checkboxStyles['c-subscribe-svg']} height='109' viewBox='0 0 400 109' fill='none' xmlns='http://www.w3.org/2000/svg'>
        {/* Left Line */}
        <g className={checkboxStyles['c-subscribe-svg__left-line']} id='leftLineGroup' transform='translate(80,10) scale(0.8)'>
          <path d='M0,54.5 H10 M20,54.5 H35 M45,54.5 H115 M125,54.5 H135 M145,54.5 H147 M157,54.5 H167' stroke='#3a3939' strokeWidth='3' strokeLinecap='round' />
        </g>
  
        {/* Bottom Left Line */}
        <g className={`${checkboxStyles['c-subscribe-svg__bottom-left-line']}`} id='rightLineGroup' transform='translate(40, 25) scale(0.8)'>
          <path d='M0,54.5 H10 M20,54.5 H35 M45,54.5 H115 M125,54.5 H135 M145,54.5 H147 M157,54.5 H167' stroke='#3a3939' strokeWidth='3' strokeLinecap='round' />
        </g>
  
        {/* Right Line */}
        <g className={`${checkboxStyles['c-subscribe-svg__right-line']}`} id='rightLineGroup' transform='translate(250, 0) scale(0.8)'>
          <path d='M400,54.5 H390 M380,54.5 H365 M355,54.5 H285 M275,54.5 H265 M255,54.5 H253 M243,54.5 H233' stroke='#3a3939' strokeWidth='3' strokeLinecap='round' />
        </g>
  
        {/* Right Line */}
        <g className={`${checkboxStyles['c-subscribe-svg__bottom-right-line']}`} id='rightLineGroup' transform='translate(150, 15) scale(0.8)'>
          <path d='M400,54.5 H390 M380,54.5 H365 M355,54.5 H285 M275,54.5 H265 M255,54.5 H253 M243,54.5 H233' stroke='#3a3939' strokeWidth='3' strokeLinecap='round' />
        </g>
  
        {/* Envelope - centered */}
        <g className={`${checkboxStyles['c-subscribe-svg__envelope']}`} id='envelopeGroup' transform='translate(230, 25) scale(0.55)'>
          <path d='M9.5 3H154C157.5 3.2124 160 5.7124 160.5 8C160.72 9.00756 160.5 11.7744 160.5 15.7345V97.0001C160.5 99.2124 160.696 102.491 157.689 104.473C156.29 105.395 154.295 106 151.5 106H9.5C8.43328 106.082 6.84139 105.744 5.5 104.473C4.11682 103.162 3 100.858 3 97.0001V15.0001V8C3 6.33333 4.3 3 9.5 3Z' />
          <path
            d='M3 15.0001C3 43.13 3 90.0192 3 97.0001C3 100.858 4.11682 103.162 5.5 104.473M3 15.0001C3 12.5056 3 10.1586 3 8C3 6.33333 4.3 3 9.5 3H154C157.5 3.2124 160 5.7124 160.5 8C160.72 9.00756 160.5 11.7744 160.5 15.7345M3 15.0001L57 56.8776M160.5 15.7345C160.5 33.2769 160.5 74.7007 160.5 97.0001C160.5 99.2124 160.696 102.491 157.689 104.473M160.5 15.7345C146.336 26.4383 123.039 44.1284 106.531 56.8776M5.5 104.473C6.84139 105.744 8.43328 106.082 9.5 106C53.1667 106 142.7 106 151.5 106C154.295 106 156.29 105.395 157.689 104.473M5.5 104.473L57 56.8776M57 56.8776L76 71.7124C82 75.7124 82 75.7124 88 71.7124C88.4858 71.3886 96.4274 64.6809 106.531 56.8776M106.531 56.8776L157.689 104.473'
            stroke='#3a3939'
            strokeWidth='5'
          />
        </g>
      </svg>
    )
  }