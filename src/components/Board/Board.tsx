import { Component, createRef } from "react";
import { Ball } from "../../util/index";
import styles from './Board.module.css';
import Modal from "../Modal/Modal";

export class Board extends Component<{}, { ref: any, showModal: boolean, x: number, y: number, startX: number, startY: number, isStart: boolean, ballId: number }> {
    state = { ref: createRef() as any, isStart: false, showModal: false, startX: 0, startY: 0, x: -1, y: -1, ballId: -1 }

    private readonly width: number = 1120
    private readonly height: number = 520

    balls = new Array(10).fill(null).map(
        (_, i) => new Ball({ width: this.width, height: this.height, id: i })
    ) as Ball[]

    render() {
        return <div>
            <Modal show={this.state.showModal} close={this.closeModal.bind(this)} setColor={this.setColor.bind(this)} />
            <canvas
            onClick={this.onClick.bind(this)}
            onMouseDown={this.onMouseDown.bind(this)}
            onMouseUp={this.onMouseUp.bind(this)}
            onMouseMove={this.onMouseMove.bind(this)}
            ref={this.state.ref}
            className={styles.board}
            width={this.width}
            height={this.height}
            ></canvas>
        </div>
    }

    componentDidMount() {
        this.updateCanvas()
    }

    updateCanvas() {
        const canvas = this.state.ref.current as any
        if(!canvas) return

        canvas.width = this.width
        canvas.height = this.height

        const ctx = canvas.getContext('2d')

        if(this.state.isStart) {
            ctx.save()
            ctx.beginPath()
            ctx.lineWidth = 5
            ctx.moveTo(this.state.startX, this.state.startY)
            ctx.lineTo(this.state.x, this.state.y)
            ctx.stroke()
            ctx.closePath()
            ctx.restore()
        }

        this.balls.map((b) => b.draw(ctx))
    }

    onMouseDown(e: any) {
        const canvas = (this.state.ref!.current as any)
        const positions = canvas.getBoundingClientRect()
        const x = Math.round((e.clientX - positions.left) * (this.width / positions.width))
        const y = Math.round((e.clientY - positions.top) * (this.height / positions.height))

        const find = this.balls.findIndex((b) => b.isClick(x, y))
        if(find !== -1 && !this.balls[find].isClicked) {
            this.setState({ isStart: true, ballId: find, startX: x, startY: y })
            return this.updateCanvas()
        }
    }

    onMouseUp() {
        if(this.state.isStart) {
            const canvas = (this.state.ref!.current as any)

            const ball = this.balls[this.state.ballId]
            if(!ball) {
                return this.setState({ isStart: false, startX: 0, startY: 0, x: -1, y: -1 })
            }

            if(this.state.x === -1 || this.state.y === -1) return

            const isX = !Boolean(this.state.x > this.state.startX)
            const isY = !Boolean(this.state.y > this.state.startY)

            this.setState({ isStart: false, ballId: 0, startX: 0, startY: 0, x: -1, y: -1 })

            return ball.click(canvas, this.balls.filter((b) => b.x !== ball.x && b.y !== ball.y), { isX, isY }, this.updateCanvas.bind(this))
        }
    }

    onMouseMove(e: any) {
        if(this.state.isStart) {
            const canvas = (this.state.ref!.current as any)
            const positions = canvas.getBoundingClientRect()
            const x = Math.round((e.clientX - positions.left) * (this.width / positions.width))
            const y = Math.round((e.clientY - positions.top) * (this.height / positions.height))
        
            this.setState({ x, y })

            return this.updateCanvas()
        }
    }

    async onClick(e: any) {
        const canvas = (this.state.ref!.current as any)
        const positions = canvas.getBoundingClientRect()
        const x = Math.round((e.clientX - positions.left) * (this.width / positions.width))
        const y = Math.round((e.clientY - positions.top) * (this.height / positions.height))

        const find = this.balls.findIndex((b) => b.isClick(x, y))
        if(find !== -1) {
            return this.setState({ showModal: true, isStart: false, ballId: find })
        }
    }

    setColor(color: any) {
        if(this.state.ballId !== -1) {
            this.balls[this.state.ballId]!.setColor(color)
            this.closeModal()
            return this.updateCanvas()
        }
    }

    closeModal() {
        return this.setState({ ballId: -1, showModal: false })
    }
}