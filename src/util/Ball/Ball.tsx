import { random, randomElement } from "../../util"

type BallColor = 'Red' | 'Yellow' | 'Blue' | 'Green'

export const Colors = [ 'Red', 'Yellow', 'Blue', 'Green' ] as BallColor[]

export const checkColor = (color: BallColor) => {
    switch(color) {
        case 'Blue':
            return '#0000ff'
        case 'Green':
            return '#00ff00'
        case 'Red':
            return '#ff0000'
        case 'Yellow':
            return '#ffff00'
    }
}

export default class Ball {
    public x: number
    public y: number
    public isX: boolean = true
    public isY: boolean = true
    public isClicked: boolean = false

    constructor(
        readonly options: {
            size?: number,
            color?: BallColor,
            width: number,
            height: number
        }
    ) {
        if(!options?.size) {
            options.size = random(10, 50)
        }

        if(!options?.color) {
            options.color = randomElement(Colors)
        }

        this.x = random(0+options.size, options.width-options.size)
        this.y = random(0+options.size, options.height-options.size)
    }

    draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.beginPath()
        ctx.arc(this.x, this.y, this.options.size! / 2, 0, 2 * Math.PI)
        ctx.fillStyle = checkColor(this.options.color!)
        ctx.fill()
        ctx.closePath()
        ctx.restore()
    }

    isClick(x: number, y: number) {
        return x > this.x && y > this.y && this.x+this.options.size! > x && this.y+this.options.size! * 2 > y
    }

    async click(canvas: any , balls: Ball[], data: { isX: boolean, isY: boolean } = { isX: this.isX, isY: this.isY }, updateCanvas: () => any) {
        if(this.isClicked) return

        this.isClicked = true

        let force = random(100, 200)
        let checked = 1

        this.isX = data.isX
        this.isY = data.isY

        for ( let i = 0; force > i; i++ ) {
            canvas.width = 1120
            canvas.height = 520

            const ctx = canvas.getContext('2d')
            
            if(this.isX) this.x += 1
            else this.x -= 1

            if(this.isY) this.y += 1
            else this.y -= 1

            if(this.x > this.options.width-this.options.size!) {
                this.isX = false
            } else if(this.options.size! / 2 > this.x) {
                this.isX = true
            }

            if(this.y > this.options.height-this.options.size!) {
                this.isY = false
            }  else if(this.options.size! / 2 > this.y) {
                this.isY = true
            }

            this.draw(ctx)

            const bls = balls.filter((b) => b.isClick(this.x, this.y))
            if(bls.length > 0) {
                this.isX = !this.isX
                this.isY = !this.isY
                for ( let i = 0; bls.length > i; i++ ) {
                    bls[i].click(canvas, balls, { isX: !this.isX, isY: !this.isY }, updateCanvas)
                }
            }

            checked = 20 / force * i
            if(updateCanvas) updateCanvas()
            await new Promise((r) => setTimeout(() => r(''), checked))
        }

        this.isClicked = false
    }

    setColor(color: BallColor) {
        this.options.color = color
    }
}