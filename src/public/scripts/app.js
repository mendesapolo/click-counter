class CpsTestHistory {
    clicks = 0
    _cps
    stopedAt

    constructor(startedAt, interval = 10) {
        this.startedAt = startedAt
        this.interval = interval
    }

    get cps() {
        return this._cps
    }

    calcCps() {
        if (this.interval > 0) {
            this._cps = this.clicks / this.interval
        } else {
            this._cps = 0
        }
    }

    toJSON() {
        return {
            clicks: this.clicks,
            cps: this._cps,
            startedAt: this.startedAt,
            stopedAt: this.stopedAt,
            interval: this.interval
        }
    }
}

const HISTORY_DB = '_hostory'

window.onload = () => {
    const clickArea = document.getElementById('click-area')
    const clickLabel = document.getElementById('clickLabel')
    const cpsLabel = document.getElementById('cpsLabel')
    const timerLabel = document.getElementById('timerLabel')
    const timeSelectors = document.getElementsByName('timeSelector')
    const restartBtn = document.getElementById('restartBtn')
    const cancelBtn = document.getElementById('btnCancel')
    const clickAreaText = document.getElementById('click-area-text')
    const elementGroup = document.getElementsByClassName('element-group')[0]

    let clickCounter = 0
    let timer = 10
    let interval = 10
    let intervalId = undefined
    onRestart()

    clickArea.addEventListener('click', function (event) {
        if (timer > 0) {
            clickCounter++

            if (clickCounter === 1) {
                clickAreaText.style.display = 'none'
                cancelBtn.style.display = 'block'
                elementGroup.style.display = 'none'
                clickArea.style.height = '100%'
                const cpsTest = new CpsTestHistory(new Date(), interval)

                intervalId = setInterval(() => {
                    timer--

                    if (timer === 0) {
                        clearInterval(intervalId)

                        cpsTest.clicks = clickCounter
                        cpsTest.stopedAt = new Date()
                        cpsTest.calcCps()
                        onSaveData(cpsTest)

                        clickAreaText.style.display = 'flex'
                        clickAreaText.innerText = 'Click Here To Start'
                        elementGroup.style.display = 'flex'
                        clickArea.style.height = '240px'
                        restartBtn.style.display = 'inline-block'
                        cancelBtn.style.display = 'none'
                    }

                    timerLabel.innerText = timer + 's'
                }, 1000)
            }
            showInformations({ clicks: clickCounter, cps: clickCounter / interval })
            onExplusionEfect(this, event)
        }
    })

    timeSelectors.forEach((item) => {
        item.addEventListener('change', (event) => {
            interval = Number(document.querySelector('input[name="timeSelector"]:checked').value)
            onRestart()
        })
        item.addEventListener('click', () => {
            timeSelectors.forEach(elementAux => { elementAux.parentNode.classList.remove('active') })
            item.parentNode.classList.add('active')
        })
    })

    restartBtn.addEventListener('click', onRestart)
    cancelBtn.addEventListener('click', onCancel)

    function onCancel() {
        clearInterval(intervalId)
        elementGroup.style.display = 'flex'
        clickArea.style.height = '240px'
        restartBtn.style.display = 'inline-block'
        onRestart()
    }

    function onRestart() {
        clickCounter = 0
        timer = interval
        timerLabel.innerText = interval + 's'
        showInformations({ clicks: 0, cps: 0 })
        restartBtn.style.display = 'none'
        cancelBtn.style.display = 'none'
    }

    function showInformations(data) {
        clickLabel.innerText = `${data.clicks}`
        cpsLabel.innerText = `${Number(data.cps).toFixed(1)}`
    }

    function onSaveData(data) {
        const historyDb = localStorage.getItem(HISTORY_DB)

        if (historyDb) {
            const history = JSON.parse(historyDb)
            history.push(data)
            localStorage.setItem(HISTORY_DB, JSON.stringify(history))
        } else {
            const history = []
            history.push(data)
            localStorage.setItem(HISTORY_DB, JSON.stringify(history))
        }
    }

    function onExplusionEfect(_this, event) {
        const explosion = document.createElement("div");

        explosion.classList.add("explosion");

        const rect = _this.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        explosion.style.left = `${x -260}px`;
        explosion.style.top = `${y-200}px`;

        // clickArea.appendChild(explosion);
        _this.appendChild(explosion);

        setTimeout(() => {
            explosion.remove();
        }, 500);
    }
} 