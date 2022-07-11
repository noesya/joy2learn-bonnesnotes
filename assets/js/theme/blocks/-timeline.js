const timelines = document.querySelectorAll('.block-timeline');

class BlockTimeline {
    constructor (block) {
        this.block = block;
        this.content = this.block.querySelector('.timeline');
        this.list = this.block.querySelector('.events ol');
        this.items = this.list.querySelectorAll('.event');
        this.previous = this.block.querySelector('.previous');
        this.next = this.block.querySelector('.next');

        this.index = 0;

        this.listen();
        this.resize();
        this.goTo(0);
    }

    listen () {
        window.addEventListener('resize', this.resize.bind(this));
        this.items.forEach((item, i) => {
            item.addEventListener('click', this.goTo.bind(this, i));
        });

        if (this.previous && this.next) {
            this.previous.addEventListener('click', () => {
                this.goTo(this.index-1);
            });
            this.next.addEventListener('click', () => {
                this.goTo(this.index+1);
            });
        }

        this.handleSwip();
    }

    goTo (_index) {
        this.index = Math.min(Math.max(_index, 0), this.items.length-1);
        this.update();
    }

    update () {
        this.list.style.marginLeft = `${-this.index * this.itemWidth}px`;

        this.items.forEach((item, index) => {
            if (index < this.index) {
                item.classList.add('is-passed');
            } else {
                item.classList.remove('is-passed');
            }
        });

        if (this.previous && this.next) {
            this.previous.disabled = this.index === 0;
            this.next.disabled = this.index === this.items.length - 1;
        }
    }

    resize () {
        const width = window.innerWidth,
            offset = this.getAbsoluteOffset(this.block.parentNode);
        let contentWidth = 0;

        this.block.style = '';
        this.content.style = '';

        contentWidth = this.content.offsetWidth;
        this.itemWidth = this.items[0].offsetWidth;

        this.update();
    }

    getAbsoluteOffset (_element) {
        let top = 0,
            left = 0,
            element = _element;

        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent;
        } while (element);

        return { top: top, left: left };
    }

    handleSwip () {
        let startX,
            endX,
            threshold = 30;

        // this.block.style.touchAction = 'pan-y';

        this.block.addEventListener('touchstart', (event) => {
            startX = event.changedTouches[0].screenX;
        });

        this.block.addEventListener('touchend', (event) => {
            endX = event.changedTouches[0].screenX;

            if (startX > endX + threshold) {
                // Swipe left
                this.goTo(this.index+1);
            } else if (startX < endX - threshold) {
                // Swipe right
                this.goTo(this.index-1);
            }
        });
    }
}

timelines.forEach((timeline) => {
    new BlockTimeline(timeline);
});
