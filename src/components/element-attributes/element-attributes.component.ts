import { Component, OnInit } from '@angular/core';
import { AttributeNode } from 'game-capsule';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'element-attributes',
  templateUrl: './element-attributes.component.html',
  styleUrls: ['./element-attributes.component.scss'],
})
export class ElementAttributesComponent implements OnInit {
  public nodeProperties: any[];
  constructor() {

  }

  ngOnInit(): void {}



}
