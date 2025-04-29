import { Tooltip } from "@mui/material"
import { useState } from "react"
import { FC, PropsWithChildren } from "react"



export const TransactionDetails: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="transaction-details">
            {children}
        </div>
    )
}

export const TransactionDetailsRow: FC<{ title: string, value: string|JSX.Element, copy?: boolean, additional?: string }> = ({ title, value, copy = false, additional }) => {

    const [tooltipOpen, setTooltipOpen] = useState<boolean>(false)
    const [tooltipTitle, setTooltipTitle] = useState<string>("Copy")

    const openTooltip = () => {
        if (typeof(value) == typeof("string")) {
            navigator.clipboard.writeText(String(value))
            setTooltipTitle("Copied")
            setTooltipOpen(true)
            setTimeout(() => { setTooltipOpen(false) }, 1500)
        }
    }

    return (
        <div className="transaction-details-row">
            <div className="transaction-details-title">
                {title}:
            </div>
            <div className="capitalize transaction-details-value">
                {value} {additional ? additional : ''}
                {copy ?
                    <Tooltip title={tooltipTitle} open={tooltipOpen} placement="top">
                        <i className="ri-file-copy-fill" onClick={openTooltip}></i>
                    </Tooltip>
                    : ''
                }
            </div>
        </div>
    )
}
