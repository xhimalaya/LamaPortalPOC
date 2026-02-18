import { defineComponent, ref, computed, onMounted, onBeforeUnmount } from 'vue'
import './GlassCard.css'

export default defineComponent({
  name: 'GlassCard',

  setup() {

    /* ================= Y POSITION CONTROL ================= */
    const yOffset = '0px'
    // Example values:
    // '120px'  → move down
    // '-150px' → move up
    // '5vh'    → responsive shift


    /* ================= STATIC OPTIONS ================= */
    const options = [
      'Snow Cover Analysis',
      'Glacier Monitoring',
      'Satellite Imagery',
      'Weather Simulation',
      'Terrain Mapping',
      'Hydrological Modelling',
      'Climate Forecasting',
      'Avalanche Prediction'
    ]

    const search = ref('')
    const selected = ref(null)
    const isOpen = ref(false)
    const dropdownRef = ref(null)

    const filteredOptions = computed(() => {
      return options.filter(option =>
        option.toLowerCase().includes(search.value.toLowerCase())
      )
    })

    const selectOption = (option) => {
      selected.value = option
      search.value = option
      isOpen.value = false
    }

    /* ================= CLOSE ON OUTSIDE CLICK ================= */
    const handleClickOutside = (event) => {
      if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
        isOpen.value = false
      }
    }

    onMounted(() => {
      document.addEventListener('click', handleClickOutside)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    return () => (
      <div
        class="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          z-30
          w-[90vw]
          h-[70vh]
          sm:w-[80vw]
          sm:h-[65vh]
          md:w-[70vw]
          md:h-[60vh]
          lg:w-[60vw]
          lg:h-[60vh]
        "
        style={{
          transform: `translate(-50%, -50%) translateY(${yOffset})`
        }}
      >
        <div class="glass-card w-full h-full flex flex-col items-center justify-start p-6 sm:p-10 md:p-14 overflow-hidden">

          <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold text-[rgb(255,217,102)] mb-6 text-center">
            Research Module
          </h2>

          {/* ================= SINGLE SELECT SEARCH ================= */}

          <div ref={dropdownRef} class="w-full max-w-xl relative">

            <input
              type="text"
              placeholder="Select module..."
              value={search.value}
              onInput={(e) => {
                search.value = e.target.value
                isOpen.value = true
              }}
              onFocus={() => isOpen.value = true}
              class="
                w-full
                px-4
                py-3
                rounded-xl
                bg-white/10
                text-white
                placeholder-white/50
                border border-white/20
                focus:outline-none
                focus:ring-2
                focus:ring-[rgb(255,217,102)]
                backdrop-blur-md
              "
            />

            {isOpen.value && (
              <div class="
                absolute
                mt-2
                w-full
                max-h-60
                overflow-y-auto
                rounded-xl
                bg-black/70
                backdrop-blur-xl
                border border-white/20
                shadow-xl
                z-40
              ">
                {filteredOptions.value.length > 0 ? (
                  filteredOptions.value.map(option => (
                    <div
                      key={option}
                      onClick={() => selectOption(option)}
                      class="
                        px-4
                        py-2
                        cursor-pointer
                        text-white
                        hover:bg-white/10
                      "
                    >
                      {option}
                    </div>
                  ))
                ) : (
                  <div class="px-4 py-2 text-white/50">
                    No results found
                  </div>
                )}
              </div>
            )}

          </div>

          {/* ================= BUTTON (APPEARS AFTER SELECT) ================= */}

          <div
            class={`
              transition-all
              duration-500
              mt-8
              ${selected.value ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}
            `}
          >
            <button
                  onClick={() => {
                    window.open('/map', '_blank')
                  }}
                  class="
                    px-8
                    py-3
                    rounded-xl
                    bg-[rgb(255,217,102)]
                    text-black
                    font-semibold
                    tracking-wide
                    hover:scale-105
                    hover:bg-yellow-300
                    transition-all
                    duration-300
                    shadow-lg
                    active:scale-95
                  "
                >
                  Proceed
          </button>

          </div>

        </div>
      </div>
    )
  }
})
