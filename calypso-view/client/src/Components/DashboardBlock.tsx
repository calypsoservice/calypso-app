import { FC, PropsWithChildren } from "react"




export const DashboardBlock: FC<PropsWithChildren<{ data: any, className?: string }>> = ({ data, children, className }) => {
    return (
        <div className={`dashboard-block ${className?className:''}`}>
            <div className="dashboard-block-title-wrapper">
                <div className="dashboard-block-title">{data.title}</div>
            </div>
            {children}
        </div>
    )
}

export const DashboardStatisticBlock: FC<PropsWithChildren<{ data: any }>> = ({ data }) => {
    return (
        <DashboardBlock data={{ title: data.title }}>
            <div className="dashboard-block-value-wrapper">
                <div className="dashboard-block-value">{data.value} {data.symbol}</div>
            </div>
        </DashboardBlock>
    )
}

export const DashboardStatisticBlock2: FC<PropsWithChildren<{ data: any }>> = ({ data }) => {
    return (
        <div className="dashboard-statistic-block">
            <div className="dashboard-statistic-block-title-wrapper">
                <i className={data.icon }></i>
                <div className="dashboard-statistic-block-title">{data.title}</div>
            </div>
            <div className="dashboard-statistic-block-value">
                {data.value} {data.symbol}
            </div>
        </div>
    )
}

export const GridColsTwoOne: FC<PropsWithChildren<{className?: string}>> = ({ children, className }) => {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4${className ? ' ' + className : ''}`}>
            {children}
        </div>
    )
}

export const GridColsTwoOneFour: FC<PropsWithChildren<{className?: string}>> = ({ children, className }) => {
    return (
        <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4${className ? ' ' + className : ''}`}>
            {children}
        </div>
    )
}