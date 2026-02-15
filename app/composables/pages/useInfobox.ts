import { useI18n } from "vue-i18n"
import { type MaybeRefOrGetter, toValue } from "vue"
import type { Property, PropertyGroup, BasePageProperties } from "../../types"

export const useInfobox = (propertiesRef: MaybeRefOrGetter<BasePageProperties>) => {
  const { locale } = useI18n()

  const isFieldVisible = (schema: Property, isReadOnly: boolean) => {
    const properties = toValue(propertiesRef)
    const passesLogic = !schema.visibleIf || schema.visibleIf(properties)
    if (!passesLogic) return false

    if (isReadOnly) {
      const val = schema.value
      if (schema.type === "text") return !!(val as Record<string, any>)?.[locale.value]
      if (schema.type === "text-array") return Array.isArray(val) && val.length > 0
      return val !== undefined && val !== null && val !== ""
    }
    return true
  }

  const shouldRenderGroup = (group: PropertyGroup, isReadOnly: boolean) => {
    return Object.values(group.fields).some((schema) => isFieldVisible(schema, isReadOnly))
  }

  const getSortedFields = (fields: Record<string, Property>) => {
    return Object.entries(fields).sort(([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0))
  }

  // Cast Object.entries to help TS understand the [string, PropertyGroup] relationship
  const getSortedGroups = (props: MaybeRefOrGetter<BasePageProperties>) => {
    const p = toValue(props)
    return (Object.entries(p) as [string, PropertyGroup][]).sort(
      ([, a], [, b]) => (a.order ?? 0) - (b.order ?? 0)
    )
  }

  return {
    isFieldVisible,
    shouldRenderGroup,
    getSortedFields,
    getSortedGroups,
    locale
  }
}
