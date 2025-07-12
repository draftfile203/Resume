import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { text } from 'stream/consumers';
import { isPlatformBrowser } from '@angular/common';
import { Inject, PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css'
})
export class ProjectsComponent implements OnInit, OnDestroy {
  projects = [
    { photo1: 'assets/autograph.png',
      link: 'autograp.netlify.app'
     },
    { photo1: 'assets/crypto.png',
      link: 'cyptowallet.netlify.app'
     }
  ];
firstLoad = true;

  currentIndex = 0;
  previousIndex = 0;
  transitioning = false;
  autoScrollInterval: any;
  animateProgress = true;
  showContent = false;
  titleLetters = 'PROJECTS'.split('');
bouncingOut = false;


  get currentProject() {
    return this.projects[this.currentIndex];
  }

  get previousProject() {
    return this.projects[this.previousIndex];
  }

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

ngOnInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    // Bounce out whole title after 3 seconds (letters slide in with stagger)
    setTimeout(() => {
      this.bouncingOut = true;
    }, 1000);

    // Show carousel only after bounce out finishes + small buffer
    setTimeout(() => {
      this.showContent = true;
      this.firstLoad = true;

      setTimeout(() => this.firstLoad = false, 1000);
      this.startAutoScroll();
    }, 1800); // 3000 + 800ms bounce out
  }
}


  ngOnDestroy(): void {
    clearInterval(this.autoScrollInterval);
  }

  startAutoScroll() {
    this.resetProgressAnimation();

    this.autoScrollInterval = setInterval(() => {
      this.nextProject(false);
    }, 5000);
  }

  resetProgressAnimation() {
    this.animateProgress = false;
    setTimeout(() => this.animateProgress = true, 50);
  }

  restartAutoScroll() {
    clearInterval(this.autoScrollInterval);
    this.startAutoScroll();
  }

  nextProject(manual = true) {
    if (this.transitioning) return;

    this.previousIndex = this.currentIndex;
    this.currentIndex = (this.currentIndex + 1) % this.projects.length;
    this.transitioning = true;

    this.resetProgressAnimation();
    if (manual) this.restartAutoScroll();

    setTimeout(() => {
      this.transitioning = false;
       this.firstLoad = false;
    }, 600); // must match the CSS animation duration
  }

  prevProject() {
    if (this.transitioning) return;

    this.previousIndex = this.currentIndex;
    this.currentIndex =
      this.currentIndex > 0 ? this.currentIndex - 1 : this.projects.length - 1;
    this.transitioning = true;

    this.resetProgressAnimation();
    this.restartAutoScroll();

    setTimeout(() => {
      this.transitioning = false;
       this.firstLoad = false;
    }, 600);
  }
}
