import { Component, ElementRef, AfterViewInit, OnDestroy, ViewChild, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { environment } from '../../../environments/environment';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './home.component.html',
    styleUrl: './home.component.css'
})
export class HomeComponent implements AfterViewInit, OnDestroy {
    private observer: IntersectionObserver | null = null;
    private intervalId: any;

    constructor(
        private el: ElementRef,
        @Inject(PLATFORM_ID) private platformId: Object,
        private router: Router
    ) { }

    onCtaClick(): void {
        const token = localStorage.getItem('token');
        if (token) {
            window.location.href = `${environment.crmUrl}/auth/token?t=${token}`;
        } else {
            this.router.navigate(['/pricing']);
        }
    }

    ngAfterViewInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.initAnimations();
            this.initRotatingWords();
        }
    }

    ngOnDestroy(): void {
        if (this.observer) {
            this.observer.disconnect();
        }
        if (this.intervalId) {
            clearInterval(this.intervalId);
        }
    }

    private initAnimations(): void {
        const reveals = this.el.nativeElement.querySelectorAll('.reveal');

        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).classList.add('active');
                }
            });
        }, {
            threshold: 0.05 // Reduced threshold for better reliability
        });

        reveals.forEach((el: HTMLElement) => {
            this.observer?.observe(el);
        });

        // Fallback: Show everything if something went wrong or user is at the bottom
        setTimeout(() => {
            reveals.forEach((el: HTMLElement) => {
                el.classList.add('active');
            });
        }, 3000);
    }

    private initRotatingWords(): void {
        const wordList = this.el.nativeElement.querySelector('.rotating-words');
        const originalItems = this.el.nativeElement.querySelectorAll('.rotating-words li');

        if (wordList && originalItems.length > 0) {
            const HEADER_OFFSET = 75;
            const ITEM_HEIGHT = 50;
            const CLONE_COUNT = 2;

            const firstClones: Node[] = [];
            const lastClones: Node[] = [];

            for (let i = 0; i < CLONE_COUNT; i++) {
                firstClones.push(originalItems[i].cloneNode(true));
                const tailIndex = originalItems.length - 1 - i;
                lastClones.unshift(originalItems[tailIndex].cloneNode(true));
            }

            firstClones.forEach(clone => wordList.appendChild(clone));
            lastClones.forEach(clone => wordList.insertBefore(clone, wordList.firstChild));

            const allItems = this.el.nativeElement.querySelectorAll('.rotating-words li');
            let currentIndex = CLONE_COUNT;

            // Initial State
            allItems.forEach((item: HTMLElement) => item.classList.remove('active'));
            allItems[currentIndex].classList.add('active');

            wordList.style.transition = 'none';
            wordList.style.transform = `translateY(${HEADER_OFFSET - (currentIndex * ITEM_HEIGHT)}px)`;

            this.intervalId = setInterval(() => {
                currentIndex++;
                wordList.style.transition = 'transform 0.5s cubic-bezier(0.25, 1, 0.5, 1)';
                const scrollOffset = HEADER_OFFSET - (currentIndex * ITEM_HEIGHT);
                wordList.style.transform = `translateY(${scrollOffset}px)`;

                allItems.forEach((item: HTMLElement) => item.classList.remove('active'));
                if (allItems[currentIndex]) allItems[currentIndex].classList.add('active');

                const totalOriginals = originalItems.length;
                if (currentIndex === CLONE_COUNT + totalOriginals) {
                    setTimeout(() => {
                        wordList.style.transition = 'none';
                        currentIndex = CLONE_COUNT;
                        const snapOffset = HEADER_OFFSET - (currentIndex * ITEM_HEIGHT);
                        wordList.style.transform = `translateY(${snapOffset}px)`;

                        allItems.forEach((item: HTMLElement) => item.classList.remove('active'));
                        allItems[currentIndex].classList.add('active');
                    }, 500);
                }
            }, 1000);
        }
    }
}
