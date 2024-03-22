export const random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

export const randomElement = <T>(array: T[]) => {
    return array[random(0, array.length-1)]
}