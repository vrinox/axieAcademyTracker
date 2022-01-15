import { Component, OnInit, Renderer2 } from '@angular/core';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.sass']
})
export class LandingPageComponent implements OnInit {

  constructor(private renderer: Renderer2) {
  }

  test: string[] = ['dsadas', 'asddsadas', 'dasdsadas', 'dsasdasdas', 'dsadasdas']

  ngOnInit(): void {

  }
}
