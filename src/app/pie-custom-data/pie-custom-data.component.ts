import { Component, OnInit } from '@angular/core';
import { IData } from '../pie-data-interface';
import { PieDataService } from '../pie-data.service';

@Component({
  selector: 'app-pie-custom-data',
  templateUrl: './pie-custom-data.component.html',
  styleUrls: ['./pie-custom-data.component.css']
})
export class PieCustomDataComponent implements OnInit {
  ngOnInit(): void {

  }
  data: IData[] = [];
 
  newlabel: string;
  newValue: number;

  constructor(private dataService: PieDataService) {
    this.dataService.$data.subscribe(data => {
      this.data = data;
    });
  }

  addData() : void {
    let newData = {
      label: this.newlabel,
      value: this.newValue
    } as IData;

    this.dataService.addData(newData);
  }
}
