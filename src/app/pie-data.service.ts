import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IData } from './pie-data-interface';

@Injectable({
  providedIn: 'root'
})
export class PieDataService {

  constructor() { }

  private mockData: IData[] = [
    { label: "1. érték", value: 1},
    { label: "2. érték", value: 2},
    { label: "3. érték", value: 3},
    { label: "4. érték", value: 4}
  ]

  private dataSubject = new BehaviorSubject<IData[]>(this.mockData);

  $data = this.dataSubject.asObservable();

  addData(newData: IData): void {
    this.mockData.push(newData);
    this.dataSubject.next(this.mockData);
  }
}
