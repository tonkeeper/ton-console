import { useMemo } from "react"
import { createQR } from "@vkontakte/vk-qr"

import { cn } from "@/lib/utils"

export function BillingQrCode({
  value,
  size = 180,
  className,
  onClick,
}: {
  value: string
  size?: number
  className?: string
  onClick?: () => void
}) {
  const src = useMemo(() => {
    const svg = createQR(value, {
      qrSize: size,
      isShowLogo: false,
      foregroundColor: "#000",
      ecc: 0,
    })

    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
  }, [size, value])

  return (
    <button
      type="button"
      disabled={!onClick}
      onClick={onClick}
      className={cn(
        "mx-auto flex rounded-lg bg-white p-3",
        onClick ? "cursor-pointer" : "cursor-default",
        className
      )}
    >
      <img
        src={src}
        alt="Payment QR code"
        width={size}
        height={size}
        draggable={false}
        className="select-none"
      />
    </button>
  )
}
