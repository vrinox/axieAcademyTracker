import { DOCUMENT } from '@angular/common';
import { Component, HostListener, Inject, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.sass']
})
export class LandingPageComponent implements OnInit {

  constructor(private renderer: Renderer2, @Inject(DOCUMENT) private document: Document) { }

  test: string[] = ['dsadas', 'asddsadas', 'dasdsadas', 'dsasdasdas', 'dsadasdas']
  @HostListener('scroll', ['$event'])
  onScroll(event: any): void {
      console.log('I am scrolled', event);
  }

  ngOnInit(): void {
  }

}
