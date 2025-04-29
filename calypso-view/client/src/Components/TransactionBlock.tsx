import { FC, PropsWithChildren } from "react"




export const TransactionBlock: FC<PropsWithChildren<{ data?: any, className?: string }>> = ({ /*data,*/ children, className }) => {
    return (
        <div className={`dashboard-block ${className ? className : ''}`}>
            {/* <div className="dashboard-block-title-wrapper">
                <div className="dashboard-block-title">{data.title}</div>
            </div> */}
            {children}
        </div>
    )
}