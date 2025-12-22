import { PAGE_MAP } from "../types/page-definitions"

export default defineNuxtPlugin(() => {
  const { registerDefinitions } = usePageRegistry()

  registerDefinitions(PAGE_MAP)
})
