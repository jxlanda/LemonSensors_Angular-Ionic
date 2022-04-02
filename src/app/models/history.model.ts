export interface History {
    _id: {
        $oid: string;
    };
    sensor: SensorMinimal;
    user: UserMinimal;
    value: number;
    datetime: Date;
    isEvent: boolean;
}
export interface SensorMinimal {
    id: string;
    name: string;
    model: string;
    measurement: string;
    storageplace: string;
    sensinginseconds: number;
    minvalue: number;
    maxvalue: number;
}

export interface UserMinimal {
    id: string;
    username: string;
    email: string;
    imgurl: string;
}

export interface FilterData {
    from: Date;
    to: Date;
    sensorid: string;
}
