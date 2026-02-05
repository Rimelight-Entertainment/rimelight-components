export interface CalloutOptions {
  icon: string
  title: string
  tooltip: string
}

export const defaultOptions = {
  enabled: true,
  prefix: "RC",
  logos: {
    mark: "",
    type: "",
    classic: "",
    symbol: ""
  } as Record<string, any>,
  callouts: {
    info: {
      icon: "lucide:shield-alert",
      title: "",
      tooltip: ""
    },
    success: {
      icon: "lucide:circle-alert",
      title: "",
      tooltip: ""
    },
    warning: {
      icon: "lucide:triangle-alert",
      title: "",
      tooltip: ""
    },
    error: {
      icon: "lucide:octagon-alert",
      title: "",
      tooltip: ""
    },
    commentary: {
      icon: "lucide:message-circle-warning",
      title: "",
      tooltip: ""
    },
    ideation: {
      icon: "lucide:badge-alert",
      title: "",
      tooltip: ""
    },
    source: {
      icon: "lucide:book-alert",
      title: "",
      tooltip: ""
    }
  }
}
