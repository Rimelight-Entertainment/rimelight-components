import { usePageRegistry } from "rimelight-components/composables"
import { PAGE_MAP } from "~/types"

export default defineNuxtPlugin(() => {
  const { registerDefinitions } = usePageRegistry()

  registerDefinitions(PAGE_MAP)
})
