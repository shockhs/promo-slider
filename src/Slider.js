import styles from './assets/styles/slider.css'
import PositionsController from './Controller'
import Controls from './ControlsBar'

export default class SliderJS {
    /**
     * @param {string} sliderName - slider container id
     * @param {Object} config - configuration object
     * @param {number} config.width - Set width of the elements
     * @param {number} config.height - Set height of the elements
     * @param {number} config.iconSize - Set controls icons size
     * @param {number} config.timeout - Set timeout for auto-sliding
     * @param {boolean} config.hideControls - Hide controls bar
     */
    constructor(sliderName, { containerHeight = 370, width = 640, height = 270, iconSize = 60, timeout = 3000, hideControls = false } = {}) {
        this.slider = document.getElementById(sliderName)
        this.timeout = timeout
        this.checkedWidth = window.innerWidth > 0 && window.innerWidth >= width ? width : window.innerWidth
        this.containerHeight = containerHeight

        if (this.slider) {
            this.getSliderParams()
            this.setSlider({ height, iconSize, hideControls })
        } else {
            throw new Exeption(`Не был найден слайдер с id ${sliderName}`)
        }
    }

    getButtonBlockedStatus = () => this.buttonBlocked

    setSlider({ height, iconSize, hideControls }) {
        if (this.defaultNumberOfElements < 1) {
            throw new Exeption('Слайдер не содержит элементов внутри')
        } else {
            this.setRootStyle(height)
            this.activateContainer()
            this.setStartedParams()
            this.setStartedPositions()
            this.addListenersForTransition()
            // this.addListenersForTouchSwipe()
            // this.addListenersForMouseSwipe()
            if (!hideControls && window.innerWidth >= 724) {
                this.addControls(iconSize)
            }
        }
    }

    getSliderParams = () => {
        this.slider.className = 'slider'
        this.defaultNumberOfElements = slider.children.length
        this.numberOfElements = this.defaultNumberOfElements
    }

    setRootStyle = (height) => {
        const root = document.documentElement
        root.style.setProperty('--checkedWidth', `${this.checkedWidth}px`)
        root.style.setProperty('--height', `${height}px`)
        root.style.setProperty('--containerHeight', `${this.containerHeight}px`)
    }

    setStartedParams = () => {
        this.buttonBlocked = false
        this.startPosition = null
        this.positionsController = new PositionsController(this.numberOfElements)
    }

    setStartedPositions() {
        // const root = document.documentElement
        // root.style.setProperty('--imageUrl', `url(${this.controlContainer.children[
        //     this.positionsController.getCurrent()
        // ].firstElementChild.attributes.src.value})`)
        this.controlContainer.children[
            this.positionsController.getPrevPrev()
        ].className = `${styles.imageDefault} ${styles.prevPrevNumber}`
        this.controlContainer.children[
            this.positionsController.getPrev()
        ].className = `${styles.imageDefault} ${styles.prevNumber}`
        this.controlContainer.children[
            this.positionsController.getCurrent()
        ].className = `${styles.imageDefault} ${styles.currentNumber} ${styles.clickTransition}`
        this.controlContainer.children[
            this.positionsController.getNext()
        ].className = `${styles.imageDefault} ${styles.nextNumber}`
        this.controlContainer.children[
            this.positionsController.getNextNext()
        ].className = `${styles.imageDefault} ${styles.nextNextNumber}`
    }

    simulationNextClick = () => {
        this.controlContainer.children[this.positionsController.getPrevPrev()].className = styles.imageDefault
        this.controlContainer.children[this.positionsController.getNext()].classList.toggle(styles.clickTransition)
        this.controlContainer.children[this.positionsController.getCurrent()].classList.toggle(styles.clickTransition)
        this.controlContainer.classList.add(styles.nextClick)
        this.positionsController.goNext()
    }

    simulationPrevClick = () => {
        this.controlContainer.children[this.positionsController.getNextNext()].className = styles.imageDefault
        this.controlContainer.children[this.positionsController.getPrev()].classList.toggle(styles.clickTransition)
        this.controlContainer.children[this.positionsController.getCurrent()].classList.toggle(styles.clickTransition)
        this.controlContainer.classList.add(styles.prevClick)
        this.positionsController.goPrev()
    }

    addListenersForTransition = () => {
        this.controlContainer.addEventListener('transitionstart', () => {
            this.buttonBlocked = true
        })

        this.controlContainer.addEventListener('transitionend', () => {
            this.setStartedPositions()
            this.controlContainer.className = styles.controlContainer
            this.buttonBlocked = false
        })
    }

    addListenersForTouchSwipe = () => {
        this.slidesContainer.addEventListener(
            'touchstart',
            (event) => {
                event.preventDefault()
                this.startPosition = event.changedTouches[0].clientX
            },
            false
        )

        this.slidesContainer.addEventListener(
            'touchend',
            (event) => {
                event.preventDefault()
                console.log(event.changedTouches[0].clientX, this.startPosition);
                if (event.changedTouches[0].clientX - this.startPosition > 0) {
                    this.simulationPrevClick()
                } else {
                    this.simulationNextClick()
                }
            },
            false
        )
    }

    addListenersForMouseSwipe = () => {
        this.slidesContainer.addEventListener(
            'mousedown',
            (event) => {
                event.preventDefault()
                if (!this.buttonBlocked) {
                    this.startPosition = event.clientX
                }
            },
            false
        )

        this.slidesContainer.addEventListener(
            'mouseup',
            (event) => {
                event.preventDefault()
                if (!this.buttonBlocked) {
                    if (event.clientX - this.startPosition > 0) {
                        this.simulationPrevClick()
                    } else if (event.clientX - this.startPosition < 0) {
                        this.simulationNextClick()
                    }
                }
            },
            false
        )
    }

    activateContainer = () => {
        this.slidesContainer = document.createElement('div')
        this.controlContainer = document.createElement('div')
        this.controlContainer.className = styles.controlContainer
        this.slidesContainer.className = styles.slidesContainer

        if (this.numberOfElements === 1) {
            this.singleElementSlider()
        } else if (this.numberOfElements === 2) {
            this.twoElementsSlider()
        } else if (this.numberOfElements === 3) {
            this.threeElementsSlider()
        } else if (this.numberOfElements === 4) {
            this.fourElementsSlider()
        } else {
            this.controlContainer.append(...this.slider.children)
        }

        this.slidesContainer.append(this.controlContainer)
        this.slider.append(this.slidesContainer)
        this.slider.className = styles.slider
        const childArray = [...this.controlContainer.children]
        childArray.forEach((item) => {
            // Присвоение стиля
            // eslint-disable-next-line no-param-reassign
            item.className = styles.imageDefault
        })
    }

    singleElementSlider = () => {
        const addEl = [...this.slider.children][0].cloneNode(true)
        const addEl2 = [...this.slider.children][0].cloneNode(true)
        const addEl3 = [...this.slider.children][0].cloneNode(true)
        const addEl4 = [...this.slider.children][0].cloneNode(true)
        const arr = [...this.slider.children, addEl, addEl2, addEl3, addEl4]
        this.controlContainer.append(...arr)
        this.numberOfElements += 4
    }

    twoElementsSlider = () => {
        const addEl = [...this.slider.children][0].cloneNode(true)
        const addEl2 = [...this.slider.children][1].cloneNode(true)
        const addEl3 = [...this.slider.children][0].cloneNode(true)
        const addEl4 = [...this.slider.children][1].cloneNode(true)
        const arr = [...this.slider.children, addEl, addEl2, addEl3, addEl4]
        this.controlContainer.append(...arr)
        this.numberOfElements += 4
    }

    threeElementsSlider = () => {
        const addEl = [...this.slider.children][1].cloneNode(true)
        const addEl2 = [...this.slider.children][2].cloneNode(true)
        const arr = [...this.slider.children, addEl, addEl2]
        this.controlContainer.append(...arr)
        this.numberOfElements += 2
    }

    fourElementsSlider = () => {
        const addEl = [...this.slider.children][2].cloneNode(true)
        const arr = [...this.slider.children, addEl]
        this.controlContainer.append(...arr)
        this.numberOfElements += 1
    }

    addControls = (iconSize) => {
        this.controls = new Controls(this.slider, iconSize, {
            simulationNextClick: this.simulationNextClick,
            simulationPrevClick: this.simulationPrevClick,
            getButtonBlockedStatus: this.getButtonBlockedStatus,
        })
    }
}