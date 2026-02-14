import { computed, onMounted, onUnmounted, ref } from "vue"
import { useState } from "#app"

export const useScrollToTop = () => {
    const scrollPercentage = useState("scroll-percentage", () => 0)
    const minScrollThreshold = 15

    const isVisible = computed(() => scrollPercentage.value >= minScrollThreshold)

    function updatePageScroll() {
        if (typeof window === "undefined" || typeof document === "undefined") {
            return
        }

        const scrollY = window.scrollY
        const maxScroll = document.body.scrollHeight - window.innerHeight

        if (maxScroll <= 0) {
            scrollPercentage.value = 0
            return
        }

        scrollPercentage.value = Math.min((scrollY / maxScroll) * 100, 100)
    }

    function scrollToTop() {
        if (typeof window === "undefined") return

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    }

    // Only the "manager" should add the listener, but it's safe to add it multiple times if passive
    // However, let's just make it a global listener if it's the first time
    onMounted(() => {
        if (typeof window === "undefined") return
        window.addEventListener("scroll", updatePageScroll, { passive: true })
        updatePageScroll()
    })

    // We should be careful about removing it if other components still need it
    // But for ScrollToTop, usually there's only one.

    return {
        scrollPercentage,
        isVisible,
        scrollToTop
    }
}
