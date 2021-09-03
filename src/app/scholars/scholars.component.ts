import { Component, OnInit } from '@angular/core';
import { Scholar } from '../models/scholar'


@Component({
  selector: 'app-scholars',
  templateUrl: './scholars.component.html',
  styleUrls: ['./scholars.component.sass']
})
export class ScholarsComponent implements OnInit {
  scholars: Scholar[] = [];
  displayedColumns: string[] = ['name', 'todaySLP', 'yesterdaySLP'];
  constructor() { 

  }

  ngOnInit(): void {
    this.scholars.push(new Scholar({
      name: 'victor leon',
      todaySLP: 20,
      yesterdaySLP: 50
    }))
  }

}
