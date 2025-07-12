import { NgFor, NgIf } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';


@Component({
  selector: 'app-education',
  standalone: true,
  imports: [NgIf,NgFor],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationComponent  implements AfterViewInit{
  opened: number | null = null;

  schools = [
    {
      title: 'School "IB-MTIEBI"',
      subtitle: 'High School Diploma',
      date: '2008 - 2020',
      description: 'Completed 12th grade with a focus on general education. Gained a strong foundation in math, science, and technology. Graduated with solid academic performance.'
    },
    {
      title: 'Tbilisi State University',
      subtitle: 'Computer Science',
      date: '2020 - 2024',
      description: ''
    },
    {
      title: 'Georgian Technical University',
      subtitle: 'Bachelor’s Degree in Computer Science',
      date: '2024 - Present',
      description: 'Currently pursuing a bachelor’s degree focused on Computer Science. Learning core subjects such as programming, software development, and systems analysis. Actively working on academic projects and self-driven learning.'
    },
    {
      title: 'IT Step Academy',
      subtitle: 'Full Stack Developer Program (In Progress)',
      date: '2024 - Present',
      description: 'Enrolled in a specialized program focused on web development and IT skills. Covering full-stack development, databases, and modern tools. Working on real-life projects to build portfolio and experience. Developing both technical and soft skills through hands-on learning.'
    }
  ];
  
  @ViewChild('glitchText') glitchText!: ElementRef;
  @ViewChild('educationIntro') educationIntro!: ElementRef;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

showEducationIntro = true;
showEducationSection = false;

ngAfterViewInit(): void {
  if (isPlatformBrowser(this.platformId)) {
    setTimeout(() => {
      this.animateEducationWord();
    }, 0);
  }
}


  animateEducationWord() {
    const el = this.glitchText.nativeElement;
    el.style.visibility = 'visible';

    gsap.fromTo(
      el,
      {
        xPercent: -50,
        yPercent: -50,
        x: '-80vw',
        y: '0',
        opacity: 0
      },
      {
        xPercent: -50,
        yPercent: -50,
        x: '0',
        y: '0',
        opacity: 1,
        duration: 1,
        ease: 'power4.out',
        onComplete: () => {
          this.moveRandomTimes(el, 3); // move 3 times
        }
      }
    );
  }
moveRandomTimes(el: HTMLElement, times: number, count = 0) {
  if (count >= times) {
    this.flyAway(el);
    return;
  }

  const sectionRect = this.educationIntro.nativeElement.getBoundingClientRect();
  const elRect = el.getBoundingClientRect();

  const maxX = (sectionRect.width - elRect.width) / 2;
  const maxY = (sectionRect.height - elRect.height) / 2;

  const randomX = Math.random() * maxX * 2 - maxX;
  const randomY = Math.random() * maxY * 2 - maxY;

  gsap.to(el, {
    x: randomX,
    y: randomY,
    xPercent: -50,
    yPercent: -50,
    duration: 0.4,
    ease: "power2.out",
    onComplete: () => {
      gsap.delayedCall(0.2, () => {
        this.moveRandomTimes(el, times, count + 1);
      });
    }
  });
}


flyAway(el: HTMLElement) {
  gsap.to(el, {
    x: `+=${Math.random() * 600 - 300}`,
    y: `+=${Math.random() * 400 - 200}`,
    xPercent: -50,
    yPercent: -50,
    opacity: 0,
    duration: 0.7,
    ease: "power4.in",
    onComplete: () => {
      this.showEducationIntro = false;
      this.showEducationSection = true;
    }
  });
}



  toggle(index: number) {
    this.opened = this.opened === index ? null : index;
  }
}
