import { ChartView } from './ChartView'
import { FlowView } from './FlowView'
import { IpView } from './IpView'
import { ServiceView } from './ServiceView'

export function DataMainView({ page }) {
    return (
        <>
            {(() => {
                switch (page) {
                    case 'view':
                        return <ChartView />
                    case 'ipsource':
                        return <IpView />
                    case 'flow':
                        return <FlowView />
                    case 'service':
                        return <ServiceView />
                    default:
                        return
                }
            })()}
        </>
    )
}
