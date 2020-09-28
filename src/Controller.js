import { getNextPosition } from './utils'

export default class PositionsController {
    constructor(numberOfElements) {
        this.numberOfElements = numberOfElements
        this.currentNumber = 0
    }

    getPrev = () => (this.currentNumber === 0 ? this.numberOfElements - 1 : this.currentNumber - 1)
        
    getPrevPrev = () => {
        if (this.currentNumber === 0) {
            return this.numberOfElements - 2
        } else if (this.currentNumber === 1) {
            return this.numberOfElements - 1
        } else return this.currentNumber - 2
    }

    getCurrent = () => this.currentNumber

    getNext = () => (this.currentNumber === this.numberOfElements - 1 ? 0 : this.currentNumber + 1)

    getNextNext = () => {
        if (this.currentNumber === this.numberOfElements - 1) {
            return 1
        } else if (this.currentNumber === this.numberOfElements - 2) {
            return 0
        } else return this.currentNumber + 2
    }

    goNext = () => {
        this.currentNumber = getNextPosition(
            { prevNumber: this.getPrev(), currentNumber: this.currentNumber, nextNumber: this.getNext() },
            this.numberOfElements,
            'right'
        )
    }

    goPrev = () => {
        this.currentNumber = getNextPosition(
            { prevNumber: this.getPrev(), currentNumber: this.currentNumber, nextNumber: this.getNext() },
            this.numberOfElements,
            'left'
        )
    }
}
