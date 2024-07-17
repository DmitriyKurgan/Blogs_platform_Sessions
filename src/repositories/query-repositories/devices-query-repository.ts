import { devicesCollection} from "../db";


export const devicesQueryRepository = {
    async getAllDevices():Promise<any | { error: string }> {
        return devicesCollection.find({});
    },
}
