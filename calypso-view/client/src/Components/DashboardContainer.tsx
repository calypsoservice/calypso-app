import { FC, PropsWithChildren } from "react"



export const DashboardContainer: FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
    return (
        <div className="flex flex-col gap-2 mb-4 dashboard-container">
            <div className="block-title">{title}</div>
            {children}
        </div>
    )
}