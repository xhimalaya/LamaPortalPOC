import { defineComponent } from 'vue'
import './LamaTitle.css'

export default defineComponent({
  name: 'LamaTitle',

  setup() {
    const mainText = 'LAMA'
    const subText =
      '{ LAdakh Specific Modelling and Space Applications }'

    return () => (
      <div class="absolute left-1/2 top-0 -translate-x-1/2 z-20 text-center">

        {/* ===== MAIN TITLE (Glitch) ===== */}
        <div class="glitch-wrapper">
          <h3
            class="glitch"
            data-text={mainText}
            style={{
              fontFamily: "'Pirata One', cursive",
              fontSize: '6rem',
              letterSpacing: '6px'
            }}
          >
            <span style={{ color: 'rgb(255,217,102)' }}>
              {mainText}
            </span>
          </h3>
        </div>

        {/* ===== SUBTITLE (No Glitch) ===== */}
        <p
          style={{
            marginTop: '18px',
            fontFamily: "'Cinzel', serif",
            fontSize: '2rem',
            letterSpacing: '2px'
          }}
        >
          {
            subText.split('').map((char, index) => {
              const isCapital =
                char >= 'A' && char <= 'Z'

              return (
                <span
                  key={index}
                  style={{
                    color: isCapital
                      ? 'rgb(243, 69, 0)'
                      : '#05ebdf'
                  }}
                >
                  {char}
                </span>
              )
            })
          }
        </p>

      </div>
    )
  }
})
