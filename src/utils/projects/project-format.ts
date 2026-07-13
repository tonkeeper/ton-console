import type { DTOProject } from "@/api/api.generated"

export function formatProjectDate(value: number) {
  const timestamp = value < 1_000_000_000_000 ? value * 1000 : value

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(timestamp))
}

export function getProjectInitials(project: DTOProject) {
  return project.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("")
}

export function getProjectAccent(project: DTOProject) {
  const hue = Math.abs(project.id * 47) % 360

  return `hsl(${hue} 70% 46%)`
}

export function formatCapability(capability: string) {
  return capability
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ")
}
