import { saveSettings } from "./settings.service";

export const bootstrapUserSettings = async (userId: string) => {
    await saveSettings({
        userId,
        usdRateCurrent: 1450,
        taxProfiles: [
        {
            id: "cardUsd",
            name: "Tarjeta USD",
            value: "30",

        },
        {
            id: "advanceGain",
            name: "Percepcion Ganancias",
            value: "30",
        }
        ],
        updatedAt: new Date(),
    });
}