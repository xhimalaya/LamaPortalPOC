import { defineComponent, ref, onMounted } from 'vue'
import './InstallPopup.css' 

export default defineComponent({
  setup() {
    const deferredPrompt = ref(null)
    const showPopup = ref(false)
    const installed = ref(false)

    onMounted(() => {
      window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault()
        deferredPrompt.value = e
        showPopup.value = true
      })

      window.addEventListener('appinstalled', () => {
        showPopup.value = false
        deferredPrompt.value = null
        installed.value = true
      })
    })

    const installPWA = async () => {
      if (!deferredPrompt.value) return

      deferredPrompt.value.prompt()

      const { outcome } = await deferredPrompt.value.userChoice

      console.log(`User response to the install prompt: ${outcome}`)
      deferredPrompt.value = null
      showPopup.value = false
      if (outcome === 'accepted') {
        installed.value = true
      }
    }

    const closePopup = () => {
      showPopup.value = false
    }

    return () => (
      <div>
        {showPopup.value && (
          <div class="modal-overlay fixed inset-0 bg-black/50 flex justify-center items-center z-[1000]">
            <div class="modal-content bg-white p-8 rounded-xl max-w-[80%] w-full md:w-[400px] text-center relative shadow-2xl">
              <button class="close-btn absolute top-2 right-2 bg-transparent border-none text-xl cursor-pointer text-gray-500 hover:text-gray-800" onClick={closePopup}>✕</button>
              <h2 class="text-2xl font-bold mb-4">Install Our App</h2>
              <p class="mb-6">Tap below to add this app to your home screen for a better experience!</p>
              <button class="install-btn px-6 py-3 text-lg font-semibold bg-[#42b883] text-white border-none rounded-lg cursor-pointer mt-4 hover:bg-[#3aa876]" onClick={installPWA}>📲 Install Now</button>
            </div>
          </div>
        )}
        {installed.value && <p class="text-green-600 text-xl mt-4">✅ App installed! 🎉</p>}
      </div>
    )
  }
})