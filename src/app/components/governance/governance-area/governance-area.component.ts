import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-governance-area',
  templateUrl: './governance-area.component.html',
  styleUrls: ['./governance-area.component.css']
})
export class GovernanceAreaComponent implements OnInit {

  @Input() title;
  @Input() proposals;

  constructor() { }

  ngOnInit(): void {
  }

}
