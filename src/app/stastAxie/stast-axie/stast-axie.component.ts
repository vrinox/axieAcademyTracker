import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-stast-axie',
  templateUrl: './stast-axie.component.html',
  styleUrls: ['./stast-axie.component.sass']
})
export class StastAxieComponent implements OnInit {
  @Input() stast: number[] = [];
  @Input() list: boolean = true;
  nameStast: string[] = ['hp', 'speed', 'skill', 'morale'];
  svgFile: string = 'assets/svg/';

  constructor() { }

  ngOnInit(): void {
    console.log(this.stast)
    if(!this.list){
      this.svgFile = 'assets/svg/axiesModule/';
    }
  }

}
