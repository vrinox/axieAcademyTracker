import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { SessionsService } from 'src/app/services/sessions/sessions.service';

@Component({
  selector: 'app-input-auto-complet',
  templateUrl: './input-auto-complet.component.html',
  styleUrls: ['./input-auto-complet.component.sass']
})
export class InputAutoCompletComponent implements OnInit {
  myControl = new FormControl();
  filteredOptions: Observable<string[]>;

  @Input() optionsFilter: string[] = [];
  @Input() label: string = '';
  @Input() keyBoardEmit: boolean = false;
  @Output() OutName = new EventEmitter();

  constructor(private sessions: SessionsService) { 
    this.filteredOptions = new Observable();
  }

  ngOnInit(): void {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value))
    );
    this.sessions.getClear().subscribe(clear=>{
      if(clear === 'name'){
        this.myControl.setValue('');
      }
      if(clear === 'parte'){
        this.myControl.setValue('');
      }
    })
  }

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.optionsFilter.filter(option => option.toLowerCase().includes(filterValue));
  }

  setOption(option: string): void{
    this.OutName.emit(option);
  }

  setKeyOption():void{
    if(this.keyBoardEmit){
      this.OutName.emit(this.myControl.value);
    }
  }

}
