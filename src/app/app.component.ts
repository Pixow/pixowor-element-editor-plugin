import { Component, OnInit } from '@angular/core';
import { MessageChannel as msgc } from 'electron-re';
import { app } from 'electron';
import * as path from 'path';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'qing-subwindow-test-plugin';

  ngOnInit(): void {
    msgc.send('io-service', 'test');

    msgc.on('test_replay', (event, data) => {
      console.log('test reply data: ', data);
    });
  }
}
