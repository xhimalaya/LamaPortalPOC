import { defineComponent, ref, computed } from 'vue'
import './GlassCard.css'

export default defineComponent({
  name: 'GlassCard',

  setup() {

    /* ===== STATIC OPTIONS ===== */
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
    const selected = ref([])
    const isOpen = ref(false)

    const filteredOptions = computed(() => {
      return options.filter(option =>
        option.toLowerCase().includes(search.value.toLowerCase())
      )
    })

    const toggleSelect = (option) => {
      if (selected.value.includes(option)) {
        selected.value = selected.value.filter(o => o !== option)
      } else {
        selected.value.push(option)
      }
    }

    return () => (
      <div
        class="
          absolute
          left-1/2
          top-1/2
          -translate-x-1/2
          -translate-y-1/2
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
      >
        <div class="glass-card w-full h-full flex flex-col items-center justify-start p-6 sm:p-10 md:p-14 overflow-hidden">

          <h2 class="text-xl sm:text-2xl md:text-3xl font-semibold text-[rgb(255,217,102)] mb-6 text-center">
            Research Module
          </h2>

          {/* ===== MULTI SELECT SEARCH ===== */}

          <div class="w-full max-w-xl relative">

            {/* Input */}
            <input
              type="text"
              placeholder="Search modules..."
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

            {/* Dropdown */}
            {isOpen.value && (
              <div class="
                absolute
                mt-2
                w-full
                max-h-60
                overflow-y-auto
                rounded-xl
                bg-black/60
                backdrop-blur-xl
                border border-white/20
                shadow-xl
                z-40
              ">
                {filteredOptions.value.length > 0 ? (
                  filteredOptions.value.map(option => (
                    <div
                      key={option}
                      onClick={() => toggleSelect(option)}
                      class="
                        px-4
                        py-2
                        cursor-pointer
                        text-white
                        hover:bg-white/10
                        flex
                        justify-between
                      "
                    >
                      <span>{option}</span>
                      {selected.value.includes(option) && (
                        <span class="text-[rgb(255,217,102)]">✓</span>
                      )}
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

          {/* Selected Tags */}
          <div class="mt-4 flex flex-wrap gap-2 max-w-xl">
            {selected.value.map(option => (
              <div
                key={option}
                class="
                  px-3
                  py-1
                  rounded-full
                  bg-[rgb(255,217,102)]/20
                  text-[rgb(255,217,102)]
                  text-sm
                "
              >
                {option}
              </div>
            ))}
          </div>

        </div>
      </div>
    )
  }
})
