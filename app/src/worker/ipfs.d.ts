import { RootAPI } from 'ipfs-core-types'

declare global {
    const Ipfs: {
        create(
            config?: any
        ): Promise<
            RootAPI & {
                files: {
                    stat(
                        path: string,
                        options?: {
                            size?: boolean
                        }
                    ): Promise<{ size: number }>
                }
            }
        >
    }
}
