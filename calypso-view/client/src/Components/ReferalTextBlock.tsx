import { FC, PropsWithChildren } from "react";




export const ReferalTextBlock: FC<PropsWithChildren> = ({ children }) => {
    return (
        <div className="referral-text-block">
            {children}
        </div>
    )
}