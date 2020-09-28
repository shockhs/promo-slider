import svgPlayPauseBtn from './assets/icons/svg'
import arrow from './assets/icons/arrow.svg'
import down from './assets/icons/down.svg'
import styles from './assets/styles/slider.css'

export default class Controls {
    /**
     * @param {external:Node} sliderName - Slider container
     * @param {number} iconSize - Set height of the icons
     * @param {Object} functions - Functions for control
     * @param {callback} functions.simulationNextClick - Callback for sliding to the right
     * @param {callback} functions.simulationPrevClick - Callback for sliding to the left
     * @param {callback} functions.getButtonBlockedStatus - Callback for getting buttonBlocked status
     */
    constructor(
        slider,
        iconSize,
        {
            simulationNextClick,
            simulationPrevClick,
            getButtonBlockedStatus,
        }
    ) {
        this.simulationNextClick = simulationNextClick
        this.simulationPrevClick = simulationPrevClick
        this.getButtonBlockedStatus = getButtonBlockedStatus
        this.statusButtonsVisibility = true

        this.setIconSize(iconSize)
        this.createButtonsContainer(slider)
        this.addOtherButtons()
        this.addListenersForSlideButtons()
    }

    setIconSize(iconSize) {
        const root = document.documentElement
        root.style.setProperty('--buttonHeight', `${iconSize}px`)
    }

    createButtonsContainer(slider) {
        this.buttonContainer = document.createElement('div')
        this.buttonContainer.className = styles.buttonContainer
        slider.append(this.buttonContainer)
    }

    addOtherButtons() {
        this.btnPrev = document.createElement('button')
        this.btnNext = document.createElement('button')
        this.btnPrev.className = styles.btnPrev
        this.btnNext.className = styles.btnNext
        this.btnPrev.innerHTML = down
        this.btnNext.innerHTML = down
        this.buttonContainer.append(this.btnPrev, this.btnNext)
    }

    hideButtons() {
        this.btnNext.classList.toggle(styles.opacityInvisible)
        this.btnPrev.classList.toggle(styles.opacityInvisible)
        this.btnNext.disabled = true
        this.btnPrev.disabled = true
    }

    openButtons() {
        this.btnNext.classList.toggle(styles.opacityInvisible)
        this.btnPrev.classList.toggle(styles.opacityInvisible)
        this.btnNext.disabled = false
        this.btnPrev.disabled = false
    }

    addListenersForSlideButtons() {
        this.btnNext.addEventListener('click', () => {
            if (!this.getButtonBlockedStatus()) {
                this.simulationNextClick()
            }
        })

        this.btnPrev.addEventListener('click', () => {
            if (!this.getButtonBlockedStatus()) {
                this.simulationPrevClick()
            }
        })
    }
}
