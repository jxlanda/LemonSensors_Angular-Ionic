export interface Sensor {
    _id: {
        $oid: string;
    };
    name: string;
    description: string;
    brand: string;
    model: string;
    category: string;
    measurement: string;
    minvoltage: number;
    maxvoltage: number;
    storageplace: string;
    config: Config;
    user: UserMinimal
}

export interface UserMinimal {
    id: string;
    username: string;
    email: string;
    imgurl: string;
}


export interface Config {
    sensinginseconds: number;
    minvalue: number;
    maxvalue: number;
}

export interface AddedSensor {
    $oid: string
}