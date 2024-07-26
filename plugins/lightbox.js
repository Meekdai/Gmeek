(function() {
  class Lightbox {
    constructor(options = {}) {
      this.options = Object.assign({
        animationDuration: 300,
        closeOnOverlayClick: true,
        onOpen: null,
        onClose: null,
        onNavigate: null
      }, options);

      this.images = [];
      this.currentIndex = 0;
      this.isOpen = false;
      this.zoomLevel = 1;
      this.touchStartX = 0;
      this.touchEndX = 0;
      this.wheelTimer = null;
      this.preloadedImages = {};

      this.init();
    }

    init() {
      this.createStyles();
      this.createLightbox();
      this.bindEvents();
    }

    createStyles() {
      const style = document.createElement('style');
      style.textContent = `
        .lb-lightbox-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: transparent;
          backdrop-filter: blur(5px);
          display: flex;
          justify-content: center;
          align-items: center;
          opacity: 0;
          transition: opacity ${this.options.animationDuration}ms ease;
          pointer-events: none;
          z-index: 10000;
        }
        .lb-lightbox-overlay.active {
          pointer-events: auto;
          opacity: 1;
        }
        .lb-lightbox-content-wrapper {
          position: relative;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        .lb-lightbox-container {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform ${this.options.animationDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1);
          overflow: hidden;
        }
        .lb-lightbox-image-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          overflow: hidden;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          z-index: 1;
        }
        .lb-lightbox-image {
          max-width: 100%;
          max-height: 100%;
          height: auto;
          object-fit: contain;
          border-radius: 16px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
          transition: transform ${this.options.animationDuration}ms cubic-bezier(0.25, 0.1, 0.25, 1), opacity ${this.options.animationDuration}ms ease;
          opacity: 0;
        }
        .lb-lightbox-nav, .lb-lightbox-close {
          position: absolute;
          background-color: rgba(255, 255, 255, 0.8);
          color: #333;
          border: none;
          border-radius: 50%;
          cursor: pointer;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          width: 50px;
          height: 50px;
          font-size: 30px;
          z-index: 2;
          transition: transform 0.2s ease;
        }
        .lb-lightbox-nav:hover {
          transform: scale(1.1);
        }
        .lb-lightbox-prev {
          left: 20px;
          top: calc(50% - 25px);
        }
        .lb-lightbox-next {
          right: 20px;
          top: calc(50% - 25px);
        }
        .lb-lightbox-close {
          top: 20px;
          right: 20px;
        }
        @media (max-width: 768px) {
          .lb-lightbox-nav, .lb-lightbox-close {
            width: 40px;
            height: 40px;
            font-size: 20px;
          }
        }
      `;
      document.head.appendChild(style);
    }

    createLightbox() {
      this.overlay = document.createElement('div');
      this.overlay.className = 'lb-lightbox-overlay';

      this.contentWrapper = document.createElement('div');
      this.contentWrapper.className = 'lb-lightbox-content-wrapper';

      this.container = document.createElement('div');
      this.container.className = 'lb-lightbox-container';

      this.imageWrapper = document.createElement('div');
      this.imageWrapper.className = 'lb-lightbox-image-wrapper';

      this.image = document.createElement('img');
      this.image.className = 'lb-lightbox-image';

      this.prevButton = document.createElement('button');
      this.prevButton.className = 'lb-lightbox-nav lb-lightbox-prev';
      this.prevButton.innerHTML = '&#10094;';

      this.nextButton = document.createElement('button');
      this.nextButton.className = 'lb-lightbox-nav lb-lightbox-next';
      this.nextButton.innerHTML = '&#10095;';

      this.closeButton = document.createElement('button');
      this.closeButton.className = 'lb-lightbox-close';
      this.closeButton.innerHTML = '&times;';

      this.imageWrapper.appendChild(this.image);
      this.container.appendChild(this.imageWrapper);
      this.contentWrapper.appendChild(this.container);
      this.contentWrapper.appendChild(this.prevButton);
      this.contentWrapper.appendChild(this.nextButton);
      this.contentWrapper.appendChild(this.closeButton);

      this.overlay.appendChild(this.contentWrapper);
      document.body.appendChild(this.overlay);

      this.closeButton.addEventListener('click', this.close.bind(this));
    }

    bindEvents() {
      document.addEventListener('click', this.handleImageClick.bind(this), true);
      this.overlay.addEventListener('click', this.handleOverlayClick.bind(this));
      this.prevButton.addEventListener('click', this.showPreviousImage.bind(this));
      this.nextButton.addEventListener('click', this.showNextImage.bind(this));
      this.closeButton.addEventListener('click', this.close.bind(this));
      document.addEventListener('keydown', this.handleKeyDown.bind(this));
      this.overlay.addEventListener('wheel', this.handleWheel.bind(this));
      this.overlay.addEventListener('touchstart', this.handleTouchStart.bind(this));
      this.overlay.addEventListener('touchmove', this.handleTouchMove.bind(this));
      this.overlay.addEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    handleImageClick(event) {
      const clickedImage = event.target.closest('img');
      if (clickedImage && !this.isOpen) {
        event.preventDefault();
        event.stopPropagation();
        this.images = Array.from(document.querySelectorAll('.markdown-body img, table img'));
        this.currentIndex = this.images.indexOf(clickedImage);
        this.open();
      }
    }

    handleOverlayClick(event) {
      if (event.target === this.overlay && this.options.closeOnOverlayClick) {
        this.close();
      }
    }

    handleKeyDown(event) {
      if (!this.isOpen) return;
      switch (event.key) {
        case 'ArrowLeft':
          this.showPreviousImage();
          break;
        case 'ArrowRight':
          this.showNextImage();
          break;
        case 'Escape':
          this.close();
          break;
      }
    }

    handleWheel(event) {
      event.preventDefault();

      if (event.ctrlKey) {
        this.zoomLevel += event.deltaY > 0 ? -0.1 : 0.1;
        this.zoomLevel = Math.max(1, this.zoomLevel);
        this.image.style.transform = `scale(${this.zoomLevel})`;
      } else {
        clearTimeout(this.wheelTimer);
        this.wheelTimer = setTimeout(() => {
          const delta = Math.sign(event.deltaY);
          if (delta > 0) {
            this.showNextImage();
          } else {
            this.showPreviousImage();
          }
        }, 50);
      }
    }

    handleTouchStart(event) {
      this.touchStartX = event.touches[0].clientX;
    }

    handleTouchMove(event) {
      this.touchEndX = event.touches[0].clientX;
    }

    handleTouchEnd() {
      const difference = this.touchStartX - this.touchEndX;
      if (Math.abs(difference) > 50) {
        difference > 0 ? this.showNextImage() : this.showPreviousImage();
      }
    }

    open() {
      this.isOpen = true;
      this.overlay.classList.add('active');
      this.showImage(this.images[this.currentIndex].src);
      document.body.style.overflow = 'hidden';
      if (typeof this.options.onOpen === 'function') {
        this.options.onOpen();
      }
    }

    close() {
      document.body.style.overflow = '';
      this.overlay.classList.remove('active');
      this.isOpen = false;
      this.clearPreloadedImages();
      if (typeof this.options.onClose === 'function') {
        this.options.onClose();
      }
      this.unbindEvents();
    }

    showPreviousImage() {
      if (this.currentIndex > 0) {
        this.currentIndex--;
        this.showImage(this.images[this.currentIndex].src);
        this.resetButtonScale(this.prevButton);
      }
    }

    showNextImage() {
      if (this.currentIndex < this.images.length - 1) {
        this.currentIndex++;
        this.showImage(this.images[this.currentIndex].src);
        this.resetButtonScale(this.nextButton);
      }
    }

    resetButtonScale(button) {
      button.style.transform = 'scale(1.1)';
      setTimeout(() => {
        button.style.transform = 'scale(1)';
      }, 200);
    }

    showImage(imgSrc) {
      const newImage = new Image();
      newImage.src = imgSrc;

      newImage.onload = () => {
        this.image.style.transition = `opacity ${this.options.animationDuration}ms ease`;
        this.image.style.transform = 'scale(1)';
        this.image.src = imgSrc;
        this.image.style.opacity = '1';

        this.preloadImages(); 
        this.prevButton.style.display = this.currentIndex === 0 ? 'none' : 'block';
        this.nextButton.style.display = this.currentIndex === this.images.length - 1 ? 'none' : 'block';
      };

      newImage.onerror = () => {
        console.error('Failed to load image:', imgSrc);
      };
    }

    preloadImages() {
      const preloadNext = this.currentIndex + 1;
      const preloadPrev = this.currentIndex - 1;

      if (preloadNext < this.images.length) {
        this.preloadedImages[preloadNext] = new Image();
        this.preloadedImages[preloadNext].src = this.images[preloadNext].src;
      }

      if (preloadPrev >= 0) {
        this.preloadedImages[preloadPrev] = new Image();
        this.preloadedImages[preloadPrev].src = this.images[preloadPrev].src;
      }
    }

    clearPreloadedImages() {
      Object.keys(this.preloadedImages).forEach(key => {
        this.preloadedImages[key].src = '';
      });
      this.preloadedImages = {};
    }

    unbindEvents() {
      document.removeEventListener('click', this.handleImageClick.bind(this), true);
      this.overlay.removeEventListener('click', this.handleOverlayClick.bind(this));
      this.prevButton.removeEventListener('click', this.showPreviousImage.bind(this));
      this.nextButton.removeEventListener('click', this.showNextImage.bind(this));
      this.closeButton.removeEventListener('click', this.close.bind(this));
      document.removeEventListener('keydown', this.handleKeyDown.bind(this));
      this.overlay.removeEventListener('wheel', this.handleWheel.bind(this));
      this.overlay.removeEventListener('touchstart', this.handleTouchStart.bind(this));
      this.overlay.removeEventListener('touchmove', this.handleTouchMove.bind(this));
      this.overlay.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    }
  }

  window.Lightbox = Lightbox;

  document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
  });
})();
