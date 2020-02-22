export interface ChorusConfigInterface {
    depth: number,
    rate: number,
    wet: number
}

export interface DelayConfigInterface {
    time: number,
    feedback: number
}

export interface ReverbConfigInterface {
    seconds: number,
    decay: number,
    reverse: boolean,
    wet: number,
    dry: number
}